<?php

namespace App\Policies;

use App\Enums\OrganizationMemberRole;
use App\Models\MaintenanceChecklistTemplate;
use App\Models\User;

class MaintenanceChecklistTemplatePolicy
{
    public function viewAny(User $user): bool
    {
        if ($user->can('maintenance_checklist.view')) {
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

    public function view(User $user, MaintenanceChecklistTemplate $template): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        if ($user->can('maintenance_checklist.create')) {
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

    public function update(User $user, MaintenanceChecklistTemplate $template): bool
    {
        if (! $this->view($user, $template)) {
            return false;
        }

        if ($user->can('maintenance_checklist.update')) {
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

    public function delete(User $user, MaintenanceChecklistTemplate $template): bool
    {
        if (! $this->view($user, $template)) {
            return false;
        }

        if ($user->can('maintenance_checklist.delete')) {
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
