<?php

namespace App\Jobs;

use App\Models\AssetMaintenance;
use App\Models\Organization;
use App\Models\User;
use App\Notifications\WorkOrderResolutionSlaBreachedNotification;
use App\Notifications\WorkOrderResponseSlaBreachedNotification;
use App\Services\AssetAuditLogger;
use App\Services\OrganizationContext;
use App\Services\WorkOrderSlaService;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Notification;

class EscalateOverdueWorkOrdersJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly int $organizationId,
    ) {}

    /**
     * Execute the job.
     */
    public function handle(WorkOrderSlaService $sla, AssetAuditLogger $audit): void
    {
        $organization = Organization::withoutGlobalScopes()->find($this->organizationId);

        if ($organization === null || ! $organization->is_active) {
            return;
        }

        app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

        $timezone = is_string($organization->timezone) && $organization->timezone !== '' ? $organization->timezone : config('app.timezone');
        $now = CarbonImmutable::now($timezone);

        $recipients = User::query()
            ->whereHas('organizations', function ($query) use ($organization) {
                $query
                    ->whereKey($organization->id)
                    ->where('organization_user.is_active', true)
                    ->whereIn('organization_user.role', ['Owner', 'Admin']);
            })
            ->get();

        $systemActor = $recipients->sortBy('id')->first();

        AssetMaintenance::query()
            ->whereNotNull('response_due_at')
            ->orWhereNotNull('resolution_due_at')
            ->with(['asset.personInCharge:id,name,email', 'asset:id,organization_id,code,name,person_in_charge_id'])
            ->orderBy('id')
            ->chunkById(100, function ($workOrders) use ($sla, $audit, $now, $recipients, $systemActor): void {
                foreach ($workOrders as $workOrder) {
                    $kind = null;

                    if ($sla->isResponseOverdue($workOrder, $now)) {
                        $kind = 'response';
                    } elseif ($sla->isResolutionOverdue($workOrder, $now)) {
                        $kind = 'resolution';
                    }

                    if ($kind === null) {
                        continue;
                    }

                    $workOrder->escalation_level = (int) $workOrder->escalation_level + 1;
                    $workOrder->last_escalated_at = $now;

                    if ($workOrder->escalated_at === null) {
                        $workOrder->escalated_at = $now;
                    }

                    $workOrder->save();

                    foreach ($recipients as $recipient) {
                        $recipient->notify($kind === 'response'
                            ? new WorkOrderResponseSlaBreachedNotification($workOrder)
                            : new WorkOrderResolutionSlaBreachedNotification($workOrder));
                    }

                    $email = $workOrder->asset?->personInCharge?->email;

                    if (is_string($email) && $email !== '') {
                        Notification::route('mail', $email)->notify($kind === 'response'
                            ? new WorkOrderResponseSlaBreachedNotification($workOrder)
                            : new WorkOrderResolutionSlaBreachedNotification($workOrder));
                    }

                    if ($systemActor !== null && $workOrder->asset !== null) {
                        $audit->logWorkOrderSlaEscalated($workOrder->asset, $systemActor, $workOrder, $kind);
                    }
                }
            });
    }
}
