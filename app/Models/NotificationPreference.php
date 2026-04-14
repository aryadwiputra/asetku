<?php

namespace App\Models;

use App\Models\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

class NotificationPreference extends Model
{
    use BelongsToOrganization;

    protected static function booted(): void
    {
        static::creating(function (NotificationPreference $preference): void {
            if ($preference->organization_id !== null) {
                return;
            }

            $organizationId = Auth::user()?->current_organization_id ?? Auth::user()?->organization_id;

            if ($organizationId !== null) {
                $preference->organization_id = (int) $organizationId;

                return;
            }

            if ($preference->user_id !== null) {
                $resolvedOrganizationId = User::query()
                    ->withoutGlobalScopes()
                    ->whereKey($preference->user_id)
                    ->value('current_organization_id');

                if ($resolvedOrganizationId === null) {
                    $resolvedOrganizationId = User::query()
                        ->withoutGlobalScopes()
                        ->whereKey($preference->user_id)
                        ->value('organization_id');
                }

                if ($resolvedOrganizationId !== null) {
                    $preference->organization_id = (int) $resolvedOrganizationId;
                }
            }
        });
    }

    /**
     * @var list<string>
     */
    protected $fillable = [
        'organization_id',
        'user_id',
        'type_key',
        'channels',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'channels' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
