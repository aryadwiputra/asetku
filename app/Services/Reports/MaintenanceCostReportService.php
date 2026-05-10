<?php

namespace App\Services\Reports;

use App\Models\Asset;
use App\Models\AssetCategory;
use App\Models\AssetMaintenance;
use App\Models\Branch;
use App\Models\TechnicianProfile;
use App\Models\User;
use App\Models\Vendor;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class MaintenanceCostReportService
{
    /**
     * @param  array<string, string>  $filters
     * @return array<string, mixed>
     */
    public function build(User $user, array $filters): array
    {
        $base = $this->baseQuery($user, $filters);

        $totalCost = (string) ((clone $base)->sum('cost') ?? 0);
        $withCost = (clone $base)->whereNotNull('cost')->where('cost', '>', 0)->count();
        $averageCost = $withCost > 0 ? (string) round(((float) $totalCost) / $withCost, 2) : '0';

        return [
            'kpis' => [
                'total_cost' => $totalCost,
                'work_orders_with_cost' => $withCost,
                'average_cost_per_work_order' => $averageCost,
            ],
            'monthly_totals' => $this->monthlyTotals($base),
            'cost_by_asset' => $this->costByAsset($base),
            'cost_by_category' => $this->costByCategory($base),
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
            'categories' => AssetCategory::query()->orderBy('name')->get(['id', 'name', 'code']),
            'assets' => Asset::query()->orderBy('name')->get(['id', 'name', 'code']),
            'assignees' => TechnicianProfile::query()
                ->where('is_active', true)
                ->with('user:id,name')
                ->get()
                ->map(fn (TechnicianProfile $profile) => ['id' => $profile->user_id, 'name' => $profile->user?->name]),
            'vendors' => Vendor::query()->orderBy('name')->get(['id', 'name']),
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
            ->with(['asset.category:id,name,code']);

        if (($filters['date_from'] ?? '') !== '') {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }

        if (($filters['date_to'] ?? '') !== '') {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        if (($filters['branch_id'] ?? '') !== '' && ctype_digit($filters['branch_id'])) {
            $query->where('branch_id', (int) $filters['branch_id']);
        }

        if (($filters['asset_id'] ?? '') !== '' && ctype_digit($filters['asset_id'])) {
            $query->where('asset_id', (int) $filters['asset_id']);
        }

        if (($filters['assigned_to'] ?? '') !== '' && ctype_digit($filters['assigned_to'])) {
            $query->where('assigned_to', (int) $filters['assigned_to']);
        }

        if (($filters['vendor_id'] ?? '') !== '' && ctype_digit($filters['vendor_id'])) {
            $query->where('vendor_id', (int) $filters['vendor_id']);
        }

        if (($filters['asset_category_id'] ?? '') !== '' && ctype_digit($filters['asset_category_id'])) {
            $query->whereHas('asset', fn (Builder $assetQuery) => $assetQuery->where('asset_category_id', (int) $filters['asset_category_id']));
        }

        return $query;
    }

    /**
     * @return array<int, array{period:string,total_cost:string,work_order_count:int}>
     */
    private function monthlyTotals(Builder $base): array
    {
        /** @var Collection<int, AssetMaintenance> $workOrders */
        $workOrders = (clone $base)->get(['id', 'cost', 'created_at']);

        return $workOrders
            ->groupBy(fn (AssetMaintenance $workOrder) => $workOrder->created_at?->format('Y-m') ?? 'unknown')
            ->map(fn (Collection $group, string $period): array => [
                'period' => $period,
                'total_cost' => (string) round((float) $group->sum(fn (AssetMaintenance $workOrder) => (float) ($workOrder->cost ?? 0)), 2),
                'work_order_count' => $group->count(),
            ])
            ->sortKeys()
            ->values()
            ->all();
    }

    /**
     * @return array<int, array{asset:string,total_cost:string,work_order_count:int}>
     */
    private function costByAsset(Builder $base): array
    {
        /** @var Collection<int, AssetMaintenance> $workOrders */
        $workOrders = (clone $base)->with('asset:id,name,code')->get(['id', 'asset_id', 'cost']);

        return $workOrders
            ->groupBy('asset_id')
            ->map(function (Collection $group): array {
                $asset = $group->first()?->asset;

                return [
                    'asset' => $asset ? trim("{$asset->code} {$asset->name}") : '-',
                    'total_cost' => (string) round((float) $group->sum(fn (AssetMaintenance $workOrder) => (float) ($workOrder->cost ?? 0)), 2),
                    'work_order_count' => $group->count(),
                ];
            })
            ->sortByDesc('total_cost')
            ->values()
            ->all();
    }

    /**
     * @return array<int, array{category:string,total_cost:string,work_order_count:int}>
     */
    private function costByCategory(Builder $base): array
    {
        /** @var Collection<int, AssetMaintenance> $workOrders */
        $workOrders = (clone $base)->with('asset.category:id,name,code')->get(['id', 'asset_id', 'cost']);

        return $workOrders
            ->groupBy(fn (AssetMaintenance $workOrder) => $workOrder->asset?->category?->id ?? 0)
            ->map(function (Collection $group): array {
                $category = $group->first()?->asset?->category;

                return [
                    'category' => $category ? trim("{$category->code} {$category->name}") : '-',
                    'total_cost' => (string) round((float) $group->sum(fn (AssetMaintenance $workOrder) => (float) ($workOrder->cost ?? 0)), 2),
                    'work_order_count' => $group->count(),
                ];
            })
            ->sortByDesc('total_cost')
            ->values()
            ->all();
    }
}
