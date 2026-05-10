<?php

namespace App\Http\Controllers;

use App\Http\Requests\Assets\StoreAssetRequest;
use App\Http\Requests\Assets\UpdateAssetRequest;
use App\Http\Requests\DataTableRequest;
use App\Models\Asset;
use App\Models\AssetAudit;
use App\Models\AssetCategory;
use App\Models\AssetClass;
use App\Models\AssetCondition;
use App\Models\AssetDepreciationEntry;
use App\Models\AssetHistory;
use App\Models\AssetLocation;
use App\Models\AssetMaintenance;
use App\Models\AssetMovement;
use App\Models\AssetStatus;
use App\Models\AssetUser;
use App\Models\AssetWarrantyClaim;
use App\Models\Branch;
use App\Models\CustomField;
use App\Models\Department;
use App\Models\MaintenanceSchedule;
use App\Models\PersonInCharge;
use App\Models\SavedFilter;
use App\Models\Unit;
use App\Models\User;
use App\Models\VendorContract;
use App\Models\Warranty;
use App\Queries\AssetListQuery;
use App\Services\AssetAuditLogger;
use App\Services\AssetCodeGenerator;
use App\Services\AssetStatusTransitionResolver;
use App\Services\AssetWarrantyStatusService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AssetController extends Controller
{
    public function index(DataTableRequest $request): Response
    {
        $this->authorize('viewAny', Asset::class);

        $search = $request->searchQuery();
        $sortBy = $request->sortBy('created_at');
        $sortDirection = $request->sortDirection('desc');

        $allowedSorts = ['code', 'name', 'cost', 'purchase_date', 'created_at', 'updated_at'];
        if (! in_array($sortBy, $allowedSorts, true)) {
            $sortBy = 'created_at';
        }

        $filters = $request->filters();

        $items = AssetListQuery::build($request->user(), $search, $filters)
            ->orderBy($sortBy, $sortDirection)
            ->paginate($request->perPage(10))
            ->withQueryString();

        return Inertia::render('assets/index', [
            'items' => $items,
            'summary' => $this->summary($request->user(), $search, $filters),
            'savedFilters' => SavedFilter::query()
                ->where('entity', 'assets')
                ->orderByDesc('is_default')
                ->orderBy('name')
                ->get(['id', 'name', 'query', 'is_default']),
            'filtersMeta' => $this->filtersMeta(),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Asset::class);

        return Inertia::render('assets/create', $this->formMeta());
    }

    public function store(StoreAssetRequest $request, AssetCodeGenerator $codeGenerator): RedirectResponse
    {
        $this->authorize('create', Asset::class);

        $user = $request->user();
        if ($user === null) {
            abort(401);
        }

        $data = $request->validated();

        $data = $this->normalizeBranchAndRelations($data);
        $data = $this->applyCategoryDefaults($data);

        $branch = Branch::query()->findOrFail((int) $data['branch_id']);

        if (! $user->can('asset.update')) {
            $data['code'] = null;
        }

        if (! is_string($data['code'] ?? null) || trim((string) $data['code']) === '') {
            $data['code'] = $codeGenerator->generate($branch);
        }

        /** @var Asset $asset */
        $asset = DB::transaction(function () use ($data, $user): Asset {
            $asset = Asset::query()->create($data);
            $this->syncVendorContractAssignment($asset, is_numeric($data['vendor_contract_id'] ?? null) ? (int) $data['vendor_contract_id'] : null);
            $this->createDefaultMaintenanceSchedule($asset);

            AssetHistory::query()->create([
                'asset_id' => $asset->id,
                'action' => 'created',
                'description' => __('assets.history.created'),
                'changed_by' => $user->id,
                'payload' => [
                    'data' => Arr::except($data, ['metadata']),
                    'metadata' => $data['metadata'] ?? null,
                ],
            ]);

            return $asset;
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('assets.toast.created')]);

        return to_route('assets.show', $asset);
    }

    public function show(
        Asset $asset,
        AssetWarrantyStatusService $warrantyStatusService,
        AssetStatusTransitionResolver $statusTransitionResolver,
    ): Response {
        $this->authorize('view', $asset);

        $asset->load([
            'branch:id,name,code',
            'department:id,name,code,branch_id',
            'status:id,name,code',
            'condition:id,name,code',
            'category:id,name,code,parent_id',
            'location:id,name,code,branch_id,parent_id',
            'personInCharge:id,name',
            'user:id,name',
            'class:id,name,code',
            'unit:id,name,symbol',
            'warranty:id,name,duration_months',
            'vendorContract:id,vendor_id,vendor_name,contract_number,title,type,status,end_date',
            'vendorContract.vendor:id,name,is_blacklisted',
        ]);

        $histories = $asset->histories()
            ->orderByRaw('COALESCE(performed_at, created_at) DESC')
            ->limit(100)
            ->with('changedBy:id,name')
            ->get(['id', 'action', 'performed_at', 'description', 'changed_by', 'payload', 'created_at']);

        $histories = $histories->map(fn (AssetHistory $history): array => [
            'id' => $history->id,
            'action' => $history->action,
            'performed_at' => $history->performed_at,
            'description' => $history->description,
            'changed_by' => $history->changed_by,
            'actor' => $history->changedBy ? [
                'id' => $history->changedBy->id,
                'name' => $history->changedBy->name,
            ] : null,
            'payload' => $history->payload,
            'created_at' => $history->created_at,
        ]);

        $media = $asset->media()
            ->with(['mediaAsset'])
            ->orderBy('kind')
            ->orderBy('sort_order')
            ->get()
            ->map(function ($row) {
                $asset = $row->mediaAsset;

                return [
                    'id' => $row->id,
                    'kind' => $row->kind,
                    'stage' => $row->stage,
                    'document_type' => $row->document_type,
                    'sort_order' => $row->sort_order,
                    'is_primary' => (bool) $row->is_primary,
                    'media_asset' => $asset ? [
                        'id' => $asset->id,
                        'title' => $asset->title,
                        'url' => $asset->getFirstMediaUrl('file'),
                        'thumb_url' => $asset->getFirstMediaUrl('file', 'thumb'),
                        'mime' => $asset->getFirstMedia('file')?->mime_type,
                        'size' => $asset->getFirstMedia('file')?->size,
                    ] : null,
                ];
            });

        $warrantyClaims = $asset->warrantyClaims()
            ->with(['vendor:id,name', 'vendorContract:id,title,contract_number'])
            ->latest('submitted_at')
            ->latest('id')
            ->get()
            ->map(fn (AssetWarrantyClaim $claim): array => [
                'id' => $claim->id,
                'claim_reference' => $claim->claim_reference,
                'status' => $claim->status,
                'result' => $claim->result,
                'notes' => $claim->notes,
                'submitted_at' => $claim->submitted_at?->toISOString(),
                'resolved_at' => $claim->resolved_at?->toISOString(),
                'vendor' => $claim->vendor ? ['id' => $claim->vendor->id, 'name' => $claim->vendor->name] : null,
                'vendor_contract' => $claim->vendorContract ? ['id' => $claim->vendorContract->id, 'title' => $claim->vendorContract->title, 'contract_number' => $claim->vendorContract->contract_number] : null,
            ]);

        $movements = $asset->movements()
            ->with([
                'fromBranch:id,name', 'toBranch:id,name',
                'fromLocation:id,name', 'toLocation:id,name',
                'fromDepartment:id,name', 'toDepartment:id,name',
                'fromUser:id,name', 'toUser:id,name',
            ])
            ->orderByDesc('performed_at')
            ->limit(100)
            ->get()
            ->map(fn (AssetMovement $movement): array => [
                'id' => $movement->id,
                'type' => $movement->type,
                'status' => $movement->status,
                'notes' => $movement->notes,
                'performed_at' => $movement->performed_at?->toISOString(),
                'from_branch' => $movement->fromBranch ? ['id' => $movement->fromBranch->id, 'name' => $movement->fromBranch->name] : null,
                'to_branch' => $movement->toBranch ? ['id' => $movement->toBranch->id, 'name' => $movement->toBranch->name] : null,
                'from_location' => $movement->fromLocation ? ['id' => $movement->fromLocation->id, 'name' => $movement->fromLocation->name] : null,
                'to_location' => $movement->toLocation ? ['id' => $movement->toLocation->id, 'name' => $movement->toLocation->name] : null,
                'from_department' => $movement->fromDepartment ? ['id' => $movement->fromDepartment->id, 'name' => $movement->fromDepartment->name] : null,
                'to_department' => $movement->toDepartment ? ['id' => $movement->toDepartment->id, 'name' => $movement->toDepartment->name] : null,
                'from_user' => $movement->fromUser ? ['id' => $movement->fromUser->id, 'name' => $movement->fromUser->name] : null,
                'to_user' => $movement->toUser ? ['id' => $movement->toUser->id, 'name' => $movement->toUser->name] : null,
                'created_at' => $movement->created_at,
            ]);

        $maintenances = $asset->maintenances()
            ->with([
                'vendor:id,name',
                'technician:id,name',
                'branch:id,name',
            ])
            ->orderByDesc('created_at')
            ->limit(100)
            ->get()
            ->map(fn (AssetMaintenance $maintenance): array => [
                'id' => $maintenance->id,
                'type' => $maintenance->type,
                'source' => $maintenance->source,
                'priority' => $maintenance->priority,
                'status' => $maintenance->status,
                'description' => $maintenance->description,
                'cost' => $maintenance->cost,
                'vendor' => $maintenance->vendor ? ['id' => $maintenance->vendor->id, 'name' => $maintenance->vendor->name] : null,
                'technician' => $maintenance->technician ? ['id' => $maintenance->technician->id, 'name' => $maintenance->technician->name] : null,
                'branch' => $maintenance->branch ? ['id' => $maintenance->branch->id, 'name' => $maintenance->branch->name] : null,
                'performed_at' => $maintenance->performed_at?->toISOString(),
                'created_at' => $maintenance->created_at,
            ]);

        $audits = $asset->audits()
            ->with(['location:id,name'])
            ->orderByDesc('audited_at')
            ->limit(100)
            ->get()
            ->map(fn (AssetAudit $audit): array => [
                'id' => $audit->id,
                'status' => $audit->status,
                'notes' => $audit->notes,
                'audited_at' => $audit->audited_at?->toISOString(),
                'location' => $audit->location ? ['id' => $audit->location->id, 'name' => $audit->location->name] : null,
                'created_at' => $audit->created_at,
            ]);

        $depreciationEntries = AssetDepreciationEntry::query()
            ->where('asset_id', $asset->id)
            ->orderBy('period_end')
            ->limit(60)
            ->get()
            ->map(fn (AssetDepreciationEntry $entry): array => [
                'id' => $entry->id,
                'period_start' => $entry->period_start?->toDateString(),
                'period_end' => $entry->period_end?->toDateString(),
                'method' => $entry->method,
                'cost' => $entry->cost,
                'residual_value' => $entry->residual_value,
                'book_value_start' => $entry->book_value_start,
                'depreciation_amount' => $entry->depreciation_amount,
                'accumulated_depreciation' => $entry->accumulated_depreciation,
                'book_value_end' => $entry->book_value_end,
                'units_in_period' => $entry->units_in_period,
                'units_total_estimate' => $entry->units_total_estimate,
                'units_unit' => $entry->units_unit,
            ]);

        return Inertia::render('assets/show', [
            'asset' => $asset,
            'histories' => $histories,
            'attachments' => $media,
            'movements' => $movements,
            'maintenances' => $maintenances,
            'audits' => $audits,
            'depreciationEntries' => $depreciationEntries,
            'formMeta' => $this->formMeta(),
            'statusMeta' => [
                'availableStatuses' => $statusTransitionResolver->optionsForAsset($asset),
            ],
            'computedBookValue' => $asset->bookValue(),
            'warrantyStatus' => $warrantyStatusService->determine($asset),
            'warrantyClaims' => $warrantyClaims,
        ]);
    }

    public function edit(Asset $asset): Response
    {
        $this->authorize('update', $asset);

        return Inertia::render('assets/edit', array_merge($this->formMeta(), [
            'asset' => $asset->load([
                'branch:id,name,code',
                'department:id,name,code,branch_id',
                'status:id,name,code',
                'condition:id,name,code',
                'category:id,name,code,parent_id',
                'location:id,name,code,branch_id,parent_id',
                'personInCharge:id,name',
                'user:id,name',
            ]),
        ]));
    }

    public function update(UpdateAssetRequest $request, Asset $asset): RedirectResponse
    {
        $this->authorize('update', $asset);

        $user = $request->user();
        if ($user === null) {
            abort(401);
        }

        $data = $request->validated();

        $data = $this->normalizeBranchAndRelations($data);
        $data = $this->applyCategoryDefaults($data);

        if (! $user->can('asset.update')) {
            $data['code'] = $asset->code;
        }

        $dirty = [];

        DB::transaction(function () use (&$dirty, $asset, $data, $user): void {
            $audit = app(AssetAuditLogger::class);

            $asset->fill($data);
            $dirty = $asset->getDirty();
            $original = $asset->getOriginal();

            $asset->save();
            $this->syncVendorContractAssignment($asset, is_numeric($data['vendor_contract_id'] ?? null) ? (int) $data['vendor_contract_id'] : null);

            if ($dirty === []) {
                return;
            }

            $importantBuckets = [
                'asset_status_id',
                'asset_condition_id',
                'branch_id',
                'department_id',
                'asset_location_id',
                'person_in_charge_id',
                'asset_user_id',
            ];

            $changedKeys = array_keys($dirty);
            $importantChanged = array_values(array_intersect($changedKeys, $importantBuckets));

            if (in_array('asset_status_id', $importantChanged, true)) {
                $audit->logStatusChanged(
                    asset: $asset,
                    actor: $user,
                    fromStatusId: is_numeric($original['asset_status_id'] ?? null) ? (int) $original['asset_status_id'] : null,
                    toStatusId: is_numeric($asset->asset_status_id) ? (int) $asset->asset_status_id : null,
                );
            }

            if (in_array('asset_condition_id', $importantChanged, true)) {
                $audit->logConditionChanged(
                    asset: $asset,
                    actor: $user,
                    fromConditionId: is_numeric($original['asset_condition_id'] ?? null) ? (int) $original['asset_condition_id'] : null,
                    toConditionId: is_numeric($asset->asset_condition_id) ? (int) $asset->asset_condition_id : null,
                );
            }

            $relocationKeys = ['branch_id', 'department_id', 'asset_location_id'];
            if (array_intersect($importantChanged, $relocationKeys) !== []) {
                $audit->logRelocated($asset, $user, Arr::only($original, $relocationKeys), Arr::only($asset->getAttributes(), $relocationKeys));
            }

            $assignedKeys = ['person_in_charge_id', 'asset_user_id'];
            if (array_intersect($importantChanged, $assignedKeys) !== []) {
                $audit->logAssigned($asset, $user, Arr::only($original, $assignedKeys), Arr::only($asset->getAttributes(), $assignedKeys));
            }

            $nonImportantKeys = array_values(array_diff($changedKeys, $importantBuckets));
            if ($nonImportantKeys !== []) {
                $audit->logUpdated(
                    asset: $asset,
                    actor: $user,
                    before: Arr::only($original, $nonImportantKeys),
                    after: Arr::only($asset->getAttributes(), $nonImportantKeys),
                );
            }
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('assets.toast.updated')]);

        return to_route('assets.show', $asset);
    }

    public function destroy(Asset $asset): RedirectResponse
    {
        $this->authorize('delete', $asset);

        $asset->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('assets.toast.deleted')]);

        return to_route('assets.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function filtersMeta(): array
    {
        return [
            'branches' => Branch::query()->orderBy('name')->get(['id', 'name', 'code', 'is_active']),
            'departments' => Department::query()->orderBy('name')->get(['id', 'name', 'code', 'branch_id']),
            'locations' => AssetLocation::query()->orderBy('name')->get(['id', 'name', 'code', 'branch_id', 'parent_id', 'type']),
            'categories' => AssetCategory::query()->orderBy('name')->get(['id', 'name', 'code', 'parent_id']),
            'statuses' => AssetStatus::query()->orderBy('name')->get(['id', 'name', 'code']),
            'conditions' => AssetCondition::query()->orderBy('name')->get(['id', 'name', 'code']),
            'pics' => PersonInCharge::query()->orderBy('name')->get(['id', 'name']),
            'assetUsers' => AssetUser::query()->orderBy('name')->get(['id', 'name']),
        ];
    }

    /**
     * @param  array<string, string>  $filters
     * @return array{total_count:int,total_cost:string,by_status:array<int,array{id:int|null,name:string,count:int}>,by_condition:array<int,array{id:int|null,name:string,count:int}>}
     */
    private function summary(?User $user, ?string $search, array $filters): array
    {
        $base = AssetListQuery::buildBase($user, $search, $filters);

        $totalCount = (clone $base)->count('assets.id');
        $totalCost = (string) ((clone $base)->sum('assets.cost') ?? '0');

        $statusCounts = (clone $base)
            ->select('asset_status_id', DB::raw('count(*) as aggregate_count'))
            ->groupBy('asset_status_id')
            ->orderByDesc('aggregate_count')
            ->get()
            ->map(fn ($row): array => [
                'id' => $row->asset_status_id !== null ? (int) $row->asset_status_id : null,
                'count' => (int) $row->aggregate_count,
            ]);

        $conditionCounts = (clone $base)
            ->select('asset_condition_id', DB::raw('count(*) as aggregate_count'))
            ->groupBy('asset_condition_id')
            ->orderByDesc('aggregate_count')
            ->get()
            ->map(fn ($row): array => [
                'id' => $row->asset_condition_id !== null ? (int) $row->asset_condition_id : null,
                'count' => (int) $row->aggregate_count,
            ]);

        return [
            'total_count' => (int) $totalCount,
            'total_cost' => $totalCost,
            'by_status' => $this->topBuckets($statusCounts, AssetStatus::class),
            'by_condition' => $this->topBuckets($conditionCounts, AssetCondition::class),
        ];
    }

    /**
     * @param  Collection<int, array{id:int|null,count:int}>  $counts
     * @param  class-string<Model>  $modelClass
     * @return array<int, array{id:int|null,name:string,count:int}>
     */
    private function topBuckets(Collection $counts, string $modelClass): array
    {
        $ids = $counts->pluck('id')->filter()->values()->all();

        /** @var array<int, string> $names */
        $names = $modelClass::query()
            ->whereIn('id', $ids)
            ->pluck('name', 'id')
            ->mapWithKeys(fn ($name, $id) => [(int) $id => (string) $name])
            ->all();

        $rows = $counts->map(fn (array $row): array => [
            'id' => $row['id'],
            'name' => $row['id'] !== null ? ($names[(int) $row['id']] ?? '—') : '—',
            'count' => $row['count'],
        ])->all();

        usort($rows, fn (array $a, array $b) => $b['count'] <=> $a['count']);

        $top = array_slice($rows, 0, 3);
        $rest = array_slice($rows, 3);

        $others = array_sum(array_map(fn (array $row) => $row['count'], $rest));
        if ($others > 0) {
            $top[] = ['id' => null, 'name' => __('assets.kpis.others'), 'count' => $others];
        }

        return $top;
    }

    /**
     * @return array<string, mixed>
     */
    private function formMeta(): array
    {
        $customFields = CustomField::query()
            ->where('entity', 'asset')
            ->where('is_active', true)
            ->with('assetCategories:id')
            ->orderBy('sort_order')
            ->orderBy('label')
            ->get(['id', 'key', 'label', 'type', 'options', 'is_required', 'is_active', 'sort_order']);

        return [
            'branches' => Branch::query()->where('is_active', true)->orderBy('name')->get(['id', 'name', 'code']),
            'departments' => Department::query()->orderBy('name')->get(['id', 'name', 'code', 'branch_id']),
            'locations' => AssetLocation::query()->orderBy('name')->get(['id', 'name', 'code', 'branch_id', 'parent_id', 'type']),
            'categories' => AssetCategory::query()->orderBy('name')->get(['id', 'name', 'code', 'parent_id', 'depreciation_method', 'useful_life_months', 'residual_value', 'category_default_maintenance_interval']),
            'statuses' => AssetStatus::query()->orderBy('name')->get(['id', 'name', 'code']),
            'conditions' => AssetCondition::query()->orderBy('name')->get(['id', 'name', 'code']),
            'classes' => AssetClass::query()->orderBy('name')->get(['id', 'name', 'code']),
            'units' => Unit::query()->orderBy('name')->get(['id', 'name', 'symbol']),
            'pics' => PersonInCharge::query()->orderBy('name')->get(['id', 'name']),
            'assetUsers' => AssetUser::query()->orderBy('name')->get(['id', 'name']),
            'warranties' => Warranty::query()->orderBy('name')->get(['id', 'name', 'duration_months']),
            'vendorContracts' => VendorContract::query()
                ->with('vendor:id,name,is_blacklisted')
                ->orderBy('vendor_name')
                ->get(['id', 'vendor_id', 'vendor_name', 'title', 'contract_number', 'status', 'end_date'])
                ->map(fn (VendorContract $contract): array => [
                    'id' => $contract->id,
                    'vendor_name' => $contract->vendor_name,
                    'title' => $contract->title,
                    'contract_number' => $contract->contract_number,
                    'status' => $contract->status,
                    'end_date' => $contract->end_date?->toDateString(),
                    'is_vendor_blacklisted' => (bool) ($contract->vendor?->is_blacklisted ?? false),
                ]),
            'customFields' => $customFields->map(function ($field) {
                return [
                    'id' => $field->id,
                    'key' => $field->key,
                    'label' => $field->label,
                    'type' => $field->type,
                    'options' => $field->options,
                    'is_required' => (bool) $field->is_required,
                    'categories' => $field->assetCategories->pluck('id')->all(),
                ];
            }),
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function normalizeBranchAndRelations(array $data): array
    {
        $branchId = (int) ($data['branch_id'] ?? 0);
        abort_unless($branchId > 0, 422, __('assets.validation.branch_required'));

        $departmentId = $data['department_id'] ?? null;
        if (is_numeric($departmentId)) {
            $department = Department::query()->find((int) $departmentId);
            if ($department !== null && (int) $department->branch_id !== $branchId) {
                abort(422, __('assets.validation.department_branch_mismatch'));
            }
        }

        $locationId = $data['asset_location_id'] ?? null;
        if (is_numeric($locationId)) {
            $location = AssetLocation::query()->find((int) $locationId);
            if ($location !== null && (int) $location->branch_id !== $branchId) {
                abort(422, __('assets.validation.location_branch_mismatch'));
            }
        }

        return $data;
    }

    private function syncVendorContractAssignment(Asset $asset, ?int $contractId): void
    {
        if ($contractId === null || $contractId <= 0) {
            $asset->vendorContracts()->detach();

            return;
        }

        $asset->vendorContracts()->sync([
            $contractId => ['is_primary' => true],
        ]);
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function applyCategoryDefaults(array $data): array
    {
        $categoryId = $data['asset_category_id'] ?? null;
        if (! is_numeric($categoryId)) {
            return $data;
        }

        $category = AssetCategory::query()->find((int) $categoryId);
        if ($category === null) {
            return $data;
        }

        if (($data['depreciation_method'] ?? null) === null && $category->depreciation_method) {
            $data['depreciation_method'] = $category->depreciation_method;
        }
        if (($data['useful_life_months'] ?? null) === null && $category->useful_life_months !== null) {
            $data['useful_life_months'] = $category->useful_life_months;
        }
        if (($data['residual_value'] ?? null) === null && $category->residual_value !== null) {
            $data['residual_value'] = $category->residual_value;
        }

        return $data;
    }

    private function createDefaultMaintenanceSchedule(Asset $asset): void
    {
        if ($asset->asset_category_id === null) {
            return;
        }

        $category = AssetCategory::query()->find($asset->asset_category_id);
        $intervalDays = $category?->category_default_maintenance_interval;

        if (! is_int($intervalDays) || $intervalDays <= 0) {
            return;
        }

        if (MaintenanceSchedule::query()
            ->where('organization_id', $asset->organization_id)
            ->where('asset_id', $asset->id)
            ->exists()) {
            return;
        }

        $baseDate = $asset->purchase_date
            ? Carbon::parse($asset->purchase_date)
            : now();

        MaintenanceSchedule::query()->create([
            'organization_id' => $asset->organization_id,
            'asset_id' => $asset->id,
            'name' => 'Preventive Maintenance',
            'interval_days' => $intervalDays,
            'next_due_at' => $baseDate->copy()->addDays($intervalDays)->toDateString(),
            'default_priority' => 'normal',
            'is_active' => true,
        ]);
    }
}
