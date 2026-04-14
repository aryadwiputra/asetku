<?php

namespace App\Policies;

use App\Enums\OrganizationMemberRole;
use App\Models\Branch;
use App\Models\User;

class BranchPolicy
{
    public function viewAny(User $user): bool
    {
        $organizationId = $user->current_organization_id ?? $user->organization_id;

        if ($organizationId === null) {
            return $user->can('branch.view');
        }

        if ($user->can('branch.view')) {
            return true;
        }

        return $user->hasOrganizationRole((int) $organizationId, [
            OrganizationMemberRole::Owner,
            OrganizationMemberRole::Admin,
            OrganizationMemberRole::Manager,
            OrganizationMemberRole::Member,
        ]);
    }

    public function view(User $user, Branch $branch): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        $organizationId = $user->current_organization_id ?? $user->organization_id;

        if ($organizationId === null) {
            return $user->can('branch.create');
        }

        if ($user->can('branch.create')) {
            return true;
        }

        return $user->hasOrganizationRole((int) $organizationId, [
            OrganizationMemberRole::Owner,
            OrganizationMemberRole::Admin,
            OrganizationMemberRole::Manager,
        ]);
    }

    public function update(User $user, Branch $branch): bool
    {
        if ($user->can('branch.edit')) {
            return true;
        }

        $organizationId = $user->current_organization_id ?? $user->organization_id;

        if ($organizationId === null) {
            return false;
        }

        return $user->hasOrganizationRole((int) $organizationId, [
            OrganizationMemberRole::Owner,
            OrganizationMemberRole::Admin,
            OrganizationMemberRole::Manager,
        ]);
    }

    public function deactivate(User $user, Branch $branch): bool
    {
        if ($user->can('branch.deactivate')) {
            return true;
        }

        $organizationId = $user->current_organization_id ?? $user->organization_id;

        if ($organizationId === null) {
            return false;
        }

        return $user->hasOrganizationRole((int) $organizationId, [
            OrganizationMemberRole::Owner,
            OrganizationMemberRole::Admin,
            OrganizationMemberRole::Manager,
        ]);
    }
}
