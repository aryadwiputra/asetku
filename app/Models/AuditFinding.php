<?php

namespace App\Models;

use App\Models\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AuditFinding extends Model
{
    use BelongsToOrganization;

    protected $fillable = [
        'audit_schedule_id',
        'asset_id',
        'auditor_id',
        'current_location_id',
        'expected_location_id',
        'current_condition_id',
        'status',
        'notes',
        'signature_data',
        'audited_at',
        'approval_status',
        'approved_by',
        'approved_at',
        'approval_notes',
    ];

    protected function casts(): array
    {
        return [
            'audited_at' => 'datetime',
            'approved_at' => 'datetime',
        ];
    }

    public function auditSchedule(): BelongsTo
    {
        return $this->belongsTo(AuditSchedule::class);
    }

    public function asset(): BelongsTo
    {
        return $this->belongsTo(Asset::class);
    }

    public function auditor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'auditor_id');
    }

    public function currentLocation(): BelongsTo
    {
        return $this->belongsTo(AssetLocation::class, 'current_location_id');
    }

    public function expectedLocation(): BelongsTo
    {
        return $this->belongsTo(AssetLocation::class, 'expected_location_id');
    }

    public function currentCondition(): BelongsTo
    {
        return $this->belongsTo(AssetCondition::class, 'current_condition_id');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function photos(): HasMany
    {
        return $this->hasMany(AuditFindingPhoto::class)->orderBy('sort_order');
    }
}
