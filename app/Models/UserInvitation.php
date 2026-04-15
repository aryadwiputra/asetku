<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

class UserInvitation extends Model
{
    /** @use HasFactory<\Database\Factories\UserInvitationFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'organization_id',
        'email',
        'org_role',
        'token_hash',
        'expires_at',
        'accepted_at',
        'revoked_at',
        'invited_by',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'accepted_at' => 'datetime',
            'revoked_at' => 'datetime',
        ];
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function inviter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'invited_by');
    }

    /**
     * @return Attribute<bool, never>
     */
    protected function isExpired(): Attribute
    {
        return Attribute::get(function (): bool {
            /** @var Carbon|null $expiresAt */
            $expiresAt = $this->expires_at;

            return $expiresAt === null || $expiresAt->isPast();
        });
    }
}
