<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Http\Requests\DataTableRequest;
use App\Http\Requests\MasterData\StoreAssetClassRequest;
use App\Http\Requests\MasterData\UpdateAssetClassRequest;
use App\Models\AssetClass;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AssetClassController extends Controller
{
    public function index(DataTableRequest $request): Response
    {
        $this->authorize('viewAny', AssetClass::class);

        $search = $request->searchQuery();
        $sortBy = $request->sortBy('name');
        $sortDirection = $request->sortDirection('asc');

        $allowedSorts = ['name', 'code', 'created_at'];
        if (! in_array($sortBy, $allowedSorts, true)) {
            $sortBy = 'name';
        }

        $items = AssetClass::query()
            ->when(is_string($search) && $search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->orderBy($sortBy, $sortDirection)
            ->paginate($request->perPage(10))
            ->withQueryString();

        return Inertia::render('master-data/asset-classes/index', [
            'items' => $items,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', AssetClass::class);

        return Inertia::render('master-data/asset-classes/create');
    }

    public function store(StoreAssetClassRequest $request): RedirectResponse
    {
        $this->authorize('create', AssetClass::class);

        AssetClass::query()->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('asset_classes.toast.created')]);

        return to_route('master-data.asset-classes.index');
    }

    public function edit(AssetClass $assetClass): Response
    {
        $this->authorize('update', $assetClass);

        return Inertia::render('master-data/asset-classes/edit', [
            'item' => $assetClass,
        ]);
    }

    public function update(UpdateAssetClassRequest $request, AssetClass $assetClass): RedirectResponse
    {
        $this->authorize('update', $assetClass);

        $assetClass->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('asset_classes.toast.updated')]);

        return to_route('master-data.asset-classes.index');
    }

    public function destroy(AssetClass $assetClass): RedirectResponse
    {
        $this->authorize('delete', $assetClass);

        $assetClass->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('asset_classes.toast.deleted')]);

        return to_route('master-data.asset-classes.index');
    }
}
