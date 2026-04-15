<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Http\Requests\DataTableRequest;
use App\Http\Requests\MasterData\StoreAssetConditionRequest;
use App\Http\Requests\MasterData\UpdateAssetConditionRequest;
use App\Models\AssetCondition;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AssetConditionController extends Controller
{
    public function index(DataTableRequest $request): Response
    {
        $this->authorize('viewAny', AssetCondition::class);

        $search = $request->searchQuery();
        $sortBy = $request->sortBy('name');
        $sortDirection = $request->sortDirection('asc');

        $allowedSorts = ['name', 'code', 'created_at'];
        if (! in_array($sortBy, $allowedSorts, true)) {
            $sortBy = 'name';
        }

        $items = AssetCondition::query()
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

        return Inertia::render('master-data/asset-conditions/index', [
            'items' => $items,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', AssetCondition::class);

        return Inertia::render('master-data/asset-conditions/create');
    }

    public function store(StoreAssetConditionRequest $request): RedirectResponse
    {
        $this->authorize('create', AssetCondition::class);

        AssetCondition::query()->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('asset_conditions.toast.created')]);

        return to_route('master-data.asset-conditions.index');
    }

    public function edit(AssetCondition $assetCondition): Response
    {
        $this->authorize('update', $assetCondition);

        return Inertia::render('master-data/asset-conditions/edit', [
            'item' => $assetCondition,
        ]);
    }

    public function update(UpdateAssetConditionRequest $request, AssetCondition $assetCondition): RedirectResponse
    {
        $this->authorize('update', $assetCondition);

        $assetCondition->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('asset_conditions.toast.updated')]);

        return to_route('master-data.asset-conditions.index');
    }

    public function destroy(AssetCondition $assetCondition): RedirectResponse
    {
        $this->authorize('delete', $assetCondition);

        $assetCondition->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('asset_conditions.toast.deleted')]);

        return to_route('master-data.asset-conditions.index');
    }
}
