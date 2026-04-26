<?php

namespace App\Models;

use App\Models\Concerns\BelongsToOrganization;
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
}
