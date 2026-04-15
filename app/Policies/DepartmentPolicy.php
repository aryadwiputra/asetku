<?php

namespace App\Policies;

use App\Policies\Concerns\OrganizationMasterDataPolicy;
use App\Models\Department;
use App\Models\User;

class DepartmentPolicy extends OrganizationMasterDataPolicy
{
    protected function permissionPrefix(): string
    {
        return 'department';
    }

    public function viewAny(User $user): bool
    {
        return $this->canViewAny($user);
    }

    public function view(User $user, Department $department): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $this->canManage($user, 'create');
    }

    public function update(User $user, Department $department): bool
    {
        return $this->canManage($user, 'update');
    }

    public function delete(User $user, Department $department): bool
    {
        return $this->canManage($user, 'delete');
    }
}
