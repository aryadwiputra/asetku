<?php

namespace App\Models;

use App\Models\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class AssetMaintenance extends Model
{
    use BelongsToOrganization, HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'asset_id',
        'vendor_id',
        'vendor_contract_id',
        'performed_at',
        'description',
        'vendor',
        'cost',
        'status',
        'notes',
        'requested_by',
        'approved_by',
        'approved_at',
        'rejected_by',
        'rejected_at',
        'decision_notes',
        'sla_response_hours',
        'sla_resolution_hours',
        'speed_rating',
        'quality_rating',
        'price_rating',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'performed_at' => 'datetime',
            'cost' => 'decimal:2',
            'approved_at' => 'datetime',
            'rejected_at' => 'datetime',
            'sla_response_hours' => 'integer',
            'sla_resolution_hours' => 'integer',
            'speed_rating' => 'integer',
            'quality_rating' => 'integer',
            'price_rating' => 'integer',
        ];
    }

    public function asset(): BelongsTo
    {
        return $this->belongsTo(Asset::class);
    }

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    public function vendorContract(): BelongsTo
    {
        return $this->belongsTo(VendorContract::class);
    }

    public function approval(): MorphOne
    {
        return $this->morphOne(AssetApprovalRequest::class, 'approvable');
    }
}
