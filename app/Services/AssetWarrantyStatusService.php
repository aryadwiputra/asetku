<?php

namespace App\Services;

use App\Models\Asset;
use Carbon\CarbonInterface;

class AssetWarrantyStatusService
{
    /**
     * @return array{status:string,warranty_end:string|null,days_remaining:int|null}
     */
    public function determine(Asset $asset, ?CarbonInterface $now = null): array
    {
        $now = $now ?: now();
        $warrantyEnd = $asset->warranty_end;

        if ($warrantyEnd === null && $asset->purchase_date !== null && $asset->warranty?->duration_months !== null) {
            $warrantyEnd = $asset->purchase_date->copy()->addMonths((int) $asset->warranty->duration_months);
        }

        if ($warrantyEnd === null) {
            return [
                'status' => 'unknown',
                'warranty_end' => null,
                'days_remaining' => null,
            ];
        }

        $daysRemaining = (int) $now->startOfDay()->diffInDays($warrantyEnd->copy()->startOfDay(), false);

        return [
            'status' => $warrantyEnd->isPast() ? 'expired' : ($daysRemaining <= 30 ? 'expiring_soon' : 'active'),
            'warranty_end' => $warrantyEnd->toDateString(),
            'days_remaining' => $daysRemaining,
        ];
    }
}
