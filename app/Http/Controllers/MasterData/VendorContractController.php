<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Http\Requests\DataTableRequest;
use App\Http\Requests\MasterData\StoreVendorContractRequest;
use App\Http\Requests\MasterData\UpdateVendorContractRequest;
use App\Models\VendorContract;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class VendorContractController extends Controller
{
    public function index(DataTableRequest $request): Response
    {
        $this->authorize('viewAny', VendorContract::class);

        $search = $request->searchQuery();
        $sortBy = $request->sortBy('vendor_name');
        $sortDirection = $request->sortDirection('asc');

        $allowedSorts = ['vendor_name', 'contract_number', 'start_date', 'end_date', 'created_at'];
        if (! in_array($sortBy, $allowedSorts, true)) {
            $sortBy = 'vendor_name';
        }

        $items = VendorContract::query()
            ->when(is_string($search) && $search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('vendor_name', 'like', "%{$search}%")
                        ->orWhere('contract_number', 'like', "%{$search}%")
                        ->orWhere('notes', 'like', "%{$search}%");
                });
            })
            ->orderBy($sortBy, $sortDirection)
            ->paginate($request->perPage(10))
            ->withQueryString();

        return Inertia::render('master-data/vendor-contracts/index', [
            'items' => $items,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', VendorContract::class);

        return Inertia::render('master-data/vendor-contracts/create');
    }

    public function store(StoreVendorContractRequest $request): RedirectResponse
    {
        $this->authorize('create', VendorContract::class);

        VendorContract::query()->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('vendor_contracts.toast.created')]);

        return to_route('master-data.vendor-contracts.index');
    }

    public function edit(VendorContract $vendorContract): Response
    {
        $this->authorize('update', $vendorContract);

        return Inertia::render('master-data/vendor-contracts/edit', [
            'item' => $vendorContract,
        ]);
    }

    public function update(UpdateVendorContractRequest $request, VendorContract $vendorContract): RedirectResponse
    {
        $this->authorize('update', $vendorContract);

        $vendorContract->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('vendor_contracts.toast.updated')]);

        return to_route('master-data.vendor-contracts.index');
    }

    public function destroy(VendorContract $vendorContract): RedirectResponse
    {
        $this->authorize('delete', $vendorContract);

        $vendorContract->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('vendor_contracts.toast.deleted')]);

        return to_route('master-data.vendor-contracts.index');
    }
}
