<?php

namespace App\Jobs;

use App\Models\AssetMaintenance;
use App\Models\MaintenanceSchedule;
use App\Models\Organization;
use App\Models\User;
use App\Services\OrganizationContext;
use App\Services\WorkOrderService;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class GenerateWorkOrdersFromSchedulesJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly int $organizationId,
    ) {}

    /**
     * Execute the job.
     */
    public function handle(WorkOrderService $workOrders): void
    {
        $organization = Organization::withoutGlobalScopes()->find($this->organizationId);

        if ($organization === null || ! $organization->is_active) {
            return;
        }

        app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

        $timezone = is_string($organization->timezone) && $organization->timezone !== '' ? $organization->timezone : config('app.timezone');
        $today = CarbonImmutable::now($timezone)->toDateString();

        $actor = $this->resolveSystemActor($organization->id);

        MaintenanceSchedule::query()
            ->where('is_active', true)
            ->whereDate('next_due_at', '<=', $today)
            ->with(['asset:id,organization_id,branch_id'])
            ->orderBy('id')
            ->chunkById(100, function ($schedules) use ($workOrders, $actor, $today): void {
                foreach ($schedules as $schedule) {
                    $exists = AssetMaintenance::query()
                        ->where('schedule_id', $schedule->id)
                        ->where('source', 'schedule')
                        ->whereDate('performed_at', $schedule->next_due_at?->toDateString() ?? $today)
                        ->exists();

                    if ($exists) {
                        continue;
                    }

                    $workOrders->createFromSchedule($schedule, $actor);
                }
            });
    }

    private function resolveSystemActor(int $organizationId): ?User
    {
        return User::query()
            ->whereHas('organizations', function ($query) use ($organizationId) {
                $query
                    ->whereKey($organizationId)
                    ->where('organization_user.is_active', true)
                    ->whereIn('organization_user.role', ['Owner', 'Admin']);
            })
            ->orderBy('id')
            ->first();
    }
}
