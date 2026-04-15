<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Http\Requests\DataTableRequest;
use App\Http\Requests\MasterData\StoreAssetCategoryRequest;
use App\Http\Requests\MasterData\UpdateAssetCategoryRequest;
use App\Models\AssetCategory;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AssetCategoryController extends Controller
{
    public function index(DataTableRequest $request): Response
    {
        $this->authorize('viewAny', AssetCategory::class);

        $search = $request->searchQuery();
        $sortBy = $request->sortBy('name');
        $sortDirection = $request->sortDirection('asc');

        $allowedSorts = ['name', 'code', 'created_at'];
        if (! in_array($sortBy, $allowedSorts, true)) {
            $sortBy = 'name';
        }

        $items = AssetCategory::query()
            ->with('parent:id,name,code')
            ->when(is_string($search) && $search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('asset_categories.name', 'like', "%{$search}%")
                        ->orWhere('asset_categories.code', 'like', "%{$search}%")
                        ->orWhere('asset_categories.description', 'like', "%{$search}%")
                        ->orWhereHas('parent', fn ($parent) => $parent->where('name', 'like', "%{$search}%")->orWhere('code', 'like', "%{$search}%"));
                });
            })
            ->orderBy($sortBy, $sortDirection)
            ->paginate($request->perPage(10))
            ->withQueryString();

        return Inertia::render('master-data/asset-categories/index', [
            'items' => $items,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', AssetCategory::class);

        $parents = AssetCategory::query()
            ->orderBy('name')
            ->get(['id', 'name', 'code']);

        return Inertia::render('master-data/asset-categories/create', [
            'parents' => $parents,
        ]);
    }

    public function store(StoreAssetCategoryRequest $request): RedirectResponse
    {
        $this->authorize('create', AssetCategory::class);

        AssetCategory::query()->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('asset_categories.toast.created')]);

        return to_route('master-data.asset-categories.index');
    }

    public function edit(AssetCategory $assetCategory): Response
    {
        $this->authorize('update', $assetCategory);

        $parents = AssetCategory::query()
            ->whereKeyNot($assetCategory->id)
            ->orderBy('name')
            ->get(['id', 'name', 'code']);

        return Inertia::render('master-data/asset-categories/edit', [
            'item' => $assetCategory,
            'parents' => $parents,
        ]);
    }

    public function update(UpdateAssetCategoryRequest $request, AssetCategory $assetCategory): RedirectResponse
    {
        $this->authorize('update', $assetCategory);

        $assetCategory->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('asset_categories.toast.updated')]);

        return to_route('master-data.asset-categories.index');
    }

    public function destroy(AssetCategory $assetCategory): RedirectResponse
    {
        $this->authorize('delete', $assetCategory);

        $assetCategory->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('asset_categories.toast.deleted')]);

        return to_route('master-data.asset-categories.index');
    }
}
