<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

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

        $user->forceFill(['current_organization_id' => $organization->id])->save();

        return back();
    }
}
