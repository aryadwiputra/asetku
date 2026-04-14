<?php

namespace App\Models;

use App\Models\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AssetCategory extends Model
{
    use BelongsToOrganization, HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'code',
        'description',
        'parent_id',
        'depreciation_method',
        'useful_life_months',
        'residual_value',
        'capex_opex_default',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'useful_life_months' => 'integer',
            'residual_value' => 'decimal:2',
        ];
    }

    public function assets(): HasMany
    {
        return $this->hasMany(Asset::class);
    }
}
