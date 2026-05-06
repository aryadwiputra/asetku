<?php

namespace App\Models;

use App\Models\Concerns\BelongsToOrganization;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class Asset extends Model
{
    use BelongsToOrganization, HasFactory, SoftDeletes;

    protected static function booted(): void
    {
        static::creating(function (self $asset): void {
            if (! is_string($asset->qr_token) || $asset->qr_token === '') {
                $asset->qr_token = Str::lower(Str::random(40));
            }
        });
    }

    /**
     * @var list<string>
     */
    protected $fillable = [
        'code',
        'name',
        'brand',
        'model',
        'series',
        'serial_number',
        'imei',
        'description',
        'asset_status_id',
        'asset_condition_id',
        'asset_class_id',
        'asset_category_id',
        'unit_id',
        'branch_id',
        'department_id',
        'person_in_charge_id',
        'asset_user_id',
        'asset_location_id',
        'warranty_id',
        'purchase_date',
        'warranty_end',
        'warranty_reminder_sent_at',
        'warranty_expiry_reminder_sent_at',
        'cost',
        'depreciation_method',
        'useful_life_months',
        'residual_value',
        'production_units_total_estimate',
        'production_units_unit',
        'book_value_cached',
        'capex_opex',
        'vendor_contract_id',
        'qr_token',
        'qr_path',
        'metadata',
        'latitude',
        'longitude',
        'rfid_tag',
        'nfc_tag',
        'label_template',
        'is_consumable',
        'quantity',
        'available_quantity',
        'is_pool',
        'archived_at',
        'archived_by',
        'retention_until',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'purchase_date' => 'date',
            'warranty_end' => 'date',
            'warranty_reminder_sent_at' => 'datetime',
            'warranty_expiry_reminder_sent_at' => 'datetime',
            'cost' => 'decimal:2',
            'residual_value' => 'decimal:2',
            'production_units_total_estimate' => 'decimal:4',
            'book_value_cached' => 'decimal:2',
            'metadata' => 'array',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'is_consumable' => 'boolean',
            'is_pool' => 'boolean',
            'archived_at' => 'datetime',
            'retention_until' => 'date',
        ];
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(AssetStatus::class, 'asset_status_id');
    }

    public function condition(): BelongsTo
    {
        return $this->belongsTo(AssetCondition::class, 'asset_condition_id');
    }

    public function class(): BelongsTo
    {
        return $this->belongsTo(AssetClass::class, 'asset_class_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(AssetCategory::class, 'asset_category_id');
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function personInCharge(): BelongsTo
    {
        return $this->belongsTo(PersonInCharge::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(AssetUser::class, 'asset_user_id');
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(AssetLocation::class, 'asset_location_id');
    }

    public function warranty(): BelongsTo
    {
        return $this->belongsTo(Warranty::class);
    }

    public function vendorContract(): BelongsTo
    {
        return $this->belongsTo(VendorContract::class);
    }

    public function vendorContracts(): BelongsToMany
    {
        return $this->belongsToMany(VendorContract::class, 'asset_vendor_contract')
            ->withPivot(['is_primary'])
            ->withTimestamps();
    }

    public function histories(): HasMany
    {
        return $this->hasMany(AssetHistory::class);
    }

    public function movements(): HasMany
    {
        return $this->hasMany(AssetMovement::class);
    }

    public function usageLogs(): HasMany
    {
        return $this->hasMany(AssetUsageLog::class);
    }

    public function disposals(): HasMany
    {
        return $this->hasMany(AssetDisposal::class);
    }

    public function audits(): HasMany
    {
        return $this->hasMany(AssetAudit::class);
    }

    public function maintenances(): HasMany
    {
        return $this->hasMany(AssetMaintenance::class);
    }

    public function photos(): HasMany
    {
        return $this->hasMany(AssetPhoto::class);
    }

    public function primaryPhoto(): HasOne
    {
        return $this->hasOne(AssetPhoto::class)->where('is_primary', true);
    }

    public function changelogs(): HasMany
    {
        return $this->hasMany(AssetChangelog::class);
    }

    public function media(): HasMany
    {
        return $this->hasMany(AssetMedia::class);
    }

    public function warrantyClaims(): HasMany
    {
        return $this->hasMany(AssetWarrantyClaim::class);
    }

    public function scopeForUser(Builder $query, ?User $user): Builder
    {
        if (! $user) {
            return $query;
        }

        if ($user->can('assets.view_all')) {
            return $query;
        }

        $departmentId = $user->department_id;
        $locationId = $user->asset_location_id;

        if (! $departmentId && ! $locationId) {
            return $query;
        }

        return $query->where(function (Builder $subQuery) use ($departmentId, $locationId) {
            if ($departmentId) {
                $subQuery->orWhere('department_id', $departmentId);
            }
            if ($locationId) {
                $subQuery->orWhere('asset_location_id', $locationId);
            }
        });
    }

    public function isVisibleTo(?User $user): bool
    {
        if (! $user) {
            return false;
        }

        if ($user->can('assets.view_all')) {
            return true;
        }

        $departmentMatch = $user->department_id && $this->department_id === $user->department_id;
        $locationMatch = $user->asset_location_id && $this->asset_location_id === $user->asset_location_id;

        if (! $user->department_id && ! $user->asset_location_id) {
            return true;
        }

        return $departmentMatch || $locationMatch;
    }

    public function bookValue(?Carbon $asOf = null): float
    {
        $asOf = $asOf ?: now();
        $cost = (float) ($this->cost ?? 0);
        $residual = (float) ($this->residual_value ?? 0);
        $lifeMonths = (int) ($this->useful_life_months ?? 0);

        if ($cost <= 0 || $lifeMonths <= 0 || ! $this->purchase_date) {
            return $cost;
        }

        $monthsUsed = max(0, $this->purchase_date->diffInMonths($asOf));
        $monthsUsed = min($monthsUsed, $lifeMonths);

        if ($this->depreciation_method === 'diminishing') {
            $rate = pow($residual / max($cost, 1), 1 / max($lifeMonths, 1));
            $value = $cost * pow($rate, $monthsUsed);

            return max($value, $residual);
        }

        if ($this->depreciation_method === 'double_declining') {
            $ratio = max(0, 1 - (2 / max($lifeMonths, 1)));
            $value = $cost * pow($ratio, $monthsUsed);

            return max($value, $residual);
        }

        if ($this->depreciation_method === 'syd') {
            // Sum-of-years-digits, implemented at month granularity:
            // weight(month k) = remaining_months / sum_{i=1..lifeMonths} i
            $sumDigits = ($lifeMonths * ($lifeMonths + 1)) / 2;
            $sumUsedWeights = ($monthsUsed * ((2 * $lifeMonths) - $monthsUsed + 1)) / 2;

            $depreciable = max(0, $cost - $residual);
            $depreciationUsed = $sumDigits > 0 ? ($depreciable * ($sumUsedWeights / $sumDigits)) : 0;
            $value = $cost - $depreciationUsed;

            return max($value, $residual);
        }

        if ($this->depreciation_method === 'units_of_production') {
            if ($this->book_value_cached !== null) {
                return max((float) $this->book_value_cached, $residual);
            }

            $totalEstimate = $this->production_units_total_estimate !== null ? (float) $this->production_units_total_estimate : null;
            if (! is_float($totalEstimate) || $totalEstimate <= 0) {
                return $cost;
            }

            $depreciable = max(0, $cost - $residual);
            if ($depreciable <= 0) {
                return $residual;
            }

            $unitsToDate = (float) DB::table('asset_usage_logs')
                ->where('asset_id', $this->id)
                ->whereDate('recorded_at', '<=', $asOf->toDateString())
                ->sum('units');

            $accumulated = min($depreciable, ($depreciable / $totalEstimate) * $unitsToDate);
            $value = $cost - $accumulated;

            return max($value, $residual);
        }

        $monthlyDep = ($cost - $residual) / $lifeMonths;
        $value = $cost - ($monthlyDep * $monthsUsed);

        return max($value, $residual);
    }
}
