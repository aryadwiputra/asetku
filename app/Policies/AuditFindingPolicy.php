<?php

namespace App\Policies;

use App\Enums\OrganizationMemberRole;
use App\Models\AuditFinding;
use App\Models\AuditSchedule;
use App\Models\User;

class AuditFindingPolicy
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

    public function view(User $user, AuditFinding $finding): bool
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

        if ((int) $finding->organization_id !== (int) $organizationId) {
            return false;
        }

        if ($finding->auditSchedule) {
            return $finding->auditSchedule->created_by === $user->id
                || $finding->auditSchedule->auditors()->where('user_id', $user->id)->exists();
        }

        return $finding->auditor_id === $user->id;
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
            OrganizationMemberRole::Member,
        ]);
    }

    public function createForSchedule(User $user, AuditSchedule $schedule): bool
    {
        if (! $schedule->auditors()->where('user_id', $user->id)->exists()) {
            return false;
        }

        return $schedule->status === 'in_progress';
    }

    public function update(User $user, AuditFinding $finding): bool
    {
        if ((int) $finding->auditor_id !== (int) $user->id) {
            return false;
        }

        if ($finding->approval_status === 'approved') {
            return false;
        }

        return true;
    }

    public function approve(User $user, AuditFinding $finding): bool
    {
        if ($finding->approval_status !== 'pending') {
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

    public function delete(User $user, AuditFinding $finding): bool
    {
        if ($finding->approval_status === 'approved') {
            return false;
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
