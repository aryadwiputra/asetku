<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserDelegationRequest;
use App\Models\User;
use App\Models\UserDelegation;
use App\Services\OrganizationContext;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserDelegationController extends Controller
{
    public function store(StoreUserDelegationRequest $request): RedirectResponse
    {
        $this->authorize('create', UserDelegation::class);

        $organizationId = app(OrganizationContext::class)->currentOrganizationId();

        if ($organizationId === null) {
            abort(403, 'No current organization.');
        }

        $data = $request->validated();

        if ((int) $data['delegator_user_id'] === (int) $data['delegatee_user_id']) {
            abort(422, 'Delegator and delegatee must be different.');
        }

        $overlapExists = UserDelegation::query()
            ->where('delegator_user_id', $data['delegator_user_id'])
            ->whereIn('status', ['pending', 'active'])
            ->whereNull('revoked_at')
            ->where(function ($query) use ($data) {
                $query
                    ->whereBetween('starts_at', [$data['starts_at'], $data['ends_at']])
                    ->orWhereBetween('ends_at', [$data['starts_at'], $data['ends_at']])
                    ->orWhere(function ($q) use ($data) {
                        $q->where('starts_at', '<=', $data['starts_at'])
                            ->where('ends_at', '>=', $data['ends_at']);
                    });
            })
            ->exists();

        if ($overlapExists) {
            return back()->withErrors([
                'delegator_user_id' => __('Delegator already has an overlapping delegation.'),
            ]);
        }

        $membersCount = User::query()
            ->whereIn('id', [(int) $data['delegator_user_id'], (int) $data['delegatee_user_id']])
            ->whereHas('organizations', function ($query) use ($organizationId) {
                $query->whereKey($organizationId)->where('organization_user.is_active', true);
            })
            ->count();

        if ($membersCount !== 2) {
            return back()->withErrors([
                'delegatee_user_id' => __('Both users must be active members of the current organization.'),
            ]);
        }

        $delegation = UserDelegation::query()->create([
            'organization_id' => $organizationId,
            'delegator_user_id' => (int) $data['delegator_user_id'],
            'delegatee_user_id' => (int) $data['delegatee_user_id'],
            'starts_at' => $data['starts_at'],
            'ends_at' => $data['ends_at'],
            'status' => 'pending',
            'reason' => $data['reason'] ?? null,
            'created_by' => $request->user()?->id,
        ]);

        activity()
            ->performedOn($delegation)
            ->log('Delegation requested');

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Delegation created.')]);

        return back();
    }

    public function approve(Request $request, UserDelegation $delegation): RedirectResponse
    {
        $this->authorize('approve', $delegation);

        if ($delegation->status !== 'pending') {
            return back();
        }

        $delegation->forceFill([
            'status' => 'active',
            'approved_by' => $request->user()?->id,
        ])->save();

        activity()
            ->performedOn($delegation)
            ->log('Delegation approved');

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Delegation approved.')]);

        return back();
    }

    public function revoke(Request $request, UserDelegation $delegation): RedirectResponse
    {
        $this->authorize('delete', $delegation);

        if (in_array($delegation->status, ['ended', 'revoked'], true)) {
            return back();
        }

        $delegation->forceFill([
            'status' => 'revoked',
            'revoked_at' => now(),
        ])->save();

        activity()
            ->performedOn($delegation)
            ->log('Delegation revoked');

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Delegation revoked.')]);

        return back();
    }

    public function start(Request $request, UserDelegation $delegation): RedirectResponse
    {
        $this->authorize('start', $delegation);

        if (now()->greaterThan($delegation->ends_at)) {
            $delegation->forceFill(['status' => 'ended'])->save();

            return back()->withErrors(['delegation' => __('Delegation has ended.')]);
        }

        /** @var User $delegatee */
        $delegatee = $request->user();

        /** @var User $delegator */
        $delegator = User::query()->findOrFail((int) $delegation->delegator_user_id);

        $organizationId = app(OrganizationContext::class)->currentOrganizationId();

        if ($organizationId === null) {
            abort(403, 'No current organization.');
        }

        $request->session()->put('acting.mode', 'delegation');
        $request->session()->put('acting.original_id', $delegatee->id);
        $request->session()->put('acting.as_id', $delegator->id);
        $request->session()->put('acting.organization_id', $organizationId);

        Auth::login($delegator);

        activity()
            ->performedOn($delegation)
            ->log('Delegation started');

        Inertia::flash('toast', ['type' => 'info', 'message' => __('Delegation started.')]);

        return to_route('dashboard');
    }

    public function stop(Request $request): RedirectResponse
    {
        $originalId = $request->session()->get('acting.original_id');
        $asId = $request->session()->get('acting.as_id');

        if (! is_numeric($originalId)) {
            return to_route('dashboard');
        }

        /** @var User $originalUser */
        $originalUser = User::query()->findOrFail((int) $originalId);

        Auth::login($originalUser);

        $request->session()->forget('acting');

        activity()
            ->performedOn($originalUser)
            ->withProperties(['acting_as_user_id' => is_numeric($asId) ? (int) $asId : null])
            ->log('Delegation stopped');

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Delegation stopped.')]);

        return to_route('dashboard');
    }
}
