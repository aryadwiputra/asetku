<?php

namespace App\Console\Commands;

use App\Jobs\EscalateOverdueWorkOrdersJob;
use App\Models\Organization;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('maintenance:escalate-overdue-work-orders')]
#[Description('Escalate overdue work orders based on SLA and send notifications.')]
class EscalateOverdueWorkOrdersCommand extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $organizations = Organization::query()
            ->where('is_active', true)
            ->get(['id']);

        foreach ($organizations as $organization) {
            EscalateOverdueWorkOrdersJob::dispatch($organization->id);
        }

        return self::SUCCESS;
    }
}
