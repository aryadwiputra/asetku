<?php

namespace App\Http\Controllers;

use App\Models\AssetCategory;
use App\Models\Branch;
use App\Models\MaintenanceSchedule;
use App\Models\User;
use App\Services\OrganizationContext;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MaintenanceCalendarController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', MaintenanceSchedule::class);

        $organizationId = app(OrganizationContext::class)->requireOrganizationId();

        $user = $request->user();

        return Inertia::render('maintenance-calendar/index', [
            'meta' => [
                'branches' => Branch::query()
                    ->where('organization_id', $organizationId)
                    ->where('is_active', true)
                    ->orderBy('code')
                    ->get(['id', 'name', 'code']),
                'categories' => AssetCategory::query()
                    ->where('organization_id', $organizationId)
                    ->orderBy('name')
                    ->get(['id', 'name', 'code', 'parent_id']),
                'technicians' => User::query()
                    ->whereHas('technicianProfile', fn (Builder $q) => $q->where('organization_id', $organizationId)->where('is_active', true))
                    ->orderBy('name')
                    ->get(['id', 'name']),
            ],
            'abilities' => [
                'canCreateSchedule' => $user ? $user->can('create', MaintenanceSchedule::class) : false,
                'canUpdateSchedule' => $user ? $user->can('update', new MaintenanceSchedule(['organization_id' => $organizationId])) : false,
            ],
        ]);
    }
}
