<?php

namespace App\Http\Controllers;

use App\Models\CalendarFeed;
use App\Services\OrganizationContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class MaintenanceCalendarFeedTokenController extends Controller
{
    public function store(Request $request, OrganizationContext $context): JsonResponse|RedirectResponse
    {
        $this->authorize('viewAny', \App\Models\MaintenanceSchedule::class);

        $user = $request->user();
        if ($user === null) {
            abort(401);
        }

        $organizationId = $context->requireOrganizationId();

        $token = Str::random(64);
        $hash = hash('sha256', $token);

        CalendarFeed::query()->updateOrCreate(
            [
                'organization_id' => $organizationId,
                'user_id' => $user->id,
                'type' => 'maintenance',
            ],
            [
                'token_hash' => $hash,
                'last_used_at' => null,
            ],
        );

        $url = route('maintenance-calendar.feed', ['token' => $token]);

        if ($request->expectsJson()) {
            return response()->json(['url' => $url]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('maintenance_calendar.toast.feed_link_ready')]);

        return back();
    }
}
