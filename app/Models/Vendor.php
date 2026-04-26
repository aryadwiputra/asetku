<?php

namespace App\Models;

use App\Models\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vendor extends Model
{
    use BelongsToOrganization, HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'tax_number',
        'email',
        'phone',
        'address',
        'service_category',
        'is_blacklisted',
        'blacklist_reason',
        'blacklisted_at',
        'notes',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_blacklisted' => 'boolean',
            'blacklisted_at' => 'datetime',
        ];
    }

    public function contracts(): HasMany
    {
        return $this->hasMany(VendorContract::class);
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
