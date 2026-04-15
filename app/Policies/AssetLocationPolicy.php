<?php

namespace App\Policies;

use App\Policies\Concerns\OrganizationMasterDataPolicy;
use App\Models\AssetLocation;
use App\Models\User;

class AssetLocationPolicy extends OrganizationMasterDataPolicy
{
    protected function permissionPrefix(): string
    {
        return 'asset_location';
    }

    public function viewAny(User $user): bool
    {
        return $this->canViewAny($user);
    }

    public function view(User $user, AssetLocation $assetLocation): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $this->canManage($user, 'create');
    }

    public function update(User $user, AssetLocation $assetLocation): bool
    {
        return $this->canManage($user, 'update');
    }

    public function delete(User $user, AssetLocation $assetLocation): bool
    {
        return $this->canManage($user, 'delete');
    }
}
