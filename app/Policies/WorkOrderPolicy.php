<?php

namespace App\Policies;

use App\Enums\OrganizationMemberRole;
use App\Models\AssetMaintenance;
use App\Models\User;

class WorkOrderPolicy
{
    public function viewAny(User $user): bool
    {
        if ($user->can('work_order.view')) {
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

    public function view(User $user, AssetMaintenance $workOrder): bool
    {
        if ($user->can('work_order.view_all')) {
            return true;
        }

        return $this->viewAny($user) && $workOrder->isVisibleTo($user);
    }

    public function create(User $user): bool
    {
        if ($user->can('work_order.create')) {
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

    public function update(User $user, AssetMaintenance $workOrder): bool
    {
        if (! $this->view($user, $workOrder)) {
            return false;
        }

        if ($user->can('work_order.update')) {
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

    public function updateProgress(User $user, AssetMaintenance $workOrder): bool
    {
        if (! $this->view($user, $workOrder)) {
            return false;
        }

        if ($user->can('work_order.update')) {
            return true;
        }

        if ($workOrder->assigned_to !== null && $workOrder->assigned_to === $user->id) {
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

    public function delete(User $user, AssetMaintenance $workOrder): bool
    {
        if (! $this->view($user, $workOrder)) {
            return false;
        }

        if ($user->can('work_order.delete')) {
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
