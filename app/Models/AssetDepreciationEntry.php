<?php

namespace App\Models;

use App\Models\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssetDepreciationEntry extends Model
{
    use BelongsToOrganization, HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'organization_id',
        'asset_id',
        'run_id',
        'period_start',
        'period_end',
        'cost',
        'residual_value',
        'method',
        'book_value_start',
        'depreciation_amount',
        'accumulated_depreciation',
        'book_value_end',
        'units_in_period',
        'units_total_estimate',
        'units_unit',
        'created_by',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'period_start' => 'date',
            'period_end' => 'date',
            'cost' => 'decimal:2',
            'residual_value' => 'decimal:2',
            'book_value_start' => 'decimal:2',
            'depreciation_amount' => 'decimal:2',
            'accumulated_depreciation' => 'decimal:2',
            'book_value_end' => 'decimal:2',
            'units_in_period' => 'decimal:4',
            'units_total_estimate' => 'decimal:4',
        ];
    }

    public function asset(): BelongsTo
    {
        return $this->belongsTo(Asset::class);
    }

    public function run(): BelongsTo
    {
        return $this->belongsTo(AssetDepreciationRun::class, 'run_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
