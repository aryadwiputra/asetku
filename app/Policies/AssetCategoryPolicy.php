<?php

namespace App\Policies;

use App\Policies\Concerns\OrganizationMasterDataPolicy;
use App\Models\AssetCategory;
use App\Models\User;

class AssetCategoryPolicy extends OrganizationMasterDataPolicy
{
    protected function permissionPrefix(): string
    {
        return 'asset_category';
    }

    public function viewAny(User $user): bool
    {
        return $this->canViewAny($user);
    }

    public function view(User $user, AssetCategory $assetCategory): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $this->canManage($user, 'create');
    }

    public function update(User $user, AssetCategory $assetCategory): bool
    {
        return $this->canManage($user, 'update');
    }

    public function delete(User $user, AssetCategory $assetCategory): bool
    {
        return $this->canManage($user, 'delete');
    }
}
