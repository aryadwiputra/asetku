<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Organization extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'organization_group_id',
        'name',
        'slug',
        'logo_media_id',
        'address',
        'npwp',
        'industry',
        'plan',
        'plan_started_at',
        'currency_code',
        'timezone',
        'access_ip_allowlist',
        'access_working_hours',
        'access_timezone',
        'is_active',
        'deactivated_at',
        'asset_code_prefix',
        'asset_code_format',
        'maintenance_warning_percent',
        'fiscal_year_start_month',
        'fiscal_year_start_day',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'plan_started_at' => 'datetime',
            'deactivated_at' => 'datetime',
            'access_ip_allowlist' => 'array',
            'access_working_hours' => 'array',
            'maintenance_warning_percent' => 'integer',
            'fiscal_year_start_month' => 'integer',
            'fiscal_year_start_day' => 'integer',
        ];
    }

    public function group(): BelongsTo
    {
        return $this->belongsTo(OrganizationGroup::class, 'organization_group_id');
    }

    /**
     * @return HasMany<Branch, $this>
     */
    public function branches(): HasMany
    {
        return $this->hasMany(Branch::class);
    }

    /**
     * @return BelongsToMany<User, $this>
     */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->withPivot(['role', 'is_active'])
            ->withTimestamps();
    }
}
