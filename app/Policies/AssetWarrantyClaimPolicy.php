<?php

namespace App\Policies;

use App\Models\AssetWarrantyClaim;
use App\Models\User;
use App\Policies\Concerns\OrganizationMasterDataPolicy;

class AssetWarrantyClaimPolicy extends OrganizationMasterDataPolicy
{
    protected function permissionPrefix(): string
    {
        return 'warranty';
    }

    public function viewAny(User $user): bool
    {
        return $this->canViewAny($user);
    }

    public function view(User $user, AssetWarrantyClaim $assetWarrantyClaim): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $this->canManage($user, 'create');
    }

    public function update(User $user, AssetWarrantyClaim $assetWarrantyClaim): bool
    {
        return $this->canManage($user, 'update');
    }

    public function delete(User $user, AssetWarrantyClaim $assetWarrantyClaim): bool
    {
        return $this->canManage($user, 'delete');
    }
}
