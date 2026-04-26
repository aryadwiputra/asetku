<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Http\Requests\DataTableRequest;
use App\Http\Requests\MasterData\StoreVendorRequest;
use App\Http\Requests\MasterData\UpdateVendorRequest;
use App\Models\Vendor;
use App\Services\VendorRatingService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class VendorController extends Controller
{
    public function index(DataTableRequest $request, VendorRatingService $ratingService): Response
    {
        $this->authorize('viewAny', Vendor::class);

        $search = $request->searchQuery();
        $sortBy = $request->sortBy('name');
        $sortDirection = $request->sortDirection('asc');
        $allowedSorts = ['name', 'service_category', 'is_blacklisted', 'created_at'];

        if (! in_array($sortBy, $allowedSorts, true)) {
            $sortBy = 'name';
        }

        $items = Vendor::query()
            ->withCount('contracts')
            ->when(is_string($search) && $search !== '', function ($query) use ($search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('tax_number', 'like', "%{$search}%")
                        ->orWhere('service_category', 'like', "%{$search}%");
                });
            })
            ->orderBy($sortBy, $sortDirection)
            ->paginate($request->perPage(10))
            ->through(function (Vendor $vendor) use ($ratingService): array {
                return [
                    'id' => $vendor->id,
                    'name' => $vendor->name,
                    'tax_number' => $vendor->tax_number,
                    'email' => $vendor->email,
                    'phone' => $vendor->phone,
                    'service_category' => $vendor->service_category,
                    'is_blacklisted' => $vendor->is_blacklisted,
                    'contracts_count' => $vendor->contracts_count,
                    'rating' => $ratingService->summarize($vendor),
                    'created_at' => $vendor->created_at?->toISOString(),
                ];
            })
            ->withQueryString();

        return Inertia::render('master-data/vendors/index', [
            'items' => $items,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Vendor::class);

        return Inertia::render('master-data/vendors/create');
    }

    public function store(StoreVendorRequest $request): RedirectResponse
    {
        $this->authorize('create', Vendor::class);

        $data = $request->validated();
        $data['blacklisted_at'] = ($data['is_blacklisted'] ?? false) ? now() : null;

        Vendor::query()->create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('vendors.toast.created')]);

        return to_route('master-data.vendors.index');
    }

    public function edit(Vendor $vendor): Response
    {
        $this->authorize('update', $vendor);

        return Inertia::render('master-data/vendors/edit', [
            'item' => $vendor,
        ]);
    }

    public function update(UpdateVendorRequest $request, Vendor $vendor): RedirectResponse
    {
        $this->authorize('update', $vendor);

        $data = $request->validated();
        $wasBlacklisted = (bool) $vendor->is_blacklisted;
        $isBlacklisted = (bool) ($data['is_blacklisted'] ?? false);
        $data['blacklisted_at'] = $isBlacklisted ? ($wasBlacklisted ? $vendor->blacklisted_at : now()) : null;

        $vendor->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('vendors.toast.updated')]);

        return to_route('master-data.vendors.index');
    }

    public function destroy(Vendor $vendor): RedirectResponse
    {
        $this->authorize('delete', $vendor);

        $vendor->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('vendors.toast.deleted')]);

        return to_route('master-data.vendors.index');
    }
}
