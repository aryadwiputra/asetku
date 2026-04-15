<?php

namespace App\Policies;

use App\Policies\Concerns\OrganizationMasterDataPolicy;
use App\Models\AssetClass;
use App\Models\User;

class AssetClassPolicy extends OrganizationMasterDataPolicy
{
    protected function permissionPrefix(): string
    {
        return 'asset_class';
    }

    public function viewAny(User $user): bool
    {
        return $this->canViewAny($user);
    }

    public function view(User $user, AssetClass $assetClass): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $this->canManage($user, 'create');
    }

    public function update(User $user, AssetClass $assetClass): bool
    {
        return $this->canManage($user, 'update');
    }

    public function delete(User $user, AssetClass $assetClass): bool
    {
        return $this->canManage($user, 'delete');
    }
}
