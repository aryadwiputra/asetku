<?php

namespace App\Policies\Concerns;

use App\Enums\OrganizationMemberRole;
use App\Models\User;

abstract class OrganizationMasterDataPolicy
{
    abstract protected function permissionPrefix(): string;

    protected function organizationId(User $user): ?int
    {
        $organizationId = $user->current_organization_id ?? $user->organization_id;

        return $organizationId === null ? null : (int) $organizationId;
    }

    protected function canViewAny(User $user): bool
    {
        $permission = $this->permissionPrefix().'.view';
        $organizationId = $this->organizationId($user);

        if ($organizationId === null) {
            return $user->can($permission);
        }

        if ($user->can($permission)) {
            return true;
        }

        return $user->hasOrganizationRole($organizationId, [
            OrganizationMemberRole::Owner,
            OrganizationMemberRole::Admin,
            OrganizationMemberRole::Manager,
            OrganizationMemberRole::Member,
        ]);
    }

    protected function canManage(User $user, string $action): bool
    {
        $permission = $this->permissionPrefix().'.'.$action;
        $organizationId = $this->organizationId($user);

        if ($organizationId === null) {
            return $user->can($permission);
        }

        if ($user->can($permission)) {
            return true;
        }

        return $user->hasOrganizationRole($organizationId, [
            OrganizationMemberRole::Owner,
            OrganizationMemberRole::Admin,
            OrganizationMemberRole::Manager,
        ]);
    }
}

