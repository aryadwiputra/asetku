<?php

namespace App\Policies;

use App\Enums\OrganizationMemberRole;
use App\Models\SavedFilter;
use App\Models\User;

class SavedFilterPolicy
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

    public function view(User $user, SavedFilter $savedFilter): bool
    {
        if (! $this->viewAny($user)) {
            return false;
        }

        return (int) $savedFilter->user_id === (int) $user->id;
    }

    public function create(User $user): bool
    {
        if ($user->can('asset.create')) {
            return true;
        }

        return $this->viewAny($user);
    }

    public function update(User $user, SavedFilter $savedFilter): bool
    {
        if (! $this->view($user, $savedFilter)) {
            return false;
        }

        if ($user->can('asset.update')) {
            return true;
        }

        return true;
    }

    public function delete(User $user, SavedFilter $savedFilter): bool
    {
        if (! $this->view($user, $savedFilter)) {
            return false;
        }

        if ($user->can('asset.delete')) {
            return true;
        }

        return true;
    }
}
