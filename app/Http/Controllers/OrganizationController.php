<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrganizationController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Organization::class);

        $user = $request->user();

        if ($user === null) {
            abort(401);
        }

        $organizations = $user->organizations()
            ->wherePivot('is_active', true)
            ->orderBy('organization_user.created_at')
            ->get(['organizations.id', 'organizations.name', 'organizations.slug', 'organizations.is_active', 'organizations.deactivated_at'])
            ->map(fn ($org) => [
                'id' => $org->id,
                'name' => $org->name,
                'slug' => $org->slug,
                'role' => $org->pivot?->role,
                'is_active' => (bool) $org->is_active,
                'deactivated_at' => $org->deactivated_at,
                'can_manage' => in_array($org->pivot?->role, ['Owner', 'Admin'], true) || $user->can('organization.edit'),
            ]);

        return Inertia::render('organizations/index', [
            'organizations' => $organizations,
            'currentOrganizationId' => $user->current_organization_id,
        ]);
    }
}
