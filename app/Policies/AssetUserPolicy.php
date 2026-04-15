<?php

namespace App\Policies;

use App\Policies\Concerns\OrganizationMasterDataPolicy;
use App\Models\AssetUser;
use App\Models\User;

class AssetUserPolicy extends OrganizationMasterDataPolicy
{
    protected function permissionPrefix(): string
    {
        return 'asset_user';
    }

    public function viewAny(User $user): bool
    {
        return $this->canViewAny($user);
    }

    public function view(User $user, AssetUser $assetUser): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $this->canManage($user, 'create');
    }

    public function update(User $user, AssetUser $assetUser): bool
    {
        return $this->canManage($user, 'update');
    }

    public function delete(User $user, AssetUser $assetUser): bool
    {
        return $this->canManage($user, 'delete');
    }
}
