<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\AssetDepreciationEntry;
use App\Models\AssetDepreciationRun;
use App\Models\Organization;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DepreciationController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', AssetDepreciationRun::class);

        $user = $request->user();
        if ($user === null) {
            abort(401);
        }

        $organizationId = $user->current_organization_id ?? $user->organization_id;
        if ($organizationId === null) {
            abort(403);
        }

        $organization = Organization::query()->findOrFail((int) $organizationId);

        $runs = AssetDepreciationRun::query()
            ->orderByDesc('period_end')
            ->paginate(20)
            ->withQueryString();

        $latestPeriodEnd = AssetDepreciationRun::query()->max('period_end');

        $eligibleCount = Asset::query()
            ->whereNotNull('purchase_date')
            ->whereNotNull('cost')
            ->where('cost', '>', 0)
            ->whereNull('archived_at')
            ->count();

        $latestDepreciationTotal = 0;
        if ($latestPeriodEnd !== null) {
            $latestDepreciationTotal = (float) AssetDepreciationEntry::query()
                ->whereDate('period_end', '=', (string) $latestPeriodEnd)
                ->sum('depreciation_amount');
        }

        return Inertia::render('depreciation/index', [
            'organization' => [
                'id' => $organization->id,
                'name' => $organization->name,
                'currency_code' => $organization->currency_code,
                'timezone' => $organization->timezone,
                'depreciation_frequency' => $organization->depreciation_frequency,
                'depreciation_auto_run_enabled' => (bool) $organization->depreciation_auto_run_enabled,
            ],
            'kpis' => [
                'eligible_assets' => $eligibleCount,
                'latest_period_total_depreciation' => $latestDepreciationTotal,
            ],
            'runs' => $runs,
        ]);
    }
}
