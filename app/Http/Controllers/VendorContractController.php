<?php

namespace App\Http\Controllers;

use App\Http\Requests\DataTableRequest;
use App\Http\Requests\StoreVendorContractDocumentRequest;
use App\Http\Requests\StoreVendorContractRequest;
use App\Http\Requests\UpdateVendorContractRequest;
use App\Models\Asset;
use App\Models\MediaAsset;
use App\Models\Vendor;
use App\Models\VendorContract;
use App\Models\VendorContractRenewal;
use App\Services\VendorContractStatusService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class VendorContractController extends Controller
{
    public function index(DataTableRequest $request, VendorContractStatusService $statusService): Response
    {
        $this->authorize('viewAny', VendorContract::class);

        $search = $request->searchQuery();
        $sortBy = $request->sortBy('end_date');
        $sortDirection = $request->sortDirection('desc');
        $allowedSorts = ['title', 'contract_number', 'start_date', 'end_date', 'status', 'created_at'];
        $filters = $request->filters();

        if (! in_array($sortBy, $allowedSorts, true)) {
            $sortBy = 'end_date';
        }

        $items = VendorContract::query()
            ->with(['vendor:id,name,is_blacklisted'])
            ->withCount('assets')
            ->withSum('maintenanceRecords as maintenance_cost_total', 'cost')
            ->when(is_string($search) && $search !== '', function ($query) use ($search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery
                        ->where('title', 'like', "%{$search}%")
                        ->orWhere('contract_number', 'like', "%{$search}%")
                        ->orWhere('vendor_name', 'like', "%{$search}%")
                        ->orWhereHas('vendor', fn ($vendorQuery) => $vendorQuery->where('name', 'like', "%{$search}%"));
                });
            })
            ->when(($filters['status'] ?? null) !== null && $filters['status'] !== '', fn ($query) => $query->where('status', $filters['status']))
            ->when(($filters['type'] ?? null) !== null && $filters['type'] !== '', fn ($query) => $query->where('type', $filters['type']))
            ->orderBy($sortBy, $sortDirection)
            ->paginate($request->perPage(10))
            ->through(function (VendorContract $contract) use ($statusService): array {
                return [
                    'id' => $contract->id,
                    'title' => $contract->title ?: $contract->vendor_name,
                    'vendor' => $contract->vendor ? [
                        'id' => $contract->vendor->id,
                        'name' => $contract->vendor->name,
                        'is_blacklisted' => (bool) $contract->vendor->is_blacklisted,
                    ] : null,
                    'type' => $contract->type,
                    'contract_number' => $contract->contract_number,
                    'status' => $statusService->determine($contract),
                    'baseline_cost' => $contract->baseline_cost,
                    'start_date' => $contract->start_date?->toDateString(),
                    'end_date' => $contract->end_date?->toDateString(),
                    'assets_count' => $contract->assets_count,
                    'maintenance_cost_total' => $contract->maintenance_cost_total,
                    'created_at' => $contract->created_at?->toISOString(),
                ];
            })
            ->withQueryString();

        return Inertia::render('vendor-contracts/index', [
            'items' => $items,
            'filters' => [
                'status' => $filters['status'] ?? '',
                'type' => $filters['type'] ?? '',
            ],
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', VendorContract::class);

        return Inertia::render('vendor-contracts/create', $this->formMeta());
    }

    public function store(StoreVendorContractRequest $request): RedirectResponse
    {
        $this->authorize('create', VendorContract::class);

        $contract = DB::transaction(function () use ($request): VendorContract {
            $data = $request->validated();
            $assetIds = array_values(array_unique(array_map('intval', Arr::wrap($data['asset_ids'] ?? []))));
            unset($data['asset_ids']);

            $vendor = Vendor::query()->findOrFail((int) $data['vendor_id']);
            $data['vendor_name'] = $vendor->name;

            $contract = VendorContract::query()->create($data);
            $this->syncAssets($contract, $assetIds);

            return $contract;
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('vendor_contracts.toast.created')]);

        return to_route('vendor-contracts.show', $contract);
    }

    public function show(VendorContract $vendorContract, VendorContractStatusService $statusService): Response
    {
        $this->authorize('view', $vendorContract);

        $vendorContract->load([
            'vendor:id,name,email,phone,service_category,is_blacklisted',
            'assets:id,code,name,vendor_contract_id',
            'renewals.renewedContract:id,title,contract_number,status,start_date,end_date',
        ]);

        $documents = MediaAsset::query()
            ->where('vendor_contract_id', $vendorContract->id)
            ->latest()
            ->get()
            ->map(fn (MediaAsset $asset): array => [
                'id' => $asset->id,
                'title' => $asset->title,
                'url' => $asset->getFirstMediaUrl('file'),
                'mime' => $asset->getFirstMedia('file')?->mime_type,
                'size' => $asset->getFirstMedia('file')?->size,
                'created_at' => $asset->created_at?->toISOString(),
            ]);

        return Inertia::render('vendor-contracts/show', [
            'contract' => [
                'id' => $vendorContract->id,
                'vendor_id' => $vendorContract->vendor_id,
                'title' => $vendorContract->title,
                'vendor_name' => $vendorContract->vendor_name,
                'contract_number' => $vendorContract->contract_number,
                'type' => $vendorContract->type,
                'status' => $statusService->determine($vendorContract),
                'baseline_cost' => $vendorContract->baseline_cost,
                'start_date' => $vendorContract->start_date?->toDateString(),
                'end_date' => $vendorContract->end_date?->toDateString(),
                'sla_response_hours' => $vendorContract->sla_response_hours,
                'sla_resolution_hours' => $vendorContract->sla_resolution_hours,
                'notes' => $vendorContract->notes,
                'terms' => $vendorContract->terms,
                'vendor' => $vendorContract->vendor,
                'assets' => $vendorContract->assets->map(fn (Asset $asset): array => [
                    'id' => $asset->id,
                    'code' => $asset->code,
                    'name' => $asset->name,
                ]),
                'maintenance_cost_total' => (string) ($vendorContract->maintenanceRecords()->sum('cost') ?? 0),
            ],
            'documents' => $documents,
            'renewals' => $vendorContract->renewals->map(fn (VendorContractRenewal $renewal): array => [
                'id' => $renewal->id,
                'status' => $renewal->status,
                'renewed_contract_id' => $renewal->renewed_contract_id,
                'field_differences' => $renewal->field_differences,
                'created_at' => $renewal->created_at?->toISOString(),
            ]),
            'formMeta' => $this->formMeta(),
        ]);
    }

    public function edit(VendorContract $vendorContract): Response
    {
        $this->authorize('update', $vendorContract);

        return Inertia::render('vendor-contracts/edit', array_merge($this->formMeta(), [
            'item' => [
                ...$vendorContract->toArray(),
                'asset_ids' => $vendorContract->assets()->pluck('assets.id')->all(),
                'start_date' => $vendorContract->start_date?->toDateString(),
                'end_date' => $vendorContract->end_date?->toDateString(),
            ],
        ]));
    }

    public function update(UpdateVendorContractRequest $request, VendorContract $vendorContract): RedirectResponse
    {
        $this->authorize('update', $vendorContract);

        DB::transaction(function () use ($request, $vendorContract): void {
            $data = $request->validated();
            $assetIds = array_values(array_unique(array_map('intval', Arr::wrap($data['asset_ids'] ?? []))));
            unset($data['asset_ids']);

            $vendor = Vendor::query()->findOrFail((int) $data['vendor_id']);
            $data['vendor_name'] = $vendor->name;

            $vendorContract->update($data);
            $this->syncAssets($vendorContract, $assetIds);
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('vendor_contracts.toast.updated')]);

        return to_route('vendor-contracts.show', $vendorContract);
    }

    public function destroy(VendorContract $vendorContract): RedirectResponse
    {
        $this->authorize('delete', $vendorContract);

        DB::transaction(function () use ($vendorContract): void {
            Asset::query()
                ->where('vendor_contract_id', $vendorContract->id)
                ->update(['vendor_contract_id' => null]);

            $vendorContract->assets()->detach();
            $vendorContract->delete();
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('vendor_contracts.toast.deleted')]);

        return to_route('vendor-contracts.index');
    }

    public function renew(VendorContract $vendorContract): RedirectResponse
    {
        $this->authorize('update', $vendorContract);

        $renewedContract = DB::transaction(function () use ($vendorContract): VendorContract {
            $snapshot = Arr::only($vendorContract->toArray(), [
                'vendor_id',
                'vendor_name',
                'title',
                'type',
                'contract_number',
                'status',
                'baseline_cost',
                'start_date',
                'end_date',
                'sla_response_hours',
                'sla_resolution_hours',
                'notes',
                'terms',
            ]);

            $renewalData = $snapshot;
            $renewalData['status'] = 'draft';
            $renewalData['contract_number'] = null;
            $renewalData['start_date'] = $vendorContract->end_date?->copy()->addDay()?->toDateString();
            $renewalData['end_date'] = null;
            $renewalData['title'] = trim((string) ($vendorContract->title ?: $vendorContract->vendor_name).' '.__('vendor_contracts.renewals.suffix'));

            $renewedContract = VendorContract::query()->create($renewalData);
            $renewedContract->assets()->sync(
                $vendorContract->assets()->pluck('assets.id')->mapWithKeys(fn ($id) => [(int) $id => ['is_primary' => false]])->all()
            );

            VendorContractRenewal::query()->create([
                'vendor_contract_id' => $vendorContract->id,
                'renewed_contract_id' => $renewedContract->id,
                'created_by' => request()->user()?->id,
                'previous_snapshot' => $snapshot,
                'renewal_snapshot' => $renewalData,
                'field_differences' => $this->fieldDifferences($snapshot, $renewalData),
                'status' => 'draft',
            ]);

            return $renewedContract;
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('vendor_contracts.toast.renewed')]);

        return to_route('vendor-contracts.edit', $renewedContract);
    }

    public function storeDocument(StoreVendorContractDocumentRequest $request, VendorContract $vendorContract): RedirectResponse
    {
        $this->authorize('update', $vendorContract);

        $document = MediaAsset::query()->create([
            'title' => $request->string('title')->toString() ?: $vendorContract->title ?: $vendorContract->vendor_name,
            'uploaded_by' => $request->user()?->id,
            'vendor_contract_id' => $vendorContract->id,
        ]);

        $document->addMediaFromRequest('file')->toMediaCollection('file');

        Inertia::flash('toast', ['type' => 'success', 'message' => __('vendor_contracts.toast.document_uploaded')]);

        return back();
    }

    private function formMeta(): array
    {
        return [
            'vendors' => Vendor::query()->orderBy('name')->get(['id', 'name', 'service_category', 'is_blacklisted']),
            'assets' => Asset::query()->orderBy('name')->get(['id', 'code', 'name', 'vendor_contract_id']),
        ];
    }

    /**
     * @param  list<int>  $assetIds
     */
    private function syncAssets(VendorContract $contract, array $assetIds): void
    {
        $syncData = collect($assetIds)
            ->values()
            ->mapWithKeys(fn (int $assetId, int $index): array => [$assetId => ['is_primary' => $index === 0]])
            ->all();

        $currentAssetIds = $contract->assets()->pluck('assets.id')->map(fn ($id) => (int) $id)->all();

        $contract->assets()->sync($syncData);

        Asset::query()
            ->whereIn('id', $currentAssetIds)
            ->where('vendor_contract_id', $contract->id)
            ->whereNotIn('id', $assetIds === [] ? [-1] : $assetIds)
            ->update(['vendor_contract_id' => null]);

        if ($assetIds !== []) {
            Asset::query()->whereIn('id', $assetIds)->update(['vendor_contract_id' => $contract->id]);
        }
    }

    /**
     * @param  array<string, mixed>  $before
     * @param  array<string, mixed>  $after
     * @return array<string, array{before:mixed,after:mixed}>
     */
    private function fieldDifferences(array $before, array $after): array
    {
        $diff = [];

        foreach ($after as $key => $value) {
            if (($before[$key] ?? null) === $value) {
                continue;
            }

            $diff[$key] = [
                'before' => $before[$key] ?? null,
                'after' => $value,
            ];
        }

        return $diff;
    }
}
