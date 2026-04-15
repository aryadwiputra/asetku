<?php

namespace App\Policies;

use App\Policies\Concerns\OrganizationMasterDataPolicy;
use App\Models\PersonInCharge;
use App\Models\User;

class PersonInChargePolicy extends OrganizationMasterDataPolicy
{
    protected function permissionPrefix(): string
    {
        return 'person_in_charge';
    }

    public function viewAny(User $user): bool
    {
        return $this->canViewAny($user);
    }

    public function view(User $user, PersonInCharge $personInCharge): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $this->canManage($user, 'create');
    }

    public function update(User $user, PersonInCharge $personInCharge): bool
    {
        return $this->canManage($user, 'update');
    }

    public function delete(User $user, PersonInCharge $personInCharge): bool
    {
        return $this->canManage($user, 'delete');
    }
}
