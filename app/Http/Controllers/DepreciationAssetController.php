<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\AssetDepreciationEntry;
use App\Models\AssetUsageLog;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DepreciationAssetController extends Controller
{
    public function show(Request $request, Asset $asset): Response
    {
        $this->authorize('view', $asset);
        $this->authorize('viewAny', \App\Models\AssetDepreciationRun::class);

        $from = $request->query('from');
        $to = $request->query('to');

        $fromDate = is_string($from) && $from !== '' ? CarbonImmutable::parse($from)->startOfMonth() : now()->subMonths(24)->startOfMonth();
        $toDate = is_string($to) && $to !== '' ? CarbonImmutable::parse($to)->endOfMonth() : now()->endOfMonth();

        $asset->load([
            'branch:id,name,code',
            'category:id,name,code',
        ]);

        $entries = AssetDepreciationEntry::query()
            ->where('asset_id', $asset->id)
            ->whereDate('period_end', '>=', $fromDate->toDateString())
            ->whereDate('period_end', '<=', $toDate->toDateString())
            ->orderBy('period_end')
            ->get();

        $yearly = $entries
            ->groupBy(fn (AssetDepreciationEntry $entry) => $entry->period_end?->format('Y') ?? 'Unknown')
            ->map(function ($group, $year) {
                /** @var \Illuminate\Support\Collection<int, AssetDepreciationEntry> $group */
                $sum = (float) $group->sum('depreciation_amount');
                $last = $group->sortBy('period_end')->last();

                return [
                    'year' => $year,
                    'total_depreciation' => $sum,
                    'book_value_end' => $last?->book_value_end,
                ];
            })
            ->values();

        $usageLogs = AssetUsageLog::query()
            ->where('asset_id', $asset->id)
            ->orderByDesc('recorded_at')
            ->limit(50)
            ->get(['id', 'recorded_at', 'units', 'unit', 'notes', 'created_by', 'created_at']);

        return Inertia::render('depreciation/asset', [
            'asset' => [
                'id' => $asset->id,
                'code' => $asset->code,
                'name' => $asset->name,
                'depreciation_method' => $asset->depreciation_method,
                'useful_life_months' => $asset->useful_life_months,
                'cost' => $asset->cost,
                'residual_value' => $asset->residual_value,
                'production_units_total_estimate' => $asset->production_units_total_estimate,
                'production_units_unit' => $asset->production_units_unit,
                'book_value_cached' => $asset->book_value_cached,
                'branch' => $asset->branch ? ['id' => $asset->branch->id, 'name' => $asset->branch->name, 'code' => $asset->branch->code] : null,
                'category' => $asset->category ? ['id' => $asset->category->id, 'name' => $asset->category->name, 'code' => $asset->category->code] : null,
            ],
            'entries' => $entries,
            'yearly' => $yearly,
            'usageLogs' => $usageLogs,
            'range' => [
                'from' => $fromDate->toDateString(),
                'to' => $toDate->toDateString(),
            ],
        ]);
    }
}
