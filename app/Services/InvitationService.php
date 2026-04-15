<?php

namespace App\Services;

use App\Models\Organization;
use App\Models\User;
use App\Models\UserInvitation;
use App\Notifications\OrganizationInvitationNotification;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class InvitationService
{
    public function createInvitation(int $organizationId, string $email, string $orgRole, User $invitedBy): UserInvitation
    {
        $token = Str::random(64);
        $tokenHash = hash('sha256', $token);
        $expiresAt = CarbonImmutable::now()->addHours(48);

        $existing = UserInvitation::query()
            ->where('organization_id', $organizationId)
            ->where('email', $email)
            ->whereNull('accepted_at')
            ->whereNull('revoked_at')
            ->where('expires_at', '>', CarbonImmutable::now())
            ->first();

        if ($existing !== null) {
            throw ValidationException::withMessages([
                'email' => __('An active invitation already exists for this email.'),
            ]);
        }

        /** @var UserInvitation $invitation */
        $invitation = UserInvitation::query()->create([
            'organization_id' => $organizationId,
            'email' => $email,
            'org_role' => $orgRole,
            'token_hash' => $tokenHash,
            'expires_at' => $expiresAt,
            'invited_by' => $invitedBy->id,
        ]);

        Notification::route('mail', $email)->notify(new OrganizationInvitationNotification(
            organization: Organization::query()->findOrFail($organizationId),
            token: $token,
            expiresAt: $expiresAt,
        ));

        return $invitation;
    }

    /**
     * @return array{user: User, organization_id: int}
     */
    public function acceptInvitation(string $token, ?string $name, ?string $password): array
    {
        $tokenHash = hash('sha256', $token);

        /** @var UserInvitation|null $invitation */
        $invitation = UserInvitation::query()->where('token_hash', $tokenHash)->first();

        if ($invitation === null) {
            throw ValidationException::withMessages(['token' => __('Invitation is invalid.')]);
        }

        if ($invitation->revoked_at !== null || $invitation->accepted_at !== null) {
            throw ValidationException::withMessages(['token' => __('Invitation is no longer available.')]);
        }

        if ($invitation->expires_at->isPast()) {
            throw ValidationException::withMessages(['token' => __('Invitation has expired.')]);
        }

        return DB::transaction(function () use ($invitation, $name, $password): array {
            /** @var User|null $user */
            $user = User::query()->where('email', $invitation->email)->first();

            if ($user === null) {
                if (! is_string($name) || trim($name) === '' || ! is_string($password) || trim($password) === '') {
                    throw ValidationException::withMessages([
                        'name' => __('Name is required.'),
                        'password' => __('Password is required.'),
                    ]);
                }

                /** @var User $user */
                $user = User::query()->create([
                    'name' => $name,
                    'email' => $invitation->email,
                    'email_verified_at' => now(),
                    'password' => bcrypt($password),
                    'is_active' => true,
                ]);
            }

            $user->organizations()->syncWithoutDetaching([
                $invitation->organization_id => [
                    'role' => $invitation->org_role,
                    'is_active' => true,
                ],
            ]);

            if ($user->current_organization_id === null) {
                $user->forceFill([
                    'current_organization_id' => $invitation->organization_id,
                    'organization_id' => $user->organization_id ?? $invitation->organization_id,
                ])->saveQuietly();
            }

            $invitation->forceFill(['accepted_at' => now()])->saveQuietly();

            return ['user' => $user, 'organization_id' => (int) $invitation->organization_id];
        });
    }
}
