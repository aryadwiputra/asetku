<?php

namespace App\Models;

use App\Models\Concerns\BelongsToOrganization;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Asset extends Model
{
    use BelongsToOrganization, HasFactory, SoftDeletes;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'code',
        'name',
        'serial_number',
        'description',
        'asset_status_id',
        'asset_class_id',
        'asset_category_id',
        'unit_id',
        'department_id',
        'person_in_charge_id',
        'asset_user_id',
        'asset_location_id',
        'warranty_id',
        'purchase_date',
        'warranty_end',
        'warranty_reminder_sent_at',
        'cost',
        'depreciation_method',
        'useful_life_months',
        'residual_value',
        'capex_opex',
        'vendor_contract_id',
        'qr_token',
        'qr_path',
        'metadata',
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
            'cost' => 'decimal:2',
            'residual_value' => 'decimal:2',
            'metadata' => 'array',
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

    public function histories(): HasMany
    {
        return $this->hasMany(AssetHistory::class);
    }

    public function movements(): HasMany
    {
        return $this->hasMany(AssetMovement::class);
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

        if ($this->depreciation_method === 'diminishing') {
            $rate = pow($residual / max($cost, 1), 1 / max($lifeMonths, 1));
            $value = $cost * pow($rate, $monthsUsed);

            return max($value, $residual);
        }

        $monthlyDep = ($cost - $residual) / $lifeMonths;
        $value = $cost - ($monthlyDep * $monthsUsed);

        return max($value, $residual);
    }
}
