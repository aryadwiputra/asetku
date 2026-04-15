<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInvitationRequest;
use App\Models\UserInvitation;
use App\Services\InvitationService;
use App\Services\OrganizationContext;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class UserInvitationController extends Controller
{
    public function store(StoreInvitationRequest $request, InvitationService $service): RedirectResponse
    {
        $this->authorize('create', UserInvitation::class);

        $organizationId = app(OrganizationContext::class)->currentOrganizationId();

        if ($organizationId === null) {
            abort(403, 'No current organization selected.');
        }

        $service->createInvitation(
            organizationId: (int) $organizationId,
            email: (string) $request->validated('email'),
            orgRole: (string) $request->validated('org_role'),
            invitedBy: $request->user(),
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Invitation sent.']);

        return back();
    }
}
