<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrganizationSwitchController extends Controller
{
    public function __invoke(Request $request, Organization $organization): RedirectResponse
    {
        $user = $request->user();

        if ($user === null) {
            abort(401);
        }

        if (! $organization->is_active) {
            abort(403);
        }

        $isMember = $user->organizations()
            ->whereKey($organization->id)
            ->wherePivot('is_active', true)
            ->exists();

        if (! $isMember) {
            abort(403);
        }

        $originalId = $request->session()->get('acting.original_id') ?? $request->session()->get('impersonate.original_id');

        if (is_numeric($originalId)) {
            /** @var User $originalUser */
            $originalUser = User::query()->findOrFail((int) $originalId);
            Auth::login($originalUser);
        }

        $request->session()->forget('acting');
        $request->session()->forget('impersonate.original_id');
        $request->session()->forget('impersonate.original_name');
        $request->session()->forget('impersonate.as_id');
        $request->session()->forget('impersonate.mode');

        $user->forceFill(['current_organization_id' => $organization->id])->save();

        return back();
    }
}
