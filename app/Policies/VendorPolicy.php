<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Vendor;
use App\Policies\Concerns\OrganizationMasterDataPolicy;

class VendorPolicy extends OrganizationMasterDataPolicy
{
    protected function permissionPrefix(): string
    {
        return 'vendor';
    }

    public function viewAny(User $user): bool
    {
        return $this->canViewAny($user);
    }

    public function view(User $user, Vendor $vendor): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $this->canManage($user, 'create');
    }

    public function update(User $user, Vendor $vendor): bool
    {
        return $this->canManage($user, 'update');
    }

    public function delete(User $user, Vendor $vendor): bool
    {
        return $this->canManage($user, 'delete');
    }
}
