<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrganizationController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        if ($user === null) {
            abort(401);
        }

        $organizations = $user->organizations()
            ->wherePivot('is_active', true)
            ->orderBy('organization_user.created_at')
            ->get(['organizations.id', 'organizations.name', 'organizations.slug'])
            ->map(fn ($org) => [
                'id' => $org->id,
                'name' => $org->name,
                'slug' => $org->slug,
                'role' => $org->pivot?->role,
            ]);

        return Inertia::render('organizations/index', [
            'organizations' => $organizations,
            'currentOrganizationId' => $user->current_organization_id,
        ]);
    }
}
