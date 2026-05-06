<?php

namespace App\Models;

use App\Enums\OrganizationMemberRole;
use App\Models\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MaintenanceSchedule extends Model
{
    use BelongsToOrganization;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'asset_id',
        'name',
        'interval_days',
        'next_due_at',
        'default_priority',
        'default_sla_response_hours',
        'default_sla_resolution_hours',
        'checklist_template_id',
        'required_skill',
        'assigned_to',
        'notes',
        'is_active',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'interval_days' => 'integer',
            'next_due_at' => 'date',
            'default_sla_response_hours' => 'integer',
            'default_sla_resolution_hours' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function asset(): BelongsTo
    {
        return $this->belongsTo(Asset::class);
    }

    public function checklistTemplate(): BelongsTo
    {
        return $this->belongsTo(MaintenanceChecklistTemplate::class, 'checklist_template_id');
    }

    public function technician(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function scopeVisibleTo(Builder $query, ?User $user): Builder
    {
        if ($user === null) {
            return $query->whereRaw('1 = 0');
        }

        if ($this->canViewAllForUser($user)) {
            return $query;
        }

        return $query->whereHas('asset', fn (Builder $assetQuery) => $assetQuery->forUser($user));
    }

    public function isVisibleTo(?User $user): bool
    {
        if ($user === null) {
            return false;
        }

        if ($this->canViewAllForUser($user)) {
            return true;
        }

        return $this->asset?->isVisibleTo($user) ?? false;
    }

    private function canViewAllForUser(User $user): bool
    {
        if ($user->can('maintenance_schedule.view_all')) {
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
