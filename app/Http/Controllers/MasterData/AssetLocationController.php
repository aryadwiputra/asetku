<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Http\Requests\DataTableRequest;
use App\Http\Requests\MasterData\StoreAssetLocationRequest;
use App\Http\Requests\MasterData\UpdateAssetLocationRequest;
use App\Models\AssetLocation;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AssetLocationController extends Controller
{
    public function index(DataTableRequest $request): Response
    {
        $this->authorize('viewAny', AssetLocation::class);

        $search = $request->searchQuery();
        $sortBy = $request->sortBy('name');
        $sortDirection = $request->sortDirection('asc');

        $allowedSorts = ['name', 'code', 'created_at'];
        if (! in_array($sortBy, $allowedSorts, true)) {
            $sortBy = 'name';
        }

        $items = AssetLocation::query()
            ->with('parent:id,name,code')
            ->when(is_string($search) && $search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('asset_locations.name', 'like', "%{$search}%")
                        ->orWhere('asset_locations.code', 'like', "%{$search}%")
                        ->orWhere('asset_locations.description', 'like', "%{$search}%")
                        ->orWhereHas('parent', fn ($parent) => $parent->where('name', 'like', "%{$search}%")->orWhere('code', 'like', "%{$search}%"));
                });
            })
            ->orderBy($sortBy, $sortDirection)
            ->paginate($request->perPage(10))
            ->withQueryString();

        return Inertia::render('master-data/asset-locations/index', [
            'items' => $items,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', AssetLocation::class);

        $parents = AssetLocation::query()
            ->orderBy('name')
            ->get(['id', 'name', 'code']);

        return Inertia::render('master-data/asset-locations/create', [
            'parents' => $parents,
        ]);
    }

    public function store(StoreAssetLocationRequest $request): RedirectResponse
    {
        $this->authorize('create', AssetLocation::class);

        AssetLocation::query()->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('asset_locations.toast.created')]);

        return to_route('master-data.asset-locations.index');
    }

    public function edit(AssetLocation $assetLocation): Response
    {
        $this->authorize('update', $assetLocation);

        $parents = AssetLocation::query()
            ->whereKeyNot($assetLocation->id)
            ->orderBy('name')
            ->get(['id', 'name', 'code']);

        return Inertia::render('master-data/asset-locations/edit', [
            'item' => $assetLocation,
            'parents' => $parents,
        ]);
    }

    public function update(UpdateAssetLocationRequest $request, AssetLocation $assetLocation): RedirectResponse
    {
        $this->authorize('update', $assetLocation);

        $assetLocation->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('asset_locations.toast.updated')]);

        return to_route('master-data.asset-locations.index');
    }

    public function destroy(AssetLocation $assetLocation): RedirectResponse
    {
        $this->authorize('delete', $assetLocation);

        $assetLocation->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('asset_locations.toast.deleted')]);

        return to_route('master-data.asset-locations.index');
    }
}
