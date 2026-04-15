<?php

namespace App\Models;

use App\Models\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class CustomField extends Model
{
    use BelongsToOrganization, HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'organization_id',
        'entity',
        'key',
        'label',
        'type',
        'options',
        'is_required',
        'is_active',
        'sort_order',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'options' => 'array',
            'is_required' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function assetCategories(): BelongsToMany
    {
        return $this->belongsToMany(AssetCategory::class, 'asset_category_custom_field')
            ->withTimestamps();
    }
}
