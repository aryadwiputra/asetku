<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Http\Requests\DataTableRequest;
use App\Http\Requests\MasterData\StoreAssetStatusRequest;
use App\Http\Requests\MasterData\UpdateAssetStatusRequest;
use App\Models\AssetStatus;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AssetStatusController extends Controller
{
    public function index(DataTableRequest $request): Response
    {
        $this->authorize('viewAny', AssetStatus::class);

        $search = $request->searchQuery();
        $sortBy = $request->sortBy('name');
        $sortDirection = $request->sortDirection('asc');

        $allowedSorts = ['name', 'code', 'created_at'];
        if (! in_array($sortBy, $allowedSorts, true)) {
            $sortBy = 'name';
        }

        $items = AssetStatus::query()
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

        return Inertia::render('master-data/asset-statuses/index', [
            'items' => $items,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', AssetStatus::class);

        return Inertia::render('master-data/asset-statuses/create');
    }

    public function store(StoreAssetStatusRequest $request): RedirectResponse
    {
        $this->authorize('create', AssetStatus::class);

        AssetStatus::query()->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('asset_statuses.toast.created')]);

        return to_route('master-data.asset-statuses.index');
    }

    public function edit(AssetStatus $assetStatus): Response
    {
        $this->authorize('update', $assetStatus);

        return Inertia::render('master-data/asset-statuses/edit', [
            'item' => $assetStatus,
        ]);
    }

    public function update(UpdateAssetStatusRequest $request, AssetStatus $assetStatus): RedirectResponse
    {
        $this->authorize('update', $assetStatus);

        $assetStatus->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('asset_statuses.toast.updated')]);

        return to_route('master-data.asset-statuses.index');
    }

    public function destroy(AssetStatus $assetStatus): RedirectResponse
    {
        $this->authorize('delete', $assetStatus);

        $assetStatus->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('asset_statuses.toast.deleted')]);

        return to_route('master-data.asset-statuses.index');
    }
}
