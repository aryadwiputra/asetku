<?php

namespace App\Policies;

use App\Policies\Concerns\OrganizationMasterDataPolicy;
use App\Models\Unit;
use App\Models\User;

class UnitPolicy extends OrganizationMasterDataPolicy
{
    protected function permissionPrefix(): string
    {
        return 'unit';
    }

    public function viewAny(User $user): bool
    {
        return $this->canViewAny($user);
    }

    public function view(User $user, Unit $unit): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $this->canManage($user, 'create');
    }

    public function update(User $user, Unit $unit): bool
    {
        return $this->canManage($user, 'update');
    }

    public function delete(User $user, Unit $unit): bool
    {
        return $this->canManage($user, 'delete');
    }
}
