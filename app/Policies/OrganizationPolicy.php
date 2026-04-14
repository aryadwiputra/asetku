<?php

namespace App\Policies;

use App\Enums\OrganizationMemberRole;
use App\Models\Organization;
use App\Models\User;

class OrganizationPolicy
{
    public function viewAny(User $user): bool
    {
        if ($user->can('organization.view')) {
            return true;
        }

        return $user->organizations()
            ->wherePivot('is_active', true)
            ->exists();
    }

    public function create(User $user): bool
    {
        return $user->can('organization.create');
    }

    public function update(User $user, Organization $organization): bool
    {
        if (! $organization->is_active) {
            return false;
        }

        if ($user->can('organization.edit')) {
            return true;
        }

        return $user->hasOrganizationRole($organization->id, [
            OrganizationMemberRole::Owner,
            OrganizationMemberRole::Admin,
        ]);
    }

    public function deactivate(User $user, Organization $organization): bool
    {
        if (! $organization->is_active) {
            return false;
        }

        if ($user->can('organization.deactivate')) {
            return true;
        }

        return $user->hasOrganizationRole($organization->id, [
            OrganizationMemberRole::Owner,
        ]);
    }
}
