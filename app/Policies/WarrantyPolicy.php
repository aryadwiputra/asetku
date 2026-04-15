<?php

namespace App\Policies;

use App\Policies\Concerns\OrganizationMasterDataPolicy;
use App\Models\User;
use App\Models\Warranty;

class WarrantyPolicy extends OrganizationMasterDataPolicy
{
    protected function permissionPrefix(): string
    {
        return 'warranty';
    }

    public function viewAny(User $user): bool
    {
        return $this->canViewAny($user);
    }

    public function view(User $user, Warranty $warranty): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $this->canManage($user, 'create');
    }

    public function update(User $user, Warranty $warranty): bool
    {
        return $this->canManage($user, 'update');
    }

    public function delete(User $user, Warranty $warranty): bool
    {
        return $this->canManage($user, 'delete');
    }
}
