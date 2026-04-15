<?php

namespace App\Exports;

use App\Models\Asset;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class AssetsExport implements FromQuery, WithHeadings, WithMapping
{
    /**
     * @param  Builder<Asset>  $query
     */
    public function __construct(private Builder $query) {}

    /**
     * @return Builder<Asset>
     */
    public function query(): Builder
    {
        return $this->query->clone()
            ->select([
                'assets.id',
                'assets.code',
                'assets.name',
                'assets.serial_number',
                'assets.brand',
                'assets.model',
                'assets.purchase_date',
                'assets.cost',
                'assets.branch_id',
                'assets.department_id',
                'assets.asset_category_id',
                'assets.asset_status_id',
                'assets.asset_condition_id',
            ])
            ->with([
                'branch:id,name,code',
                'department:id,name,code',
                'category:id,name,code',
                'status:id,name,code',
                'condition:id,name,code',
            ]);
    }

    /**
     * @return list<string>
     */
    public function headings(): array
    {
        return [
            'Code',
            'Name',
            'Category',
            'Status',
            'Condition',
            'Branch',
            'Department',
            'Serial Number',
            'Brand',
            'Model',
            'Purchase Date',
            'Cost',
        ];
    }

    /**
     * @return list<mixed>
     */
    public function map($row): array
    {
        /** @var Asset $row */
        return [
            $row->code,
            $row->name,
            $row->category?->name,
            $row->status?->name,
            $row->condition?->name,
            $row->branch?->name,
            $row->department?->name,
            $row->serial_number,
            $row->brand,
            $row->model,
            $row->purchase_date?->format('Y-m-d'),
            $row->cost,
        ];
    }
}
