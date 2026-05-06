<?php

namespace App\Policies;

use App\Enums\OrganizationMemberRole;
use App\Models\AssetDepreciationRun;
use App\Models\User;

class AssetDepreciationPolicy
{
    public function viewAny(User $user): bool
    {
        $organizationId = $user->current_organization_id ?? $user->organization_id;

        if ($organizationId === null) {
            return $user->can('asset_depreciation.view');
        }

        if ($user->can('asset_depreciation.view')) {
            return true;
        }

        return $user->hasOrganizationRole((int) $organizationId, [
            OrganizationMemberRole::Owner,
            OrganizationMemberRole::Admin,
            OrganizationMemberRole::Manager,
            OrganizationMemberRole::Member,
        ]);
    }

    public function view(User $user, AssetDepreciationRun $run): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        $organizationId = $user->current_organization_id ?? $user->organization_id;

        if ($organizationId === null) {
            return $user->can('asset_depreciation.create');
        }

        if ($user->can('asset_depreciation.create')) {
            return true;
        }

        return $user->hasOrganizationRole((int) $organizationId, [
            OrganizationMemberRole::Owner,
            OrganizationMemberRole::Admin,
            OrganizationMemberRole::Manager,
        ]);
    }

    public function export(User $user, mixed $model = null): bool
    {
        $organizationId = $user->current_organization_id ?? $user->organization_id;

        if ($organizationId === null) {
            return $user->can('asset_depreciation.export');
        }

        if ($user->can('asset_depreciation.export')) {
            return true;
        }

        return $user->hasOrganizationRole((int) $organizationId, [
            OrganizationMemberRole::Owner,
            OrganizationMemberRole::Admin,
            OrganizationMemberRole::Manager,
        ]);
    }
}
