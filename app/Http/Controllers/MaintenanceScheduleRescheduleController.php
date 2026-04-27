<?php

namespace App\Http\Controllers;

use App\Http\Requests\RescheduleMaintenanceScheduleRequest;
use App\Models\MaintenanceSchedule;
use App\Services\AssetAuditLogger;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MaintenanceScheduleRescheduleController extends Controller
{
    public function update(
        RescheduleMaintenanceScheduleRequest $request,
        MaintenanceSchedule $schedule,
        AssetAuditLogger $audit,
    ): JsonResponse|RedirectResponse {
        $this->authorize('update', $schedule);

        $user = $request->user();
        if ($user === null) {
            abort(401);
        }

        $data = $request->validated();

        $nextDueAt = CarbonImmutable::parse((string) $data['next_due_at'])->startOfDay();
        $reason = isset($data['reason']) ? (string) $data['reason'] : null;

        DB::transaction(function () use ($audit, $nextDueAt, $reason, $schedule, $user): void {
            $schedule->loadMissing('asset');

            $from = $schedule->next_due_at ? CarbonImmutable::parse($schedule->next_due_at)->startOfDay() : null;

            $schedule->forceFill(['next_due_at' => $nextDueAt])->save();

            if ($from !== null && $schedule->asset) {
                $audit->logMaintenanceScheduleRescheduled(
                    asset: $schedule->asset,
                    actor: $user,
                    scheduleId: $schedule->id,
                    from: $from,
                    to: $nextDueAt,
                    reason: $reason,
                );
            }
        });

        if ($request->expectsJson()) {
            return response()->json([
                'message' => __('maintenance_calendar.toast.rescheduled'),
                'next_due_at' => $nextDueAt->toDateString(),
            ]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('maintenance_calendar.toast.rescheduled')]);

        return back();
    }
}
