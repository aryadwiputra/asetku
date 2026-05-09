<?php

namespace App\Models;

use App\Models\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AuditSchedule extends Model
{
    use BelongsToOrganization;

    protected $fillable = [
        'name',
        'description',
        'start_date',
        'end_date',
        'status',
        'created_by',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function auditors(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'audit_schedule_auditors')
            ->using(AuditScheduleAuditor::class)
            ->withTimestamps();
    }

    public function assets(): BelongsToMany
    {
        return $this->belongsToMany(Asset::class, 'audit_schedule_assets')
            ->using(AuditScheduleAsset::class)
            ->withPivot(['status', 'completed_at', 'completed_by'])
            ->withTimestamps();
    }

    public function findings(): HasMany
    {
        return $this->hasMany(AuditFinding::class);
    }

    public function scopeForUser(Builder $query, User $user): Builder
    {
        if ($user->can('audit.view_all')) {
            return $query;
        }

        $organizationId = $user->current_organization_id;
        if ($organizationId === null) {
            return $query->whereRaw('1 = 0');
        }

        return $query->where(function ($q) use ($user) {
            $q->where('created_by', $user->id)
                ->orWhereHas('auditors', fn ($q) => $q->where('user_id', $user->id));
        });
    }
}
