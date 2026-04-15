<?php

namespace App\Policies;

use App\Models\User;
use App\Models\UserDelegation;

class UserDelegationPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('delegation.view');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, UserDelegation $userDelegation): bool
    {
        if ($user->can('delegation.view')) {
            return true;
        }

        return (int) $userDelegation->delegatee_user_id === (int) $user->id
            || (int) $userDelegation->delegator_user_id === (int) $user->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('delegation.create');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, UserDelegation $userDelegation): bool
    {
        return $user->can('delegation.update');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, UserDelegation $userDelegation): bool
    {
        return $user->can('delegation.delete') || $user->can('delegation.approve');
    }

    public function approve(User $user, UserDelegation $userDelegation): bool
    {
        return $user->can('delegation.approve');
    }

    public function start(User $user, UserDelegation $userDelegation): bool
    {
        if ((int) $userDelegation->delegatee_user_id !== (int) $user->id) {
            return false;
        }

        if ($userDelegation->status !== 'active') {
            return false;
        }

        if ($userDelegation->revoked_at !== null) {
            return false;
        }

        $now = now();

        return $now->between($userDelegation->starts_at, $userDelegation->ends_at);
    }
}
