<?php

namespace App\Services;

use App\Models\VendorContract;
use Carbon\CarbonInterface;

class VendorContractStatusService
{
    public function determine(VendorContract $contract, ?CarbonInterface $now = null): string
    {
        $now = $now ?: now();

        if ($contract->end_date === null) {
            return (string) ($contract->status ?: 'draft');
        }

        if ($contract->end_date->isPast()) {
            return 'expired';
        }

        if ($contract->end_date->lessThanOrEqualTo($now->copy()->addDays(30))) {
            return 'expiring_soon';
        }

        return 'active';
    }
}
