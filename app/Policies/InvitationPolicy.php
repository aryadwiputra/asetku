<?php

namespace App\Policies;

use App\Enums\OrganizationMemberRole;
use App\Models\User;

class InvitationPolicy
{
    public function viewAny(User $user): bool
    {
        if ($user->can('invitation.view')) {
            return true;
        }

        $organizationId = $user->current_organization_id ?? $user->organization_id;

        if ($organizationId === null) {
            return false;
        }

        return $user->hasOrganizationRole((int) $organizationId, [
            OrganizationMemberRole::Owner,
            OrganizationMemberRole::Admin,
        ]);
    }

    public function create(User $user): bool
    {
        if ($user->can('invitation.create') || $user->can('user.create')) {
            return true;
        }

        $organizationId = $user->current_organization_id ?? $user->organization_id;

        if ($organizationId === null) {
            return false;
        }

        return $user->hasOrganizationRole((int) $organizationId, [
            OrganizationMemberRole::Owner,
            OrganizationMemberRole::Admin,
        ]);
    }
}
