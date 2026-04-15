<?php

namespace App\Policies;

use App\Enums\OrganizationMemberRole;
use App\Models\AssetStatus;
use App\Models\User;

class AssetStatusPolicy
{
    public function viewAny(User $user): bool
    {
        $organizationId = $user->current_organization_id ?? $user->organization_id;

        if ($organizationId === null) {
            return $user->can('asset_status.view');
        }

        if ($user->can('asset_status.view')) {
            return true;
        }

        return $user->hasOrganizationRole((int) $organizationId, [
            OrganizationMemberRole::Owner,
            OrganizationMemberRole::Admin,
            OrganizationMemberRole::Manager,
            OrganizationMemberRole::Member,
        ]);
    }

    public function view(User $user, AssetStatus $assetStatus): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        $organizationId = $user->current_organization_id ?? $user->organization_id;

        if ($organizationId === null) {
            return $user->can('asset_status.create');
        }

        if ($user->can('asset_status.create')) {
            return true;
        }

        return $user->hasOrganizationRole((int) $organizationId, [
            OrganizationMemberRole::Owner,
            OrganizationMemberRole::Admin,
            OrganizationMemberRole::Manager,
        ]);
    }

    public function update(User $user, AssetStatus $assetStatus): bool
    {
        $organizationId = $user->current_organization_id ?? $user->organization_id;

        if ($organizationId === null) {
            return $user->can('asset_status.update');
        }

        if ($user->can('asset_status.update')) {
            return true;
        }

        return $user->hasOrganizationRole((int) $organizationId, [
            OrganizationMemberRole::Owner,
            OrganizationMemberRole::Admin,
            OrganizationMemberRole::Manager,
        ]);
    }

    public function delete(User $user, AssetStatus $assetStatus): bool
    {
        $organizationId = $user->current_organization_id ?? $user->organization_id;

        if ($organizationId === null) {
            return $user->can('asset_status.delete');
        }

        if ($user->can('asset_status.delete')) {
            return true;
        }

        return $user->hasOrganizationRole((int) $organizationId, [
            OrganizationMemberRole::Owner,
            OrganizationMemberRole::Admin,
            OrganizationMemberRole::Manager,
        ]);
    }
}
