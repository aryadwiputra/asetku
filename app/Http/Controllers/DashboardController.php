<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\AssetCondition;
use App\Models\AssetHistory;
use App\Models\AssetStatus;
use App\Models\Branch;
use App\Queries\AssetListQuery;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Asset::class);

        $user = $request->user();
        if ($user === null) {
            abort(401);
        }

        $baseQuery = AssetListQuery::buildBase($user, null, []);

        $kpis = $this->kpis($baseQuery);
        $attentionConditionIds = $this->attentionConditionIds();

        return Inertia::render('dashboard', [
            'kpis' => $kpis,
            'attention' => [
                'items' => $this->attentionItems($baseQuery, $attentionConditionIds),
            ],
            'topBranches' => $this->topBranches($baseQuery),
            'recentActivity' => $this->recentActivity($user),
            'quickActions' => $this->quickActions($user),
        ]);
    }

    /**
     * @return array{
     *  total_assets:int,
     *  total_value:float,
     *  needs_attention:int,
     *  created_last_7_days:int,
     *  trend_created_last_7_days:float
     * }
     */
    private function kpis(Builder $baseQuery): array
    {
        $totalAssets = (clone $baseQuery)->count();
        $totalValue = (float) (clone $baseQuery)->sum('cost');

        $attentionConditionIds = $this->attentionConditionIds();
        $needsAttention = empty($attentionConditionIds)
            ? 0
            : (clone $baseQuery)->whereIn('asset_condition_id', $attentionConditionIds)->count();

        $now = now();
        $createdLast7Days = (clone $baseQuery)
            ->where('created_at', '>=', $now->copy()->subDays(7))
            ->count();

        $createdPrevious7Days = (clone $baseQuery)
            ->where('created_at', '>=', $now->copy()->subDays(14))
            ->where('created_at', '<', $now->copy()->subDays(7))
            ->count();

        $trend = $this->percentChange($createdPrevious7Days, $createdLast7Days);

        return [
            'total_assets' => (int) $totalAssets,
            'total_value' => $totalValue,
            'needs_attention' => (int) $needsAttention,
            'created_last_7_days' => (int) $createdLast7Days,
            'trend_created_last_7_days' => $trend,
        ];
    }

    /**
     * @return list<int>
     */
    private function attentionConditionIds(): array
    {
        $explicit = AssetCondition::query()
            ->whereIn('code', ['needs_attention', 'broken'])
            ->pluck('id')
            ->map(fn ($id) => (int) $id)
            ->all();

        if (! empty($explicit)) {
            return $explicit;
        }

        $fallback = AssetCondition::query()
            ->where('code', '!=', 'good')
            ->pluck('id')
            ->map(fn ($id) => (int) $id)
            ->all();

        return $fallback;
    }

    /**
     * @param  list<int>  $attentionConditionIds
     * @return list<array{
     *  id:int,
     *  code:string,
     *  name:string,
     *  updated_at:string,
     *  branch:array{id:int,name:string,code:string}|null,
     *  condition:array{id:int,name:string,code:string}|null,
     *  status:array{id:int,name:string,code:string}|null
     * }>
     */
    private function attentionItems(Builder $baseQuery, array $attentionConditionIds): array
    {
        if (empty($attentionConditionIds)) {
            return [];
        }

        return (clone $baseQuery)
            ->whereIn('asset_condition_id', $attentionConditionIds)
            ->with([
                'branch:id,name,code',
                'condition:id,name,code',
                'status:id,name,code',
            ])
            ->orderByDesc('updated_at')
            ->limit(10)
            ->get(['id', 'code', 'name', 'branch_id', 'asset_condition_id', 'asset_status_id', 'updated_at'])
            ->map(fn (Asset $asset) => [
                'id' => $asset->id,
                'code' => $asset->code,
                'name' => $asset->name,
                'updated_at' => $asset->updated_at?->toIso8601String(),
                'branch' => $asset->branch ? [
                    'id' => $asset->branch->id,
                    'name' => $asset->branch->name,
                    'code' => $asset->branch->code,
                ] : null,
                'condition' => $asset->condition ? [
                    'id' => $asset->condition->id,
                    'name' => $asset->condition->name,
                    'code' => $asset->condition->code,
                ] : null,
                'status' => $asset->status ? [
                    'id' => $asset->status->id,
                    'name' => $asset->status->name,
                    'code' => $asset->status->code,
                ] : null,
            ])
            ->all();
    }

    /**
     * @return list<array{
     *  branch:array{id:int,name:string,code:string},
     *  asset_count:int,
     *  total_value:float
     * }>
     */
    private function topBranches(Builder $baseQuery): array
    {
        $stats = (clone $baseQuery)
            ->whereNotNull('branch_id')
            ->select('branch_id', DB::raw('COUNT(*) as asset_count'), DB::raw('COALESCE(SUM(cost), 0) as total_value'))
            ->groupBy('branch_id')
            ->orderByDesc('asset_count')
            ->limit(5)
            ->get();

        if ($stats->isEmpty()) {
            return [];
        }

        $branches = Branch::query()
            ->whereIn('id', $stats->pluck('branch_id')->all())
            ->get(['id', 'name', 'code'])
            ->keyBy('id');

        return $stats
            ->map(function ($row) use ($branches) {
                $branchId = (int) $row->branch_id;
                $branch = $branches->get($branchId);

                if (! $branch) {
                    return null;
                }

                return [
                    'branch' => [
                        'id' => $branch->id,
                        'name' => $branch->name,
                        'code' => $branch->code,
                    ],
                    'asset_count' => (int) $row->asset_count,
                    'total_value' => (float) $row->total_value,
                ];
            })
            ->filter()
            ->values()
            ->all();
    }

    /**
     * @return list<array{
     *  id:int,
     *  action:string,
     *  description:string|null,
     *  created_at:string,
     *  actor:array{id:int,name:string}|null,
     *  asset:array{id:int,code:string,name:string}|null
     * }>
     */
    private function recentActivity($user): array
    {
        return AssetHistory::query()
            ->whereHas('asset', fn (Builder $q) => $q->forUser($user))
            ->latest()
            ->limit(20)
            ->with([
                'changedBy:id,name',
                'asset:id,code,name',
            ])
            ->get(['id', 'asset_id', 'action', 'description', 'changed_by', 'created_at'])
            ->map(fn (AssetHistory $history): array => [
                'id' => $history->id,
                'action' => $history->action,
                'description' => $history->description,
                'created_at' => $history->created_at?->toIso8601String(),
                'actor' => $history->changedBy ? [
                    'id' => $history->changedBy->id,
                    'name' => $history->changedBy->name,
                ] : null,
                'asset' => $history->asset ? [
                    'id' => $history->asset->id,
                    'code' => $history->asset->code,
                    'name' => $history->asset->name,
                ] : null,
            ])
            ->all();
    }

    /**
     * @return array{
     *  canCreateAsset:bool,
     *  canImportAssets:bool,
     *  canViewAssets:bool,
     *  canViewMasterData:bool
     * }
     */
    private function quickActions($user): array
    {
        $organizationId = $user->current_organization_id;
        $isManager = $organizationId !== null && $user->hasOrganizationRole((int) $organizationId, ['Owner', 'Admin', 'Manager']);

        $canCreateAsset = Gate::forUser($user)->allows('create', Asset::class);
        $canViewAssets = Gate::forUser($user)->allows('viewAny', Asset::class);
        $canImportAssets = $isManager || $user->can('asset_import.create') || $user->can('asset_import.update');
        $canViewMasterData = Gate::forUser($user)->allows('viewAny', AssetStatus::class);

        return [
            'canCreateAsset' => $canCreateAsset,
            'canImportAssets' => $canImportAssets,
            'canViewAssets' => $canViewAssets,
            'canViewMasterData' => $canViewMasterData,
        ];
    }

    private function percentChange(int $previous, int $current): float
    {
        if ($previous <= 0) {
            return $current > 0 ? 100.0 : 0.0;
        }

        return (($current - $previous) / $previous) * 100;
    }
}
