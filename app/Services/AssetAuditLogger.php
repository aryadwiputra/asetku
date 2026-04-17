<?php

namespace App\Services;

use App\Models\Asset;
use App\Models\AssetHistory;
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
