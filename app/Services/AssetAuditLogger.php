<?php

namespace App\Services;

use App\Models\Asset;
use App\Models\AssetDisposal;
use App\Models\AssetHistory;
use App\Models\AssetMaintenance;
use App\Models\User;
use Carbon\CarbonInterface;

class AssetAuditLogger
{
    /**
     * @param  array<string, mixed>  $payload
     */
    public function logLifecycleStage(Asset $asset, User $actor, string $stage, ?CarbonInterface $performedAt, ?string $notes, array $payload = []): void
    {
        $payload = [
            ...$payload,
            'stage' => $stage,
            'notes' => $notes,
        ];

        $this->createHistory(
            asset: $asset,
            actor: $actor,
            action: 'lifecycle_recorded',
            description: __('assets.lifecycle.history.lifecycle_recorded', ['stage' => __("assets.lifecycle.stages.{$stage}")]),
            performedAt: $performedAt,
            payload: $payload,
        );
    }

    public function logStatusChanged(Asset $asset, User $actor, ?int $fromStatusId, ?int $toStatusId, ?CarbonInterface $performedAt = null, ?string $notes = null): void
    {
        $this->createHistory(
            asset: $asset,
            actor: $actor,
            action: 'status_changed',
            description: __('assets.lifecycle.history.status_changed'),
            performedAt: $performedAt,
            payload: [
                'before' => ['asset_status_id' => $fromStatusId],
                'after' => ['asset_status_id' => $toStatusId],
                'notes' => $notes,
            ],
        );
    }

    public function logConditionChanged(Asset $asset, User $actor, ?int $fromConditionId, ?int $toConditionId, ?CarbonInterface $performedAt = null, ?string $notes = null): void
    {
        $this->createHistory(
            asset: $asset,
            actor: $actor,
            action: 'condition_changed',
            description: __('assets.lifecycle.history.condition_changed'),
            performedAt: $performedAt,
            payload: [
                'before' => ['asset_condition_id' => $fromConditionId],
                'after' => ['asset_condition_id' => $toConditionId],
                'notes' => $notes,
            ],
        );
    }

    /**
     * @param  array<string, mixed>  $before
     * @param  array<string, mixed>  $after
     */
    public function logAssigned(Asset $asset, User $actor, array $before, array $after): void
    {
        $this->createHistory(
            asset: $asset,
            actor: $actor,
            action: 'assigned',
            description: __('assets.lifecycle.history.assigned'),
            performedAt: null,
            payload: ['before' => $before, 'after' => $after],
        );
    }

    /**
     * @param  array<string, mixed>  $before
     * @param  array<string, mixed>  $after
     */
    public function logRelocated(Asset $asset, User $actor, array $before, array $after): void
    {
        $this->createHistory(
            asset: $asset,
            actor: $actor,
            action: 'relocated',
            description: __('assets.lifecycle.history.relocated'),
            performedAt: null,
            payload: ['before' => $before, 'after' => $after],
        );
    }

    /**
     * @param  array<string, mixed>  $before
     * @param  array<string, mixed>  $after
     */
    public function logUpdated(Asset $asset, User $actor, array $before, array $after): void
    {
        $this->createHistory(
            asset: $asset,
            actor: $actor,
            action: 'updated',
            description: __('assets.history.updated'),
            performedAt: null,
            payload: ['before' => $before, 'after' => $after],
        );
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    public function logAttachmentAdded(Asset $asset, User $actor, array $payload): void
    {
        $this->createHistory(
            asset: $asset,
            actor: $actor,
            action: 'attachment_added',
            description: __('assets.lifecycle.history.attachment_added'),
            performedAt: null,
            payload: $payload,
        );
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    public function logAttachmentRemoved(Asset $asset, User $actor, array $payload): void
    {
        $this->createHistory(
            asset: $asset,
            actor: $actor,
            action: 'attachment_removed',
            description: __('assets.lifecycle.history.attachment_removed'),
            performedAt: null,
            payload: $payload,
        );
    }

    /**
     * @param  array<string, mixed>  $before
     * @param  array<string, mixed>  $after
     * @param  array<string, mixed>  $payload
     */
    public function logMovement(Asset $asset, User $actor, string $type, ?CarbonInterface $performedAt, array $before, array $after, array $payload = []): void
    {
        $action = match ($type) {
            'placement' => 'placed',
            'borrow' => 'borrowed',
            'return' => 'returned',
            default => 'transferred',
        };

        $this->createHistory(
            asset: $asset,
            actor: $actor,
            action: $action,
            description: __("assets.lifecycle.history.{$action}"),
            performedAt: $performedAt,
            payload: [
                ...$payload,
                'movement_type' => $type,
                'before' => $before,
                'after' => $after,
            ],
        );
    }

    public function logWorkOrderCreated(Asset $asset, User $actor, AssetMaintenance $workOrder): void
    {
        $this->createHistory(
            asset: $asset,
            actor: $actor,
            action: 'work_order_created',
            description: __('work_orders.history.created'),
            performedAt: $workOrder->performed_at,
            payload: [
                'work_order_id' => $workOrder->id,
                'type' => $workOrder->type,
                'source' => $workOrder->source,
                'priority' => $workOrder->priority,
                'status' => $workOrder->status,
            ],
        );
    }

    public function logWorkOrderAssigned(Asset $asset, User $actor, AssetMaintenance $workOrder): void
    {
        $this->createHistory(
            asset: $asset,
            actor: $actor,
            action: 'work_order_assigned',
            description: __('work_orders.history.assigned'),
            performedAt: $workOrder->assigned_at,
            payload: [
                'work_order_id' => $workOrder->id,
                'assigned_to' => $workOrder->assigned_to,
                'assigned_at' => $workOrder->assigned_at,
            ],
        );
    }

    /**
     * @param  array<string, mixed>  $before
     * @param  array<string, mixed>  $after
     */
    public function logWorkOrderProgressed(Asset $asset, User $actor, AssetMaintenance $workOrder, array $before, array $after): void
    {
        $this->createHistory(
            asset: $asset,
            actor: $actor,
            action: 'work_order_progressed',
            description: __('work_orders.history.progressed'),
            performedAt: null,
            payload: [
                'work_order_id' => $workOrder->id,
                'before' => $before,
                'after' => $after,
            ],
        );
    }

    public function logWorkOrderCompleted(Asset $asset, User $actor, AssetMaintenance $workOrder): void
    {
        $this->createHistory(
            asset: $asset,
            actor: $actor,
            action: 'work_order_completed',
            description: __('work_orders.history.completed'),
            performedAt: $workOrder->completed_at,
            payload: [
                'work_order_id' => $workOrder->id,
                'completed_at' => $workOrder->completed_at,
                'cost' => $workOrder->cost,
            ],
        );
    }

    public function logWorkOrderSlaEscalated(Asset $asset, User $actor, AssetMaintenance $workOrder, string $kind): void
    {
        $this->createHistory(
            asset: $asset,
            actor: $actor,
            action: 'work_order_sla_escalated',
            description: __('work_orders.history.sla_escalated'),
            performedAt: null,
            payload: [
                'work_order_id' => $workOrder->id,
                'kind' => $kind,
                'escalation_level' => $workOrder->escalation_level,
                'response_due_at' => $workOrder->response_due_at,
                'resolution_due_at' => $workOrder->resolution_due_at,
            ],
        );
    }

    public function logDisposalRequested(Asset $asset, User $actor, AssetDisposal $disposal): void
    {
        $this->createHistory(
            asset: $asset,
            actor: $actor,
            action: 'disposal_requested',
            description: __('disposals.history.requested'),
            performedAt: $disposal->disposed_at,
            payload: [
                'disposal_id' => $disposal->id,
                'type' => $disposal->type,
                'currency_code' => $disposal->currency_code,
                'net_proceeds_amount' => $disposal->net_proceeds_amount,
                'book_value_at_disposal' => $disposal->book_value_at_disposal,
                'gain_loss_amount' => $disposal->gain_loss_amount,
                'notes' => $disposal->notes,
            ],
        );
    }

    public function logDisposalRejected(Asset $asset, User $actor, AssetDisposal $disposal, ?string $notes = null): void
    {
        $this->createHistory(
            asset: $asset,
            actor: $actor,
            action: 'disposal_rejected',
            description: __('disposals.history.rejected'),
            performedAt: $disposal->disposed_at,
            payload: [
                'disposal_id' => $disposal->id,
                'notes' => $notes,
            ],
        );
    }

    public function logDisposed(Asset $asset, User $actor, AssetDisposal $disposal): void
    {
        $this->createHistory(
            asset: $asset,
            actor: $actor,
            action: 'disposed',
            description: __('disposals.history.executed'),
            performedAt: $disposal->disposed_at,
            payload: [
                'disposal_id' => $disposal->id,
                'type' => $disposal->type,
                'currency_code' => $disposal->currency_code,
                'net_proceeds_amount' => $disposal->net_proceeds_amount,
                'book_value_at_disposal' => $disposal->book_value_at_disposal,
                'gain_loss_amount' => $disposal->gain_loss_amount,
                'executed_at' => $disposal->executed_at,
            ],
        );
    }

    public function logMaintenanceScheduleRescheduled(Asset $asset, User $actor, int $scheduleId, CarbonInterface $from, CarbonInterface $to, ?string $reason = null): void
    {
        $this->createHistory(
            asset: $asset,
            actor: $actor,
            action: 'maintenance_schedule_rescheduled',
            description: __('maintenance_calendar.history.schedule_rescheduled'),
            performedAt: null,
            payload: [
                'schedule_id' => $scheduleId,
                'before' => ['next_due_at' => $from->toDateString()],
                'after' => ['next_due_at' => $to->toDateString()],
                'reason' => $reason,
            ],
        );
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function createHistory(Asset $asset, User $actor, string $action, ?string $description, ?CarbonInterface $performedAt, array $payload): void
    {
        AssetHistory::query()->create([
            'asset_id' => $asset->id,
            'action' => $action,
            'performed_at' => $performedAt,
            'description' => $description,
            'changed_by' => $actor->id,
            'payload' => $payload,
        ]);
    }
}
