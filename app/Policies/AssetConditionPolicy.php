<?php

namespace App\Policies;

use App\Models\AssetCondition;
use App\Models\User;
use App\Policies\Concerns\OrganizationMasterDataPolicy;

class AssetConditionPolicy extends OrganizationMasterDataPolicy
{
    protected function permissionPrefix(): string
    {
        return 'asset_condition';
    }

    public function viewAny(User $user): bool
    {
        return $this->canViewAny($user);
    }

    public function view(User $user, AssetCondition $assetCondition): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $this->canManage($user, 'create');
    }

    public function update(User $user, AssetCondition $assetCondition): bool
    {
        return $this->canManage($user, 'update');
    }

    public function delete(User $user, AssetCondition $assetCondition): bool
    {
        return $this->canManage($user, 'delete');
    }
}
