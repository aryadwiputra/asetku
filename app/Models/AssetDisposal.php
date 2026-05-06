<?php

namespace App\Models;

use App\Models\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class AssetDisposal extends Model
{
    use BelongsToOrganization, HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'asset_id',
        'type',
        'reason',
        'notes',
        'currency_code',
        'proceeds_amount',
        'fees_amount',
        'fair_value_amount',
        'net_proceeds_amount',
        'book_value_at_disposal',
        'gain_loss_amount',
        'disposed_by',
        'disposed_at',
        'executed_at',
        'previous_status_id',
        'previous_location_id',
        'previous_department_id',
        'reversed_at',
        'reversed_by',
        'reversed_notes',
        'status',
        'requested_by',
        'approved_by',
        'approved_at',
        'rejected_by',
        'rejected_at',
        'decision_notes',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'disposed_at' => 'datetime',
            'executed_at' => 'datetime',
            'reversed_at' => 'datetime',
            'approved_at' => 'datetime',
            'rejected_at' => 'datetime',
            'proceeds_amount' => 'decimal:2',
            'fees_amount' => 'decimal:2',
            'fair_value_amount' => 'decimal:2',
            'net_proceeds_amount' => 'decimal:2',
            'book_value_at_disposal' => 'decimal:2',
            'gain_loss_amount' => 'decimal:2',
        ];
    }

    public function asset(): BelongsTo
    {
        return $this->belongsTo(Asset::class);
    }

    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function rejector(): BelongsTo
    {
        return $this->belongsTo(User::class, 'rejected_by');
    }

    public function previousStatus(): BelongsTo
    {
        return $this->belongsTo(AssetStatus::class, 'previous_status_id');
    }

    public function previousLocation(): BelongsTo
    {
        return $this->belongsTo(AssetLocation::class, 'previous_location_id');
    }

    public function previousDepartment(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'previous_department_id');
    }

    public function approval(): MorphOne
    {
        return $this->morphOne(AssetApprovalRequest::class, 'approvable');
    }
}
