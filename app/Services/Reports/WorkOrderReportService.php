<?php

namespace App\Services\Reports;

use App\Models\AssetMaintenance;
use App\Models\Branch;
use App\Models\TechnicianProfile;
use App\Models\User;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class WorkOrderReportService
{
    /**
     * @param  array<string, string>  $filters
     * @return array<string, mixed>
     */
    public function build(User $user, array $filters): array
    {
        $base = $this->baseQuery($user, $filters);
        $now = now();
        $workOrders = (clone $base)->get([
            'id',
            'asset_id',
            'type',
            'status',
            'assigned_to',
            'created_at',
            'performed_at',
            'assigned_at',
            'response_due_at',
            'resolution_due_at',
            'acknowledged_at',
            'completed_at',
            'cancelled_at',
        ]);

        $opened = (clone $base)->count();
        $completed = (clone $base)->where('status', 'completed')->count();
        $cancelled = (clone $base)->where('status', 'cancelled')->count();
        $overdue = $this->applyOverdue((clone $base), $now)->count();
        $slaBreached = $this->applySlaBreached((clone $base), $now)->count();

        return [
            'kpis' => [
                'opened' => $opened,
                'completed' => $completed,
                'cancelled' => $cancelled,
                'overdue' => $overdue,
                'sla_breached' => $slaBreached,
                ...$this->slaKpis($workOrders, $now),
                ...$this->downtimeKpis($workOrders),
            ],
            'monthly_summary' => $this->monthlySummary($workOrders, $now),
            'technician_performance' => $this->technicianPerformance($workOrders, $now),
            'sla_compliance' => $this->slaComplianceSummary($workOrders, $now),
            'downtime_summary' => $this->downtimeSummary($workOrders),
            'downtime_by_asset' => $this->downtimeByAsset($workOrders),
            'downtime_by_month' => $this->downtimeByMonth($workOrders),
        ];
    }

    /**
     * @param  array<string, string>  $filters
     * @return array<string, mixed>
     */
    public function filtersMeta(array $filters = []): array
    {
        return [
            'branches' => Branch::query()->orderBy('name')->get(['id', 'name', 'code']),
            'statuses' => ['open', 'acknowledged', 'in_progress', 'completed', 'cancelled'],
            'types' => ['preventive', 'corrective'],
            'priorities' => ['low', 'normal', 'high', 'critical'],
            'technicians' => TechnicianProfile::query()
                ->where('is_active', true)
                ->with('user:id,name')
                ->orderBy('id')
                ->get()
                ->map(fn (TechnicianProfile $profile) => [
                    'user_id' => $profile->user_id,
                    'name' => $profile->user?->name,
                ])->values(),
            'default_date_from' => $filters['date_from'] ?? now()->startOfYear()->toDateString(),
            'default_date_to' => $filters['date_to'] ?? now()->toDateString(),
        ];
    }

    /**
     * @param  array<string, string>  $filters
     */
    private function baseQuery(User $user, array $filters): Builder
    {
        $query = AssetMaintenance::query()
            ->visibleTo($user)
            ->with(['technician:id,name']);

        if (($filters['date_from'] ?? '') !== '') {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }

        if (($filters['date_to'] ?? '') !== '') {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        foreach (['branch_id', 'assigned_to'] as $numericFilter) {
            $value = $filters[$numericFilter] ?? null;
            if (is_string($value) && ctype_digit($value)) {
                $query->where($numericFilter, (int) $value);
            }
        }

        foreach (['status', 'type', 'priority'] as $stringFilter) {
            $value = $filters[$stringFilter] ?? null;
            if (is_string($value) && $value !== '') {
                $query->where($stringFilter, $value);
            }
        }

        return $query;
    }

    private function applyOverdue(Builder $query, $now): Builder
    {
        return $query->where(function (Builder $inner) use ($now): void {
            $inner
                ->where(function (Builder $response) use ($now): void {
                    $response->whereNull('acknowledged_at')
                        ->whereNotNull('response_due_at')
                        ->where('response_due_at', '<', $now);
                })
                ->orWhere(function (Builder $resolution) use ($now): void {
                    $resolution->whereNull('completed_at')
                        ->whereNull('cancelled_at')
                        ->whereNotNull('resolution_due_at')
                        ->where('resolution_due_at', '<', $now);
                });
        });
    }

    private function applySlaBreached(Builder $query, $now): Builder
    {
        return $query->where(function (Builder $inner) use ($now): void {
            $inner
                ->where(function (Builder $response) use ($now): void {
                    $response->whereNull('acknowledged_at')
                        ->whereNotNull('response_due_at')
                        ->where('response_due_at', '<', $now);
                })
                ->orWhere(function (Builder $resolution) use ($now): void {
                    $resolution->whereNull('completed_at')
                        ->whereNull('cancelled_at')
                        ->whereNotNull('resolution_due_at')
                        ->where('resolution_due_at', '<', $now);
                });
        });
    }

    /**
     * @return array<int, array<string, int|string>>
     */
    private function monthlySummary(Collection $workOrders, $now): array
    {
        return $workOrders
            ->groupBy(fn (AssetMaintenance $workOrder) => $workOrder->created_at?->format('Y-m') ?? 'unknown')
            ->map(function (Collection $group, string $period) use ($now): array {
                $overdue = $group->filter(function (AssetMaintenance $workOrder) use ($now): bool {
                    return ($workOrder->acknowledged_at === null && $workOrder->response_due_at !== null && $workOrder->response_due_at->lt($now))
                        || ($workOrder->completed_at === null && $workOrder->cancelled_at === null && $workOrder->resolution_due_at !== null && $workOrder->resolution_due_at->lt($now));
                })->count();

                $responseBreached = $group->filter(fn (AssetMaintenance $workOrder) => $workOrder->acknowledged_at === null && $workOrder->response_due_at !== null && $workOrder->response_due_at->lt($now))->count();
                $resolutionBreached = $group->filter(fn (AssetMaintenance $workOrder) => $workOrder->completed_at === null && $workOrder->cancelled_at === null && $workOrder->resolution_due_at !== null && $workOrder->resolution_due_at->lt($now))->count();

                return [
                    'period' => $period,
                    'opened' => $group->count(),
                    'completed' => $group->where('status', 'completed')->count(),
                    'cancelled' => $group->where('status', 'cancelled')->count(),
                    'overdue' => $overdue,
                    'response_sla_breached' => $responseBreached,
                    'resolution_sla_breached' => $resolutionBreached,
                ];
            })
            ->sortKeys()
            ->values()
            ->all();
    }

    /**
     * @return array<int, array<string, int|string|null>>
     */
    private function technicianPerformance(Collection $workOrders, $now): array
    {
        $technicianNames = User::query()
            ->whereIn('id', $workOrders->pluck('assigned_to')->filter()->unique()->all())
            ->pluck('name', 'id');

        return $workOrders
            ->whereNotNull('assigned_to')
            ->groupBy('assigned_to')
            ->map(function (Collection $group, $technicianId) use ($technicianNames, $now): array {
                $completed = $group->where('status', 'completed');
                $averageCompletionHours = $completed
                    ->filter(fn (AssetMaintenance $workOrder) => $workOrder->assigned_at !== null && $workOrder->completed_at !== null)
                    ->avg(fn (AssetMaintenance $workOrder) => $workOrder->assigned_at?->diffInHours($workOrder->completed_at));

                return [
                    'technician' => $technicianNames[(int) $technicianId] ?? (string) $technicianId,
                    'assigned_count' => $group->count(),
                    'completed_count' => $completed->count(),
                    'overdue_count' => $group->filter(fn (AssetMaintenance $workOrder) => $workOrder->resolution_due_at !== null && $workOrder->completed_at === null && $workOrder->resolution_due_at->lt($now))->count(),
                    'average_completion_hours' => $averageCompletionHours !== null ? round($averageCompletionHours, 1) : null,
                ];
            })
            ->sortByDesc('assigned_count')
            ->values()
            ->all();
    }

    /**
     * @param  Collection<int, AssetMaintenance>  $workOrders
     * @return array<string, int|float>
     */
    private function slaKpis(Collection $workOrders, $now): array
    {
        $response = $this->slaCounts($workOrders, $now, 'response');
        $resolution = $this->slaCounts($workOrders, $now, 'resolution');

        return [
            'response_on_time' => $response['on_time'],
            'response_breached' => $response['breached'],
            'response_compliance_percent' => $response['compliance_percent'],
            'resolution_on_time' => $resolution['on_time'],
            'resolution_breached' => $resolution['breached'],
            'resolution_compliance_percent' => $resolution['compliance_percent'],
        ];
    }

    /**
     * @param  Collection<int, AssetMaintenance>  $workOrders
     * @return array<int, array<string, int|float|string>>
     */
    private function slaComplianceSummary(Collection $workOrders, $now): array
    {
        return $workOrders
            ->groupBy(fn (AssetMaintenance $workOrder) => $workOrder->created_at?->format('Y-m') ?? 'unknown')
            ->map(function (Collection $group, string $period) use ($now): array {
                $response = $this->slaCounts($group, $now, 'response');
                $resolution = $this->slaCounts($group, $now, 'resolution');

                return [
                    'period' => $period,
                    'total_with_response_sla' => $response['total_with_sla'],
                    'response_on_time' => $response['on_time'],
                    'response_breached' => $response['breached'],
                    'response_compliance_percent' => $response['compliance_percent'],
                    'total_with_resolution_sla' => $resolution['total_with_sla'],
                    'resolution_on_time' => $resolution['on_time'],
                    'resolution_breached' => $resolution['breached'],
                    'resolution_compliance_percent' => $resolution['compliance_percent'],
                ];
            })
            ->sortKeys()
            ->values()
            ->all();
    }

    /**
     * @param  Collection<int, AssetMaintenance>  $workOrders
     * @return array<string, int|float>
     */
    private function downtimeKpis(Collection $workOrders): array
    {
        $rows = $this->validDowntimeRows($workOrders);
        $incidentCount = $rows->count();
        $totalHours = round((float) $rows->sum('downtime_hours'), 1);

        return [
            'downtime_incident_count' => $incidentCount,
            'downtime_total_hours' => $totalHours,
            'downtime_average_hours' => $incidentCount > 0 ? round($totalHours / $incidentCount, 1) : 0.0,
        ];
    }

    /**
     * @param  Collection<int, AssetMaintenance>  $workOrders
     * @return array<string, int|float>
     */
    private function downtimeSummary(Collection $workOrders): array
    {
        return $this->downtimeKpis($workOrders);
    }

    /**
     * @param  Collection<int, AssetMaintenance>  $workOrders
     * @return array<int, array<string, int|float|string>>
     */
    private function downtimeByAsset(Collection $workOrders): array
    {
        $rows = $this->validDowntimeRows($workOrders);

        $assetLabels = $workOrders
            ->loadMissing('asset:id,code,name')
            ->pluck('asset')
            ->filter()
            ->mapWithKeys(fn ($asset) => [(int) $asset->id => trim("{$asset->code} {$asset->name}")]);

        return $rows
            ->groupBy('asset_id')
            ->map(function (Collection $group, $assetId) use ($assetLabels): array {
                $latest = $group->sortByDesc('completed_at')->first();
                $totalHours = round((float) $group->sum('downtime_hours'), 1);
                $incidentCount = $group->count();

                return [
                    'asset' => $assetLabels[(int) $assetId] ?? (string) $assetId,
                    'incident_count' => $incidentCount,
                    'total_downtime_hours' => $totalHours,
                    'average_downtime_hours' => $incidentCount > 0 ? round($totalHours / $incidentCount, 1) : 0.0,
                    'latest_downtime_hours' => round((float) ($latest['downtime_hours'] ?? 0), 1),
                ];
            })
            ->sortByDesc('total_downtime_hours')
            ->values()
            ->all();
    }

    /**
     * @param  Collection<int, AssetMaintenance>  $workOrders
     * @return array<int, array<string, int|float|string>>
     */
    private function downtimeByMonth(Collection $workOrders): array
    {
        return $this->validDowntimeRows($workOrders)
            ->groupBy(fn (array $row) => $row['performed_at']->format('Y-m'))
            ->map(function (Collection $group, string $period): array {
                $totalHours = round((float) $group->sum('downtime_hours'), 1);
                $incidentCount = $group->count();

                return [
                    'period' => $period,
                    'incident_count' => $incidentCount,
                    'total_downtime_hours' => $totalHours,
                    'average_downtime_hours' => $incidentCount > 0 ? round($totalHours / $incidentCount, 1) : 0.0,
                ];
            })
            ->sortKeys()
            ->values()
            ->all();
    }

    /**
     * @param  Collection<int, AssetMaintenance>  $workOrders
     * @return array{total_with_sla:int,on_time:int,breached:int,compliance_percent:float}
     */
    private function slaCounts(Collection $workOrders, $now, string $kind): array
    {
        $totalWithSla = 0;
        $onTime = 0;
        $breached = 0;

        foreach ($workOrders as $workOrder) {
            if ($kind === 'response') {
                if ($workOrder->response_due_at === null) {
                    continue;
                }

                $totalWithSla++;

                if ($workOrder->acknowledged_at !== null && $workOrder->acknowledged_at->lte($workOrder->response_due_at)) {
                    $onTime++;

                    continue;
                }

                if (
                    ($workOrder->acknowledged_at !== null && $workOrder->acknowledged_at->gt($workOrder->response_due_at))
                    || ($workOrder->acknowledged_at === null && $workOrder->response_due_at->lt($now))
                ) {
                    $breached++;
                }

                continue;
            }

            if ($workOrder->resolution_due_at === null || $workOrder->status === 'cancelled' || $workOrder->cancelled_at !== null) {
                continue;
            }

            $totalWithSla++;

            if ($workOrder->completed_at !== null && $workOrder->completed_at->lte($workOrder->resolution_due_at)) {
                $onTime++;

                continue;
            }

            if (
                ($workOrder->completed_at !== null && $workOrder->completed_at->gt($workOrder->resolution_due_at))
                || ($workOrder->completed_at === null && $workOrder->resolution_due_at->lt($now))
            ) {
                $breached++;
            }
        }

        $evaluated = $onTime + $breached;

        return [
            'total_with_sla' => $totalWithSla,
            'on_time' => $onTime,
            'breached' => $breached,
            'compliance_percent' => $evaluated > 0 ? round(($onTime / $evaluated) * 100, 1) : 0.0,
        ];
    }

    /**
     * @param  Collection<int, AssetMaintenance>  $workOrders
     * @return Collection<int, array{asset_id:int,downtime_hours:float,performed_at:CarbonInterface,completed_at:CarbonInterface}>
     */
    private function validDowntimeRows(Collection $workOrders): Collection
    {
        return $workOrders
            ->filter(function (AssetMaintenance $workOrder): bool {
                return $workOrder->type === 'corrective'
                    && $workOrder->performed_at !== null
                    && $workOrder->completed_at !== null
                    && $workOrder->asset_id !== null
                    && $workOrder->completed_at->gte($workOrder->performed_at);
            })
            ->map(function (AssetMaintenance $workOrder): array {
                return [
                    'asset_id' => (int) $workOrder->asset_id,
                    'downtime_hours' => round((float) $workOrder->performed_at?->diffInMinutes($workOrder->completed_at) / 60, 1),
                    'performed_at' => $workOrder->performed_at,
                    'completed_at' => $workOrder->completed_at,
                ];
            })
            ->values();
    }
}
