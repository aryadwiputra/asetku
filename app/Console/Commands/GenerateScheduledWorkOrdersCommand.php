<?php

namespace App\Console\Commands;

use App\Jobs\GenerateWorkOrdersFromSchedulesJob;
use App\Models\Organization;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('maintenance:generate-work-orders')]
#[Description('Generate work orders from active preventive maintenance schedules.')]
class GenerateScheduledWorkOrdersCommand extends Command
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
            GenerateWorkOrdersFromSchedulesJob::dispatch($organization->id);
        }

        return self::SUCCESS;
    }
}
