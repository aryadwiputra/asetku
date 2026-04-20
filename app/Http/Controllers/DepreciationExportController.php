<?php

namespace App\Http\Controllers;

use App\Exports\AssetDepreciationScheduleExport;
use App\Exports\OrganizationDepreciationExport;
use App\Models\Asset;
use App\Models\AssetDepreciationEntry;
use App\Models\AssetDepreciationRun;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class DepreciationExportController extends Controller
{
    public function asset(Request $request, Asset $asset): BinaryFileResponse
    {
        $this->authorize('view', $asset);
        $this->authorize('export', AssetDepreciationRun::class);

        $from = $request->query('from');
        $to = $request->query('to');

        $fromDate = is_string($from) && $from !== '' ? CarbonImmutable::parse($from)->startOfMonth() : now()->subMonths(24)->startOfMonth();
        $toDate = is_string($to) && $to !== '' ? CarbonImmutable::parse($to)->endOfMonth() : now()->endOfMonth();

        $query = AssetDepreciationEntry::query()
            ->where('asset_id', $asset->id)
            ->whereDate('period_end', '>=', $fromDate->toDateString())
            ->whereDate('period_end', '<=', $toDate->toDateString())
            ->orderBy('period_end');

        $fileName = 'asset-depreciation-'.$asset->code.'.xlsx';

        return Excel::download(new AssetDepreciationScheduleExport($query), $fileName);
    }

    public function organization(Request $request): BinaryFileResponse
    {
        $this->authorize('export', AssetDepreciationRun::class);

        $from = $request->query('from');
        $to = $request->query('to');
        $branchId = $request->query('branch_id');
        $categoryId = $request->query('category_id');

        $fromDate = is_string($from) && $from !== '' ? CarbonImmutable::parse($from)->startOfMonth() : now()->subMonths(12)->startOfMonth();
        $toDate = is_string($to) && $to !== '' ? CarbonImmutable::parse($to)->endOfMonth() : now()->endOfMonth();

        $query = AssetDepreciationEntry::query()
            ->whereDate('asset_depreciation_entries.period_end', '>=', $fromDate->toDateString())
            ->whereDate('asset_depreciation_entries.period_end', '<=', $toDate->toDateString())
            ->orderBy('asset_depreciation_entries.period_end')
            ->orderBy('assets.code');

        if (is_numeric($branchId)) {
            $query->where('assets.branch_id', (int) $branchId);
        }

        if (is_numeric($categoryId)) {
            $query->where('assets.asset_category_id', (int) $categoryId);
        }

        $fileName = 'depreciation-schedule.xlsx';

        return Excel::download(new OrganizationDepreciationExport($query), $fileName);
    }
}
