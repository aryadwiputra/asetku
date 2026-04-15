<?php

namespace App\Http\Controllers;

use App\Http\Requests\Assets\StoreAssetRequest;
use App\Http\Requests\Assets\UpdateAssetRequest;
use App\Http\Requests\DataTableRequest;
use App\Models\Asset;
use App\Models\AssetCategory;
use App\Models\AssetClass;
use App\Models\AssetCondition;
use App\Models\AssetHistory;
use App\Models\AssetLocation;
use App\Models\AssetStatus;
use App\Models\AssetUser;
use App\Models\Branch;
use App\Models\CustomField;
use App\Models\Department;
use App\Models\PersonInCharge;
use App\Models\SavedFilter;
use App\Models\Unit;
use App\Models\VendorContract;
use App\Models\Warranty;
use App\Queries\AssetListQuery;
use App\Services\AssetCodeGenerator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Arr;
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

        $savedFilters = SavedFilter::query()
            ->where('entity', 'assets')
            ->orderByDesc('is_default')
            ->orderBy('name')
            ->get(['id', 'name', 'query', 'is_default']);

        return Inertia::render('assets/index', [
            'items' => $items,
            'savedFilters' => $savedFilters,
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

    public function show(Asset $asset): Response
    {
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
            'vendorContract:id,vendor_name,contract_number',
        ]);

        $histories = $asset->histories()
            ->latest()
            ->limit(100)
            ->with('changedBy:id,name')
            ->get(['id', 'action', 'description', 'changed_by', 'payload', 'created_at']);

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

        return Inertia::render('assets/show', [
            'asset' => $asset,
            'histories' => $histories,
            'attachments' => $media,
            'formMeta' => $this->formMeta(),
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
            $asset->fill($data);
            $dirty = $asset->getDirty();
            $original = $asset->getOriginal();

            $asset->save();

            if ($dirty !== []) {
                AssetHistory::query()->create([
                    'asset_id' => $asset->id,
                    'action' => 'updated',
                    'description' => __('assets.history.updated'),
                    'changed_by' => $user->id,
                    'payload' => [
                        'before' => Arr::only($original, array_keys($dirty)),
                        'after' => Arr::only($asset->getAttributes(), array_keys($dirty)),
                    ],
                ]);
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
            'categories' => AssetCategory::query()->orderBy('name')->get(['id', 'name', 'code', 'parent_id', 'depreciation_method', 'useful_life_months', 'residual_value']),
            'statuses' => AssetStatus::query()->orderBy('name')->get(['id', 'name', 'code']),
            'conditions' => AssetCondition::query()->orderBy('name')->get(['id', 'name', 'code']),
            'classes' => AssetClass::query()->orderBy('name')->get(['id', 'name', 'code']),
            'units' => Unit::query()->orderBy('name')->get(['id', 'name', 'symbol']),
            'pics' => PersonInCharge::query()->orderBy('name')->get(['id', 'name']),
            'assetUsers' => AssetUser::query()->orderBy('name')->get(['id', 'name']),
            'warranties' => Warranty::query()->orderBy('name')->get(['id', 'name', 'duration_months']),
            'vendorContracts' => VendorContract::query()->orderBy('vendor_name')->get(['id', 'vendor_name', 'contract_number']),
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
}
