<?php

namespace App\Models;

use App\Models\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VendorContractRenewal extends Model
{
    use BelongsToOrganization, HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'vendor_contract_id',
        'renewed_contract_id',
        'created_by',
        'previous_snapshot',
        'renewal_snapshot',
        'field_differences',
        'status',
        'activated_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'previous_snapshot' => 'array',
            'renewal_snapshot' => 'array',
            'field_differences' => 'array',
            'activated_at' => 'datetime',
        ];
    }

    public function vendorContract(): BelongsTo
    {
        return $this->belongsTo(VendorContract::class);
    }

    public function renewedContract(): BelongsTo
    {
        return $this->belongsTo(VendorContract::class, 'renewed_contract_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
