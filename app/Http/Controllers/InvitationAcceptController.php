<?php

namespace App\Http\Controllers;

use App\Http\Requests\AcceptInvitationRequest;
use App\Models\User;
use App\Models\UserInvitation;
use App\Services\InvitationService;
use Carbon\CarbonImmutable;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class InvitationAcceptController extends Controller
{
    public function show(string $token): Response
    {
        $tokenHash = hash('sha256', $token);

        /** @var UserInvitation|null $invitation */
        $invitation = UserInvitation::query()->where('token_hash', $tokenHash)->first();

        if ($invitation === null) {
            abort(404);
        }

        $isAvailable = $invitation->revoked_at === null
            && $invitation->accepted_at === null
            && $invitation->expires_at->isFuture();

        $existingUser = User::query()->where('email', $invitation->email)->exists();

        return Inertia::render('invites/accept', [
            'token' => $token,
            'email' => $invitation->email,
            'organizationName' => $invitation->organization()->value('name'),
            'expiresAt' => $invitation->expires_at->toIso8601String(),
            'isAvailable' => $isAvailable,
            'isExistingUser' => $existingUser,
            'orgRole' => $invitation->org_role,
        ]);
    }

    public function store(string $token, AcceptInvitationRequest $request, InvitationService $service): RedirectResponse
    {
        $service->acceptInvitation(
            token: $token,
            name: $request->validated('name'),
            password: $request->validated('password'),
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Invitation accepted. Please login.']);

        return to_route('login');
    }
}
