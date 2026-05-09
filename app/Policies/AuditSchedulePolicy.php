<?php

namespace App\Policies;

use App\Enums\OrganizationMemberRole;
use App\Models\AuditSchedule;
use App\Models\User;

class AuditSchedulePolicy
{
    public function viewAny(User $user): bool
    {
        if ($user->can('audit.view')) {
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

    public function view(User $user, AuditSchedule $schedule): bool
    {
        if ($user->can('audit.view_all')) {
            return true;
        }

        if (! $this->viewAny($user)) {
            return false;
        }

        $organizationId = $user->current_organization_id;
        if ($organizationId === null) {
            return false;
        }

        return $schedule->organization_id === $organizationId
            && ($schedule->created_by === $user->id
                || $schedule->auditors()->where('user_id', $user->id)->exists());
    }

    public function create(User $user): bool
    {
        if ($user->can('audit.create')) {
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

    public function update(User $user, AuditSchedule $schedule): bool
    {
        if (! $this->view($user, $schedule)) {
            return false;
        }

        if ($user->can('audit.update')) {
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

    public function delete(User $user, AuditSchedule $schedule): bool
    {
        if (! $this->view($user, $schedule)) {
            return false;
        }

        if ($user->can('audit.delete')) {
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

    public function approveFindings(User $user, AuditSchedule $schedule): bool
    {
        if (! $this->view($user, $schedule)) {
            return false;
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
}
