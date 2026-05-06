<?php

namespace App\Services;

use App\Models\Asset;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\DB;

class AssetDepreciationCalculator
{
    public function calculateForPeriod(Asset $asset, CarbonInterface $periodStart, CarbonInterface $periodEnd): AssetDepreciationCalculationResult
    {
        $cost = (float) ($asset->cost ?? 0);
        $residual = (float) ($asset->residual_value ?? 0);
        $lifeMonths = (int) ($asset->useful_life_months ?? 0);
        $method = (string) ($asset->depreciation_method ?? 'straight_line');

        if ($asset->purchase_date === null) {
            return AssetDepreciationCalculationResult::skip('missing_purchase_date');
        }

        if ($cost <= 0) {
            return AssetDepreciationCalculationResult::skip('missing_cost');
        }

        if ($lifeMonths <= 0) {
            return AssetDepreciationCalculationResult::skip('missing_useful_life');
        }

        if ($asset->purchase_date->greaterThan($periodEnd)) {
            return AssetDepreciationCalculationResult::skip('not_acquired_yet');
        }

        if ($cost <= $residual) {
            return AssetDepreciationCalculationResult::skip('already_at_residual');
        }

        if ($method === 'units_of_production') {
            return $this->calculateUnitsOfProduction($asset, $periodStart, $periodEnd);
        }

        $bookStart = $this->bookValueAt($asset, $periodStart);
        $bookEnd = $this->bookValueAt($asset, $periodEnd);

        $bookStart = max($bookStart, $residual);
        $bookEnd = max($bookEnd, $residual);

        if ($bookStart <= $residual && $bookEnd <= $residual) {
            return AssetDepreciationCalculationResult::skip('already_at_residual');
        }

        $depreciation = max(0, $bookStart - $bookEnd);
        if ($depreciation <= 0) {
            return AssetDepreciationCalculationResult::skip('no_depreciation_for_period');
        }

        $accumulated = max(0, $cost - $bookEnd);

        return AssetDepreciationCalculationResult::post(
            bookValueStart: $bookStart,
            bookValueEnd: $bookEnd,
            depreciationAmount: $depreciation,
            accumulatedDepreciation: $accumulated,
        );
    }

    public function bookValueAt(Asset $asset, CarbonInterface $asOf): float
    {
        $cost = (float) ($asset->cost ?? 0);
        $residual = (float) ($asset->residual_value ?? 0);
        $lifeMonths = (int) ($asset->useful_life_months ?? 0);
        $method = (string) ($asset->depreciation_method ?? 'straight_line');

        if ($cost <= 0 || $lifeMonths <= 0 || $asset->purchase_date === null) {
            return $cost;
        }

        $monthsUsed = max(0, $asset->purchase_date->diffInMonths($asOf));
        $monthsUsed = min($monthsUsed, $lifeMonths);

        $depreciable = max(0, $cost - $residual);

        if ($method === 'diminishing') {
            $rate = pow($residual / max($cost, 1), 1 / max($lifeMonths, 1));
            $value = $cost * pow($rate, $monthsUsed);

            return max($value, $residual);
        }

        if ($method === 'double_declining') {
            $ratio = max(0, 1 - (2 / max($lifeMonths, 1)));
            $value = $cost * pow($ratio, $monthsUsed);

            return max($value, $residual);
        }

        if ($method === 'syd') {
            $sumDigits = ($lifeMonths * ($lifeMonths + 1)) / 2;
            $sumUsedWeights = ($monthsUsed * ((2 * $lifeMonths) - $monthsUsed + 1)) / 2;

            $depreciationUsed = $sumDigits > 0 ? ($depreciable * ($sumUsedWeights / $sumDigits)) : 0;
            $value = $cost - $depreciationUsed;

            return max($value, $residual);
        }

        // straight_line (default)
        $monthlyDep = $depreciable / $lifeMonths;
        $value = $cost - ($monthlyDep * $monthsUsed);

        return max($value, $residual);
    }

    private function calculateUnitsOfProduction(Asset $asset, CarbonInterface $periodStart, CarbonInterface $periodEnd): AssetDepreciationCalculationResult
    {
        $cost = (float) ($asset->cost ?? 0);
        $residual = (float) ($asset->residual_value ?? 0);
        $totalEstimate = $asset->production_units_total_estimate !== null ? (float) $asset->production_units_total_estimate : null;
        $unit = $asset->production_units_unit;

        if (! is_float($totalEstimate) || $totalEstimate <= 0) {
            return AssetDepreciationCalculationResult::skip('missing_production_total_estimate');
        }

        $depreciable = max(0, $cost - $residual);
        if ($depreciable <= 0) {
            return AssetDepreciationCalculationResult::skip('already_at_residual');
        }

        $unitsBefore = (float) DB::table('asset_usage_logs')
            ->where('asset_id', $asset->id)
            ->whereDate('recorded_at', '<', $periodStart->toDateString())
            ->sum('units');

        $unitsInPeriod = (float) DB::table('asset_usage_logs')
            ->where('asset_id', $asset->id)
            ->whereDate('recorded_at', '>=', $periodStart->toDateString())
            ->whereDate('recorded_at', '<=', $periodEnd->toDateString())
            ->sum('units');

        if ($unitsInPeriod <= 0) {
            return AssetDepreciationCalculationResult::skip('missing_production_units_for_period');
        }

        $depPerUnit = $depreciable / $totalEstimate;

        $accumulatedBefore = min($depreciable, $unitsBefore * $depPerUnit);
        $bookStart = max($residual, $cost - $accumulatedBefore);

        $accumulatedAfter = min($depreciable, ($unitsBefore + $unitsInPeriod) * $depPerUnit);
        $bookEnd = max($residual, $cost - $accumulatedAfter);

        $depreciation = max(0, $bookStart - $bookEnd);
        if ($depreciation <= 0) {
            return AssetDepreciationCalculationResult::skip('no_depreciation_for_period');
        }

        $accumulated = max(0, $cost - $bookEnd);

        return AssetDepreciationCalculationResult::post(
            bookValueStart: $bookStart,
            bookValueEnd: $bookEnd,
            depreciationAmount: $depreciation,
            accumulatedDepreciation: $accumulated,
            unitsInPeriod: $unitsInPeriod,
            unitsTotalEstimate: $totalEstimate,
            unitsUnit: is_string($unit) && $unit !== '' ? $unit : null,
        );
    }
}
