<?php

namespace App\Services;

use App\Models\AssetMaintenance;
use Carbon\CarbonInterface;

class WorkOrderSlaService
{
    public function computeResponseDueAt(AssetMaintenance $workOrder, ?CarbonInterface $baseTime = null): ?CarbonInterface
    {
        if ($workOrder->sla_response_hours === null) {
            return null;
        }

        $baseTime = $baseTime ?? $workOrder->created_at;

        return $baseTime?->copy()->addHours((int) $workOrder->sla_response_hours);
    }

    public function computeResolutionDueAt(AssetMaintenance $workOrder, ?CarbonInterface $baseTime = null): ?CarbonInterface
    {
        if ($workOrder->sla_resolution_hours === null) {
            return null;
        }

        $baseTime = $baseTime ?? $workOrder->created_at;

        return $baseTime?->copy()->addHours((int) $workOrder->sla_resolution_hours);
    }

    public function applyDueDates(AssetMaintenance $workOrder): void
    {
        $workOrder->response_due_at = $this->computeResponseDueAt($workOrder);
        $workOrder->resolution_due_at = $this->computeResolutionDueAt($workOrder);
    }

    public function isResponseOverdue(AssetMaintenance $workOrder, CarbonInterface $now): bool
    {
        if ($workOrder->response_due_at === null) {
            return false;
        }

        if ($workOrder->acknowledged_at !== null) {
            return false;
        }

        if ($workOrder->status === 'completed' || $workOrder->completed_at !== null) {
            return false;
        }

        return $now->greaterThan($workOrder->response_due_at);
    }

    public function isResolutionOverdue(AssetMaintenance $workOrder, CarbonInterface $now): bool
    {
        if ($workOrder->resolution_due_at === null) {
            return false;
        }

        if ($workOrder->status === 'completed' || $workOrder->completed_at !== null) {
            return false;
        }

        return $now->greaterThan($workOrder->resolution_due_at);
    }
}
