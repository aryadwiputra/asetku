<?php

namespace App\Services;

use App\Models\AssetMaintenance;
use Carbon\CarbonInterface;

class WorkOrderNumberGenerator
{
    public function generate(int $organizationId, CarbonInterface $timestamp): string
    {
        $year = $timestamp->year;
        $prefix = sprintf('WO-%d-', $year);

        $lastNumber = AssetMaintenance::withoutGlobalScopes()
            ->where('organization_id', $organizationId)
            ->where('work_order_number', 'like', $prefix.'%')
            ->lockForUpdate()
            ->orderByDesc('work_order_number')
            ->value('work_order_number');

        $nextSequence = 1;

        if (is_string($lastNumber) && preg_match('/^WO-\d{4}-(\d{3,})$/', $lastNumber, $matches) === 1) {
            $nextSequence = ((int) $matches[1]) + 1;
        }

        return sprintf('%s%03d', $prefix, $nextSequence);
    }
}
