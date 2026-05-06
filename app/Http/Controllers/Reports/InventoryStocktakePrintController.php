<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Http\Requests\DataTableRequest;
use App\Models\Branch;
use App\Queries\AssetListQuery;
use Inertia\Inertia;
use Inertia\Response;

class InventoryStocktakePrintController extends Controller
{
    public function show(DataTableRequest $request): Response
    {
        $user = $request->user();
        if ($user === null) {
            abort(401);
        }

        $organizationId = $user->current_organization_id;
        $isMember = $organizationId !== null && $user->hasOrganizationRole((int) $organizationId, ['Owner', 'Admin', 'Manager', 'Member']);

        abort_unless($user->can('report_inventory.view') || $isMember, 403);

        $branchId = $request->query('branch_id');
        abort_unless(is_string($branchId) && ctype_digit($branchId), 422);

        $filters = array_merge($request->filters(), ['branch_id' => $branchId]);
        $filters = $this->normalizeFilters($filters, $request);

        $search = $request->searchQuery();
        $sortBy = $request->sortBy('code');
        $sortDirection = $request->sortDirection('asc');

        $allowedSorts = ['code', 'name', 'updated_at', 'created_at'];
        if (! in_array($sortBy, $allowedSorts, true)) {
            $sortBy = 'code';
        }

        $query = AssetListQuery::build($user, $search, $filters)->whereNull('archived_at');

        $assets = $query
            ->orderBy($sortBy, $sortDirection)
            ->select([
                'assets.id',
                'assets.code',
                'assets.name',
                'assets.qr_token',
                'assets.branch_id',
                'assets.department_id',
                'assets.asset_location_id',
                'assets.asset_status_id',
                'assets.asset_condition_id',
                'assets.person_in_charge_id',
                'assets.asset_user_id',
            ])
            ->get();

        $assets->load([
            'branch:id,name,code',
            'department:id,name,code',
            'location:id,name,code,parent_id,branch_id',
            'status:id,name,code',
            'condition:id,name,code',
            'personInCharge:id,name',
            'user:id,name',
        ]);

        $branch = Branch::query()->findOrFail((int) $branchId, ['id', 'name', 'code']);

        return Inertia::render('reports/inventory/print', [
            'branch' => $branch,
            'filters' => $filters,
            'search' => $search,
            'assets' => $assets,
            'meta' => [
                'generated_at' => now()->toIso8601String(),
            ],
        ]);
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
