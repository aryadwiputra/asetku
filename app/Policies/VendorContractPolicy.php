<?php

namespace App\Policies;

use App\Policies\Concerns\OrganizationMasterDataPolicy;
use App\Models\User;
use App\Models\VendorContract;

class VendorContractPolicy extends OrganizationMasterDataPolicy
{
    protected function permissionPrefix(): string
    {
        return 'vendor_contract';
    }

    public function viewAny(User $user): bool
    {
        return $this->canViewAny($user);
    }

    public function view(User $user, VendorContract $vendorContract): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $this->canManage($user, 'create');
    }

    public function update(User $user, VendorContract $vendorContract): bool
    {
        return $this->canManage($user, 'update');
    }

    public function delete(User $user, VendorContract $vendorContract): bool
    {
        return $this->canManage($user, 'delete');
    }
}
