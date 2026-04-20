<?php

namespace App\Exports;

use App\Models\AssetDepreciationEntry;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class OrganizationDepreciationExport implements FromQuery, WithHeadings, WithMapping
{
    /**
     * @param  Builder<AssetDepreciationEntry>  $query
     */
    public function __construct(private Builder $query) {}

    /**
     * @return Builder<AssetDepreciationEntry>
     */
    public function query(): Builder
    {
        return $this->query->clone()
            ->select([
                'asset_depreciation_entries.id',
                'asset_depreciation_entries.asset_id',
                'asset_depreciation_entries.period_start',
                'asset_depreciation_entries.period_end',
                'asset_depreciation_entries.cost',
                'asset_depreciation_entries.residual_value',
                'asset_depreciation_entries.method',
                'asset_depreciation_entries.book_value_start',
                'asset_depreciation_entries.depreciation_amount',
                'asset_depreciation_entries.accumulated_depreciation',
                'asset_depreciation_entries.book_value_end',
                'asset_depreciation_entries.units_in_period',
                'asset_depreciation_entries.units_total_estimate',
                'asset_depreciation_entries.units_unit',
                'assets.code as asset_code',
                'assets.name as asset_name',
            ])
            ->join('assets', 'assets.id', '=', 'asset_depreciation_entries.asset_id');
    }

    /**
     * @return list<string>
     */
    public function headings(): array
    {
        return [
            'Asset Code',
            'Asset Name',
            'Period Start',
            'Period End',
            'Cost',
            'Residual',
            'Method',
            'Book Value Start',
            'Depreciation',
            'Accumulated Depreciation',
            'Book Value End',
            'Units In Period',
            'Units Total Estimate',
            'Units Unit',
        ];
    }

    /**
     * @return list<mixed>
     */
    public function map($row): array
    {
        /** @var AssetDepreciationEntry $row */
        return [
            $row->asset_code ?? null,
            $row->asset_name ?? null,
            $row->period_start?->format('Y-m-d'),
            $row->period_end?->format('Y-m-d'),
            $row->cost,
            $row->residual_value,
            $row->method,
            $row->book_value_start,
            $row->depreciation_amount,
            $row->accumulated_depreciation,
            $row->book_value_end,
            $row->units_in_period,
            $row->units_total_estimate,
            $row->units_unit,
        ];
    }
}
