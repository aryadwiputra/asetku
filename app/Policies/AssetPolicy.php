<?php

namespace App\Policies;

use App\Enums\OrganizationMemberRole;
use App\Models\Asset;
use App\Models\User;

class AssetPolicy
{
    public function viewAny(User $user): bool
    {
        $organizationId = $user->current_organization_id;

        if ($user->can('asset.view')) {
            return true;
        }

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

    public function view(User $user, Asset $asset): bool
    {
        if (! $this->viewAny($user)) {
            return false;
        }

        return $asset->isVisibleTo($user);
    }

    public function create(User $user): bool
    {
        if ($user->can('asset.create')) {
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

    public function update(User $user, Asset $asset): bool
    {
        if (! $this->view($user, $asset)) {
            return false;
        }

        if ($user->can('asset.update')) {
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

    public function delete(User $user, Asset $asset): bool
    {
        if (! $this->view($user, $asset)) {
            return false;
        }

        if ($user->can('asset.delete')) {
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

    public function import(User $user): bool
    {
        if ($user->can('asset.import') || $user->can('asset_import.create') || $user->can('asset_import.update')) {
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

    public function export(User $user): bool
    {
        if ($user->can('asset.export')) {
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
}
