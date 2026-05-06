<?php

namespace App\Services;

use App\Models\Asset;
use App\Models\AssetMaintenance;
use App\Models\AssetMaintenanceTask;
use App\Models\MaintenanceChecklistTemplate;
use App\Models\MaintenanceSchedule;
use App\Models\TechnicianProfile;
use App\Models\User;
use Carbon\CarbonInterface;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class WorkOrderService
{
    public function __construct(
        private readonly AssetAuditLogger $audit,
        private readonly WorkOrderSlaService $sla,
    ) {}

    /**
     * @param  array{
     *   description:string,
     *   performed_at?:string|null,
     *   type?:string|null,
     *   source?:string|null,
     *   priority?:string|null,
     *   branch_id?:int|null,
     *   checklist_template_id?:int|null,
     *   sla_response_hours?:int|null,
     *   sla_resolution_hours?:int|null,
     *   notes?:string|null,
     *   internal_notes?:string|null,
     * }  $payload
     */
    public function createFromManual(Asset $asset, array $payload, User $actor): AssetMaintenance
    {
        return $this->createWorkOrder(
            asset: $asset,
            payload: [
                ...$payload,
                'source' => $payload['source'] ?? 'manual',
            ],
            actor: $actor,
        );
    }

    /**
     * @param  array{
     *   description:string,
     *   performed_at?:string|null,
     *   priority?:string|null,
     *   branch_id?:int|null,
     *   checklist_template_id?:int|null,
     *   sla_response_hours?:int|null,
     *   sla_resolution_hours?:int|null,
     *   notes?:string|null,
     *   internal_notes?:string|null,
     * }  $payload
     */
    public function createFromDamageReport(Asset $asset, array $payload, User $actor): AssetMaintenance
    {
        return $this->createWorkOrder(
            asset: $asset,
            payload: [
                ...$payload,
                'type' => 'corrective',
                'source' => 'damage_report',
            ],
            actor: $actor,
        );
    }

    public function createFromSchedule(MaintenanceSchedule $schedule, ?User $actor = null): AssetMaintenance
    {
        $asset = $schedule->asset()->firstOrFail();

        return DB::transaction(function () use ($schedule, $asset, $actor) {
            $workOrder = $this->createWorkOrder(
                asset: $asset,
                payload: [
                    'type' => 'preventive',
                    'source' => 'schedule',
                    'priority' => $schedule->default_priority ?? 'normal',
                    'branch_id' => $asset->branch_id,
                    'checklist_template_id' => $schedule->checklist_template_id,
                    'sla_response_hours' => $schedule->default_sla_response_hours,
                    'sla_resolution_hours' => $schedule->default_sla_resolution_hours,
                    'description' => $schedule->name,
                    'performed_at' => $schedule->next_due_at?->toDateString(),
                    'notes' => null,
                    'internal_notes' => null,
                ],
                actor: $actor,
                schedule: $schedule,
            );

            $schedule->next_due_at = $schedule->next_due_at->addDays((int) $schedule->interval_days);
            $schedule->save();

            return $workOrder;
        });
    }

    public function assignTechnician(AssetMaintenance $workOrder, User $technician, User $actor): AssetMaintenance
    {
        $profile = TechnicianProfile::query()
            ->where('organization_id', $workOrder->organization_id)
            ->where('user_id', $technician->id)
            ->where('is_active', true)
            ->first();

        if ($profile === null) {
            abort(422, __('work_orders.validation.technician_profile_required'));
        }

        if ($profile->branch_id !== null && $workOrder->branch_id !== null && $profile->branch_id !== $workOrder->branch_id) {
            abort(422, __('work_orders.validation.technician_branch_mismatch'));
        }

        $requiredSkill = $workOrder->schedule?->required_skill
            ?? $workOrder->checklistTemplate?->required_skill;

        if (is_string($requiredSkill) && $requiredSkill !== '') {
            $skills = $profile->skills ?? [];

            if (! in_array($requiredSkill, $skills, true)) {
                abort(422, __('work_orders.validation.technician_skill_mismatch'));
            }
        }

        $workOrder->assigned_to = $technician->id;
        $workOrder->assigned_at = now();
        $workOrder->save();

        $this->audit->logWorkOrderAssigned($workOrder->asset()->firstOrFail(), $actor, $workOrder);

        return $workOrder;
    }

    /**
     * @param  array{
     *   status?:string|null,
     *   progress_percent?:int|null,
     *   internal_notes?:string|null,
     * }  $payload
     */
    public function updateProgress(AssetMaintenance $workOrder, User $actor, array $payload): AssetMaintenance
    {
        $previousStatus = $workOrder->status;
        $previousProgress = $workOrder->progress_percent;

        if (array_key_exists('progress_percent', $payload)) {
            $workOrder->progress_percent = max(0, min(100, (int) ($payload['progress_percent'] ?? 0)));
        }

        if (array_key_exists('internal_notes', $payload)) {
            $workOrder->internal_notes = $payload['internal_notes'];
        }

        $newStatus = $payload['status'] ?? null;

        if (is_string($newStatus) && $newStatus !== '' && $newStatus !== $previousStatus) {
            $this->applyStatusTransition($workOrder, $newStatus);
            $workOrder->status = $newStatus;
        }

        $workOrder->save();

        $this->audit->logWorkOrderProgressed(
            $workOrder->asset()->firstOrFail(),
            $actor,
            $workOrder,
            before: [
                'status' => $previousStatus,
                'progress_percent' => $previousProgress,
            ],
            after: [
                'status' => $workOrder->status,
                'progress_percent' => $workOrder->progress_percent,
            ],
        );

        if ($previousStatus !== 'completed' && $workOrder->status === 'completed') {
            $this->audit->logWorkOrderCompleted($workOrder->asset()->firstOrFail(), $actor, $workOrder);
        }

        return $workOrder;
    }

    public function recalculateCosts(AssetMaintenance $workOrder): void
    {
        $sum = $workOrder->costLines()->sum('total_cost');
        $workOrder->cost = (string) $sum;
        $workOrder->save();
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function createWorkOrder(Asset $asset, array $payload, ?User $actor, ?MaintenanceSchedule $schedule = null): AssetMaintenance
    {
        return DB::transaction(function () use ($asset, $payload, $actor, $schedule) {
            $workOrder = new AssetMaintenance;

            $workOrder->organization_id = $asset->organization_id;
            $workOrder->asset_id = $asset->id;
            $workOrder->branch_id = $payload['branch_id'] ?? $asset->branch_id;
            $workOrder->type = $payload['type'] ?? 'corrective';
            $workOrder->source = $payload['source'] ?? 'manual';
            $workOrder->priority = $payload['priority'] ?? 'normal';
            $workOrder->status = 'open';
            $workOrder->description = $payload['description'];
            $workOrder->performed_at = $this->parseDateTime($payload['performed_at'] ?? null);
            $workOrder->notes = $payload['notes'] ?? null;
            $workOrder->internal_notes = $payload['internal_notes'] ?? null;

            $workOrder->schedule_id = $schedule?->id ?? null;
            $workOrder->checklist_template_id = $payload['checklist_template_id'] ?? null;

            $workOrder->sla_response_hours = $payload['sla_response_hours'] ?? null;
            $workOrder->sla_resolution_hours = $payload['sla_resolution_hours'] ?? null;

            $workOrder->requested_by = $actor?->id;

            $workOrder->save();

            $this->sla->applyDueDates($workOrder);
            $workOrder->save();

            if ($workOrder->checklist_template_id !== null) {
                $this->cloneChecklistTasksFromTemplate($workOrder, $workOrder->checklist_template_id);
            }

            if ($actor !== null) {
                $this->audit->logWorkOrderCreated($asset, $actor, $workOrder);
            }

            return $workOrder;
        });
    }

    private function applyStatusTransition(AssetMaintenance $workOrder, string $toStatus): void
    {
        if ($toStatus === 'acknowledged') {
            $workOrder->acknowledged_at = $workOrder->acknowledged_at ?? now();
        }

        if ($toStatus === 'in_progress') {
            $workOrder->started_at = $workOrder->started_at ?? now();
        }

        if ($toStatus === 'completed') {
            $workOrder->completed_at = $workOrder->completed_at ?? now();
            $workOrder->progress_percent = 100;
        }

        if ($toStatus === 'cancelled') {
            $workOrder->cancelled_at = $workOrder->cancelled_at ?? now();
        }
    }

    private function cloneChecklistTasksFromTemplate(AssetMaintenance $workOrder, int $templateId): void
    {
        $template = MaintenanceChecklistTemplate::query()
            ->where('organization_id', $workOrder->organization_id)
            ->with('items')
            ->find($templateId);

        if ($template === null) {
            return;
        }

        $items = $template->items->values();

        foreach ($items as $item) {
            AssetMaintenanceTask::query()->create([
                'organization_id' => $workOrder->organization_id,
                'maintenance_id' => $workOrder->id,
                'title' => $item->title,
                'is_required' => $item->is_required,
                'sort_order' => $item->sort_order,
            ]);
        }
    }

    private function parseDateTime(?string $value): ?CarbonInterface
    {
        if ($value === null || trim($value) === '') {
            return null;
        }

        try {
            return Carbon::parse($value);
        } catch (\Throwable) {
            return null;
        }
    }
}
