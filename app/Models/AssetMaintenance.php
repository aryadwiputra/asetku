<?php

namespace App\Models;

use App\Enums\OrganizationMemberRole;
use App\Models\Concerns\BelongsToOrganization;
use App\Services\WorkOrderNumberGenerator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class AssetMaintenance extends Model
{
    use BelongsToOrganization, HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'work_order_number',
        'asset_id',
        'asset_status_before_maintenance_id',
        'type',
        'source',
        'priority',
        'branch_id',
        'assigned_to',
        'assigned_at',
        'acknowledged_at',
        'started_at',
        'completed_at',
        'cancelled_at',
        'progress_percent',
        'vendor_id',
        'vendor_contract_id',
        'schedule_id',
        'checklist_template_id',
        'performed_at',
        'description',
        'vendor',
        'cost',
        'status',
        'notes',
        'internal_notes',
        'requested_by',
        'approved_by',
        'approved_at',
        'rejected_by',
        'rejected_at',
        'decision_notes',
        'sla_response_hours',
        'sla_resolution_hours',
        'response_due_at',
        'resolution_due_at',
        'escalation_level',
        'last_escalated_at',
        'escalated_at',
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
            'assigned_at' => 'datetime',
            'acknowledged_at' => 'datetime',
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
            'cancelled_at' => 'datetime',
            'progress_percent' => 'integer',
            'approved_at' => 'datetime',
            'rejected_at' => 'datetime',
            'sla_response_hours' => 'integer',
            'sla_resolution_hours' => 'integer',
            'response_due_at' => 'datetime',
            'resolution_due_at' => 'datetime',
            'escalation_level' => 'integer',
            'last_escalated_at' => 'datetime',
            'escalated_at' => 'datetime',
            'speed_rating' => 'integer',
            'quality_rating' => 'integer',
            'price_rating' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (self $maintenance): void {
            if (
                $maintenance->work_order_number !== null
                || $maintenance->organization_id === null
            ) {
                return;
            }

            $timestamp = $maintenance->created_at ?? now();

            $maintenance->work_order_number = app(WorkOrderNumberGenerator::class)
                ->generate((int) $maintenance->organization_id, $timestamp);
        });
    }

    public function asset(): BelongsTo
    {
        return $this->belongsTo(Asset::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function statusBeforeMaintenance(): BelongsTo
    {
        return $this->belongsTo(AssetStatus::class, 'asset_status_before_maintenance_id');
    }

    public function technician(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    public function vendorContract(): BelongsTo
    {
        return $this->belongsTo(VendorContract::class);
    }

    public function schedule(): BelongsTo
    {
        return $this->belongsTo(MaintenanceSchedule::class, 'schedule_id');
    }

    public function checklistTemplate(): BelongsTo
    {
        return $this->belongsTo(MaintenanceChecklistTemplate::class, 'checklist_template_id');
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(AssetMaintenanceTask::class, 'maintenance_id')->orderBy('sort_order');
    }

    public function costLines(): HasMany
    {
        return $this->hasMany(AssetMaintenanceCostLine::class, 'maintenance_id');
    }

    public function media(): HasMany
    {
        return $this->hasMany(AssetMaintenanceMedia::class, 'maintenance_id')->orderBy('sort_order');
    }

    public function approval(): MorphOne
    {
        return $this->morphOne(AssetApprovalRequest::class, 'approvable');
    }

    public function scopeVisibleTo(Builder $query, ?User $user): Builder
    {
        if ($user === null) {
            return $query->whereRaw('1 = 0');
        }

        if ($this->canViewAllForUser($user)) {
            return $query;
        }

        return $query->where(function (Builder $visibleQuery) use ($user): void {
            $visibleQuery
                ->where('assigned_to', $user->id)
                ->orWhereHas('asset', fn (Builder $assetQuery) => $assetQuery->forUser($user));
        });
    }

    public function isVisibleTo(?User $user): bool
    {
        if ($user === null) {
            return false;
        }

        if ($this->canViewAllForUser($user)) {
            return true;
        }

        if ($this->assigned_to !== null && (int) $this->assigned_to === (int) $user->id) {
            return true;
        }

        return $this->asset?->isVisibleTo($user) ?? false;
    }

    private function canViewAllForUser(User $user): bool
    {
        if ($user->can('work_order.view_all')) {
            return true;
        }

        $organizationId = $user->current_organization_id;

        if ($organizationId === null) {
            return false;
        }

        return $user->hasOrganizationRole((int) $organizationId, [
            OrganizationMemberRole::Owner,
            OrganizationMemberRole::Admin,
            OrganizationMemberRole::Manager,
        ]);
    }
}
