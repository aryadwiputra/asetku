<?php

namespace App\Models;

use App\Models\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VendorContract extends Model
{
    use BelongsToOrganization, HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'vendor_id',
        'vendor_name',
        'type',
        'title',
        'contract_number',
        'status',
        'baseline_cost',
        'start_date',
        'end_date',
        'expiry_reminder_sent_at',
        'sla_response_hours',
        'sla_resolution_hours',
        'notes',
        'terms',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'baseline_cost' => 'decimal:2',
            'expiry_reminder_sent_at' => 'datetime',
        ];
    }

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    public function assets(): BelongsToMany
    {
        return $this->belongsToMany(Asset::class, 'asset_vendor_contract')
            ->withPivot(['is_primary'])
            ->withTimestamps();
    }

    public function primaryAssets(): HasMany
    {
        return $this->hasMany(Asset::class);
    }

    public function renewals(): HasMany
    {
        return $this->hasMany(VendorContractRenewal::class);
    }

    public function maintenanceRecords(): HasMany
    {
        return $this->hasMany(AssetMaintenance::class);
    }

    public function warrantyClaims(): HasMany
    {
        return $this->hasMany(AssetWarrantyClaim::class);
    }
}
