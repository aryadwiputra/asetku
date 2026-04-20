<?php

namespace App\Console\Commands;

use App\Jobs\RunDepreciationJob;
use App\Models\AssetDepreciationRun;
use App\Models\Organization;
use Carbon\CarbonImmutable;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('assets:depreciation:auto-run')]
#[Description('Auto-run monthly asset depreciation for organizations that enable it.')]
class AssetsDepreciationAutoRunCommand extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $organizations = Organization::query()
            ->where('is_active', true)
            ->where('depreciation_auto_run_enabled', true)
            ->get(['id', 'timezone']);

        foreach ($organizations as $organization) {
            $timezone = is_string($organization->timezone) && $organization->timezone !== '' ? $organization->timezone : config('app.timezone');

            $now = CarbonImmutable::now($timezone);
            $periodEnd = $now->startOfMonth()->subDay();
            $periodStart = $periodEnd->startOfMonth();

            $run = AssetDepreciationRun::withoutGlobalScopes()->firstOrCreate(
                [
                    'organization_id' => $organization->id,
                    'period' => 'monthly',
                    'period_end' => $periodEnd->toDateString(),
                ],
                [
                    'period_start' => $periodStart->toDateString(),
                    'status' => 'queued',
                    'requested_by' => null,
                    'meta' => null,
                    'error_message' => null,
                ],
            );

            if (! $run->wasRecentlyCreated) {
                continue;
            }

            RunDepreciationJob::dispatch($run->id);
        }

        return self::SUCCESS;
    }
}
