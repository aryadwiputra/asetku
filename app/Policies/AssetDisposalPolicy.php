<?php

namespace App\Policies;

use App\Enums\OrganizationMemberRole;
use App\Models\AssetDisposal;
use App\Models\User;

class AssetDisposalPolicy
{
    public function viewAny(User $user): bool
    {
        $organizationId = $user->current_organization_id ?? $user->organization_id;

        if ($organizationId === null) {
            return $user->can('asset_disposal.view');
        }

        if ($user->can('asset_disposal.view')) {
            return true;
        }

        return $user->hasOrganizationRole((int) $organizationId, [
            OrganizationMemberRole::Owner,
            OrganizationMemberRole::Admin,
            OrganizationMemberRole::Manager,
            OrganizationMemberRole::Member,
        ]);
    }

    public function view(User $user, AssetDisposal $assetDisposal): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        $organizationId = $user->current_organization_id ?? $user->organization_id;

        if ($organizationId === null) {
            return $user->can('asset_disposal.create');
        }

        if ($user->can('asset_disposal.create')) {
            return true;
        }

        return $user->hasOrganizationRole((int) $organizationId, [
            OrganizationMemberRole::Owner,
            OrganizationMemberRole::Admin,
            OrganizationMemberRole::Manager,
        ]);
    }

    public function update(User $user, AssetDisposal $assetDisposal): bool
    {
        $organizationId = $user->current_organization_id ?? $user->organization_id;

        if ($organizationId === null) {
            return $user->can('asset_disposal.update');
        }

        if ($user->can('asset_disposal.update')) {
            return true;
        }

        return $user->hasOrganizationRole((int) $organizationId, [
            OrganizationMemberRole::Owner,
            OrganizationMemberRole::Admin,
            OrganizationMemberRole::Manager,
        ]);
    }

    public function delete(User $user, AssetDisposal $assetDisposal): bool
    {
        $organizationId = $user->current_organization_id ?? $user->organization_id;

        if ($organizationId === null) {
            return $user->can('asset_disposal.delete');
        }

        if ($user->can('asset_disposal.delete')) {
            return true;
        }

        return $user->hasOrganizationRole((int) $organizationId, [
            OrganizationMemberRole::Owner,
            OrganizationMemberRole::Admin,
        ]);
    }

    public function approve(User $user, AssetDisposal $assetDisposal): bool
    {
        $organizationId = $user->current_organization_id ?? $user->organization_id;

        if ($organizationId === null) {
            return $user->can('asset_disposal.approve');
        }

        if ($user->can('asset_disposal.approve')) {
            return true;
        }

        return $user->hasOrganizationRole((int) $organizationId, [
            OrganizationMemberRole::Owner,
            OrganizationMemberRole::Admin,
        ]);
    }

    public function export(User $user, AssetDisposal $assetDisposal): bool
    {
        $organizationId = $user->current_organization_id ?? $user->organization_id;

        if ($organizationId === null) {
            return $user->can('asset_disposal.export');
        }

        if ($user->can('asset_disposal.export')) {
            return true;
        }

        return $user->hasOrganizationRole((int) $organizationId, [
            OrganizationMemberRole::Owner,
            OrganizationMemberRole::Admin,
            OrganizationMemberRole::Manager,
        ]);
    }
}
