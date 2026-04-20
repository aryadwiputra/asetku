<?php

namespace App\Jobs;

use App\Models\Asset;
use App\Models\AssetDepreciationEntry;
use App\Models\AssetDepreciationRun;
use App\Models\Organization;
use App\Notifications\AssetResidualValueReachedNotification;
use App\Services\AssetDepreciationCalculator;
use App\Services\OrganizationContext;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Throwable;

class RunDepreciationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 900;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public readonly int $runId,
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        /** @var AssetDepreciationRun $run */
        $run = AssetDepreciationRun::withoutGlobalScopes()->findOrFail($this->runId);

        $organizationId = (int) $run->organization_id;
        app(OrganizationContext::class)->setCurrentOrganizationId($organizationId);

        $run->forceFill([
            'status' => 'running',
            'started_at' => now(),
            'error_message' => null,
        ])->saveQuietly();

        $created = 0;
        $skipped = 0;
        $errors = [];

        $periodStart = $run->period_start->startOfDay();
        $periodEnd = $run->period_end->endOfDay();

        $calculator = app(AssetDepreciationCalculator::class);

        try {
            Asset::query()
                ->whereNotNull('purchase_date')
                ->whereDate('purchase_date', '<=', $run->period_end->toDateString())
                ->whereNotNull('cost')
                ->where('cost', '>', 0)
                ->whereNull('archived_at')
                ->orderBy('id')
                ->select([
                    'id',
                    'organization_id',
                    'code',
                    'name',
                    'purchase_date',
                    'cost',
                    'residual_value',
                    'useful_life_months',
                    'depreciation_method',
                    'production_units_total_estimate',
                    'production_units_unit',
                    'book_value_cached',
                    'archived_at',
                    'person_in_charge_id',
                    'asset_user_id',
                ])
                ->chunkById(200, function ($assets) use (
                    $run,
                    $periodStart,
                    $periodEnd,
                    $calculator,
                    &$created,
                    &$skipped,
                    &$errors
                ): void {
                    foreach ($assets as $asset) {
                        /** @var Asset $asset */
                        try {
                            $result = $calculator->calculateForPeriod($asset, $periodStart, $periodEnd);

                            if (! $result->shouldPost) {
                                $skipped++;
                                continue;
                            }

                            $cost = (float) ($asset->cost ?? 0);
                            $residual = (float) ($asset->residual_value ?? 0);
                            $method = (string) ($asset->depreciation_method ?? 'straight_line');

                            $entry = DB::transaction(function () use ($run, $asset, $result, $cost, $residual, $method) {
                                /** @var AssetDepreciationEntry $entry */
                                $entry = AssetDepreciationEntry::query()->updateOrCreate(
                                    [
                                        'asset_id' => $asset->id,
                                        'period_end' => $run->period_end->toDateString(),
                                    ],
                                    [
                                        'run_id' => $run->id,
                                        'period_start' => $run->period_start->toDateString(),
                                        'cost' => $cost,
                                        'residual_value' => $residual,
                                        'method' => $method,
                                        'book_value_start' => $result->bookValueStart,
                                        'depreciation_amount' => $result->depreciationAmount,
                                        'accumulated_depreciation' => $result->accumulatedDepreciation,
                                        'book_value_end' => $result->bookValueEnd,
                                        'units_in_period' => $result->unitsInPeriod,
                                        'units_total_estimate' => $result->unitsTotalEstimate,
                                        'units_unit' => $result->unitsUnit,
                                        'created_by' => $run->requested_by,
                                    ],
                                );

                                $asset->forceFill([
                                    'book_value_cached' => $result->bookValueEnd,
                                ])->saveQuietly();

                                return $entry;
                            });

                            $created++;

                            $this->notifyResidualIfNeeded($asset, $entry);
                        } catch (Throwable $e) {
                            $errors[] = [
                                'asset_id' => $asset->id,
                                'error' => $e->getMessage(),
                            ];

                            $skipped++;

                            if (count($errors) > 50) {
                                array_shift($errors);
                            }
                        }
                    }
                });

            $run->forceFill([
                'status' => 'completed',
                'finished_at' => now(),
                'meta' => [
                    'created_count' => $created,
                    'skipped_count' => $skipped,
                    'errors' => $errors,
                ],
            ])->saveQuietly();
        } catch (Throwable $e) {
            $run->forceFill([
                'status' => 'failed',
                'finished_at' => now(),
                'error_message' => $e->getMessage(),
                'meta' => [
                    'created_count' => $created,
                    'skipped_count' => $skipped,
                    'errors' => $errors,
                ],
            ])->saveQuietly();

            throw $e;
        }
    }

    private function notifyResidualIfNeeded(Asset $asset, AssetDepreciationEntry $entry): void
    {
        $residual = (float) ($asset->residual_value ?? 0);

        if ((float) $entry->book_value_start <= $residual) {
            return;
        }

        if ((float) $entry->book_value_end > $residual) {
            return;
        }

        $alreadyReached = AssetDepreciationEntry::query()
            ->where('asset_id', $asset->id)
            ->where('period_end', '<', $entry->period_end->toDateString())
            ->where('book_value_end', '<=', $residual)
            ->exists();

        if ($alreadyReached) {
            return;
        }

        $organization = Organization::query()->find($asset->organization_id);
        if (! $organization) {
            return;
        }

        $ownersAndAdmins = $organization->members()
            ->wherePivotIn('role', ['Owner', 'Admin'])
            ->wherePivot('is_active', true)
            ->get();

        Notification::send($ownersAndAdmins, new AssetResidualValueReachedNotification($asset, $entry));

        $asset->loadMissing([
            'personInCharge:id,email',
            'user:id,email',
        ]);

        $emails = array_values(array_unique(array_filter([
            $asset->personInCharge?->email,
            $asset->user?->email,
        ])));

        if ($emails !== []) {
            Notification::route('mail', $emails)->notify(new AssetResidualValueReachedNotification($asset, $entry));
        }
    }
}
