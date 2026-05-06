<?php

namespace App\Policies;

use App\Enums\OrganizationMemberRole;
use App\Models\TechnicianProfile;
use App\Models\User;

class TechnicianProfilePolicy
{
    public function viewAny(User $user): bool
    {
        if ($user->can('technician.view')) {
            return true;
        }

        $organizationId = $user->current_organization_id;

        if ($organizationId === null) {
            return false;
        }

        return $user->hasOrganizationRole((int) $organizationId, [
            OrganizationMemberRole::Owner,
            OrganizationMemberRole::Admin,
            OrganizationMemberRole::Manager,
            OrganizationMemberRole::Member,
        ]);
    }

    public function view(User $user, TechnicianProfile $profile): bool
    {
        if ($profile->user_id === $user->id) {
            return true;
        }

        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        if ($user->can('technician.create')) {
            return true;
        }

        $organizationId = $user->current_organization_id;

        if ($organizationId === null) {
            return false;
        }

        return $user->hasOrganizationRole((int) $organizationId, [
            OrganizationMemberRole::Owner,
            OrganizationMemberRole::Admin,
            OrganizationMemberRole::Manager,
        ]);
    }

    public function update(User $user, TechnicianProfile $profile): bool
    {
        if (! $this->view($user, $profile)) {
            return false;
        }

        if ($user->can('technician.update')) {
            return true;
        }

        $organizationId = $user->current_organization_id;

        if ($organizationId === null) {
            return false;
        }

        return $user->hasOrganizationRole((int) $organizationId, [
            OrganizationMemberRole::Owner,
            OrganizationMemberRole::Admin,
            OrganizationMemberRole::Manager,
        ]);
    }

    public function delete(User $user, TechnicianProfile $profile): bool
    {
        if (! $this->view($user, $profile)) {
            return false;
        }

        if ($user->can('technician.delete')) {
            return true;
        }

        $organizationId = $user->current_organization_id;

        if ($organizationId === null) {
            return false;
        }

        return $user->hasOrganizationRole((int) $organizationId, [
            OrganizationMemberRole::Owner,
            OrganizationMemberRole::Admin,
        ]);
    }
}
