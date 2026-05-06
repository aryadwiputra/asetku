<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Http\Requests\DataTableRequest;
use App\Models\AssetCategory;
use App\Models\AssetCondition;
use App\Models\AssetLocation;
use App\Models\AssetStatus;
use App\Models\Branch;
use App\Models\Department;
use App\Queries\AssetListQuery;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class InventoryReportController extends Controller
{
    public function index(DataTableRequest $request): Response
    {
        $user = $request->user();
        if ($user === null) {
            abort(401);
        }

        $organizationId = $user->current_organization_id;
        $isMember = $organizationId !== null && $user->hasOrganizationRole((int) $organizationId, ['Owner', 'Admin', 'Manager', 'Member']);

        abort_unless($user->can('report_inventory.view') || $isMember, 403);

        $search = $request->searchQuery();
        $filters = $this->normalizeFilters($request->filters(), $request);

        $base = AssetListQuery::buildBase($user, $search, $filters)->whereNull('archived_at');

        return Inertia::render('reports/inventory/index', [
            'filters' => $filters,
            'search' => $search,
            'summary' => $this->summary($base),
            'filtersMeta' => [
                'branches' => Branch::query()->orderBy('name')->get(['id', 'name', 'code']),
                'statuses' => AssetStatus::query()->orderBy('name')->get(['id', 'name', 'code']),
                'conditions' => AssetCondition::query()->orderBy('name')->get(['id', 'name', 'code']),
                'categories' => AssetCategory::query()->orderBy('name')->get(['id', 'name', 'code', 'parent_id']),
                'locations' => AssetLocation::query()->orderBy('name')->get(['id', 'name', 'code', 'branch_id', 'parent_id']),
                'departments' => Department::query()->orderBy('name')->get(['id', 'name', 'code', 'branch_id']),
            ],
            'abilities' => [
                'view' => true,
                'export' => $user->can('report_inventory.export') || $user->can('asset.export') || ($organizationId !== null && $user->hasOrganizationRole((int) $organizationId, ['Owner', 'Admin', 'Manager'])),
            ],
        ]);
    }

    /**
     * @param  Builder  $base
     * @return array{
     *   total_assets:int,
     *   total_value:string,
     *   by_branch:array<int, array{id:int,name:string,code:string|null,count:int,total_value:string}>,
     *   by_status:array<int, array{id:int,name:string,code:string|null,count:int,total_value:string}>,
     *   by_condition:array<int, array{id:int,name:string,code:string|null,count:int,total_value:string}>,
     * }
     */
    private function summary($base): array
    {
        $totalAssets = (clone $base)->count();
        $totalValue = (string) ((clone $base)->sum('cost') ?? 0);

        return [
            'total_assets' => $totalAssets,
            'total_value' => $totalValue,
            'by_branch' => $this->groupSummary($base, 'branch_id', Branch::class),
            'by_status' => $this->groupSummary($base, 'asset_status_id', AssetStatus::class),
            'by_condition' => $this->groupSummary($base, 'asset_condition_id', AssetCondition::class),
        ];
    }

    /**
     * @param  Builder  $base
     * @param  class-string  $modelClass
     * @return array<int, array{id:int,name:string,code:string|null,count:int,total_value:string}>
     */
    private function groupSummary($base, string $foreignKey, string $modelClass): array
    {
        /** @var Collection<int, object{key:int|null,count:int,total_value:string|null}> $rows */
        $rows = (clone $base)
            ->whereNotNull($foreignKey)
            ->selectRaw("{$foreignKey} as `key`, count(*) as `count`, sum(cost) as `total_value`")
            ->groupBy($foreignKey)
            ->orderByDesc('count')
            ->limit(5)
            ->get();

        $ids = $rows->pluck('key')->filter()->map(fn ($v) => (int) $v)->values();

        $models = $modelClass::query()
            ->whereIn('id', $ids)
            ->get(['id', 'name', 'code'])
            ->keyBy('id');

        return $rows
            ->map(function ($row) use ($models): array {
                $id = (int) $row->key;
                $model = $models->get($id);

                return [
                    'id' => $id,
                    'name' => (string) ($model?->name ?? (string) $id),
                    'code' => $model?->code,
                    'count' => (int) $row->count,
                    'total_value' => (string) ($row->total_value ?? 0),
                ];
            })
            ->values()
            ->all();
    }

    /**
     * Support both report-style query keys (status_id) and standard AssetListQuery keys (asset_status_id).
     *
     * @param  array<string, string>  $filters
     * @return array<string, string>
     */
    private function normalizeFilters(array $filters, DataTableRequest $request): array
    {
        $aliases = [
            'status_id' => 'asset_status_id',
            'condition_id' => 'asset_condition_id',
            'category_id' => 'asset_category_id',
            'location_id' => 'asset_location_id',
        ];

        foreach ($aliases as $from => $to) {
            $value = $request->query($from);

            if (is_string($value) && $value !== '' && ! array_key_exists($to, $filters)) {
                $filters[$to] = $value;
            }
        }

        return $filters;
    }
}
