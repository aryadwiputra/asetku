<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Http\Requests\DataTableRequest;
use App\Http\Requests\MasterData\StoreAssetUserRequest;
use App\Http\Requests\MasterData\UpdateAssetUserRequest;
use App\Models\AssetUser;
use App\Models\Department;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AssetUserController extends Controller
{
    public function index(DataTableRequest $request): Response
    {
        $this->authorize('viewAny', AssetUser::class);

        $search = $request->searchQuery();
        $sortBy = $request->sortBy('name');
        $sortDirection = $request->sortDirection('asc');

        $allowedSorts = ['name', 'email', 'created_at'];
        if (! in_array($sortBy, $allowedSorts, true)) {
            $sortBy = 'name';
        }

        $items = AssetUser::query()
            ->with('department:id,name,code')
            ->when(is_string($search) && $search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('asset_users.name', 'like', "%{$search}%")
                        ->orWhere('asset_users.email', 'like', "%{$search}%")
                        ->orWhere('asset_users.phone', 'like', "%{$search}%")
                        ->orWhere('asset_users.notes', 'like', "%{$search}%")
                        ->orWhereHas('department', fn ($department) => $department->where('name', 'like', "%{$search}%")->orWhere('code', 'like', "%{$search}%"));
                });
            })
            ->orderBy($sortBy, $sortDirection)
            ->paginate($request->perPage(10))
            ->withQueryString();

        return Inertia::render('master-data/asset-users/index', [
            'items' => $items,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', AssetUser::class);

        $departments = Department::query()
            ->orderBy('name')
            ->get(['id', 'name', 'code']);

        return Inertia::render('master-data/asset-users/create', [
            'departments' => $departments,
        ]);
    }

    public function store(StoreAssetUserRequest $request): RedirectResponse
    {
        $this->authorize('create', AssetUser::class);

        AssetUser::query()->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('asset_users.toast.created')]);

        return to_route('master-data.asset-users.index');
    }

    public function edit(AssetUser $assetUser): Response
    {
        $this->authorize('update', $assetUser);

        $departments = Department::query()
            ->orderBy('name')
            ->get(['id', 'name', 'code']);

        return Inertia::render('master-data/asset-users/edit', [
            'item' => $assetUser,
            'departments' => $departments,
        ]);
    }

    public function update(UpdateAssetUserRequest $request, AssetUser $assetUser): RedirectResponse
    {
        $this->authorize('update', $assetUser);

        $assetUser->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('asset_users.toast.updated')]);

        return to_route('master-data.asset-users.index');
    }

    public function destroy(AssetUser $assetUser): RedirectResponse
    {
        $this->authorize('delete', $assetUser);

        $assetUser->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('asset_users.toast.deleted')]);

        return to_route('master-data.asset-users.index');
    }
}
