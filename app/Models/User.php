<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\OrganizationMemberRole;
use App\Models\Traits\HasOrganizationRolePermissions;
use App\Services\OrganizationContext;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Permission\Traits\HasRoles;

#[Fillable(['name', 'email', 'phone_number', 'password', 'avatar_path', 'is_active', 'locale', 'organization_id', 'current_organization_id', 'department_id', 'asset_location_id', 'last_active_at'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, HasOrganizationRolePermissions, HasRoles, LogsActivity, Notifiable, SoftDeletes, TwoFactorAuthenticatable {
        HasOrganizationRolePermissions::checkPermissionTo insteadof HasRoles;
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'phone_verified_at' => 'datetime',
            'last_two_factor_sms_sent_at' => 'datetime',
            'is_active' => 'boolean',
            'last_active_at' => 'datetime',
        ];
    }

    public function notifications(): MorphMany
    {
        $context = app(OrganizationContext::class);

        if ($context->currentOrganizationId() === null) {
            $fallbackOrganizationId = $this->current_organization_id ?? $this->organization_id;

            if ($fallbackOrganizationId !== null) {
                $context->setCurrentOrganizationId((int) $fallbackOrganizationId);
            }
        }

        return $this->morphMany(DatabaseNotification::class, 'notifiable')->latest();
    }

    public function readNotifications(): MorphMany
    {
        return $this->notifications()->read();
    }

    public function unreadNotifications(): MorphMany
    {
        return $this->notifications()->unread();
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function currentOrganization(): BelongsTo
    {
        return $this->belongsTo(Organization::class, 'current_organization_id');
    }

    /**
     * @return BelongsToMany<Organization, $this>
     */
    public function organizations(): BelongsToMany
    {
        return $this->belongsToMany(Organization::class)
            ->withPivot(['role', 'is_active'])
            ->withTimestamps();
    }

    /**
     * @return HasMany<UserIdentity, $this>
     */
    public function identities(): HasMany
    {
        return $this->hasMany(UserIdentity::class);
    }

    public function currentOrganizationRole(): ?string
    {
        $organizationId = $this->current_organization_id ?? $this->organization_id;

        if ($organizationId === null) {
            return null;
        }

        return $this->organizationRole((int) $organizationId);
    }

    public function organizationRole(int $organizationId): ?string
    {
        return $this->organizations()
            ->wherePivot('is_active', true)
            ->whereKey($organizationId)
            ->value('organization_user.role');
    }

    /**
     * @param  array<int, OrganizationMemberRole|string>  $roles
     */
    public function hasOrganizationRole(int $organizationId, array $roles): bool
    {
        $allowed = array_map(function (OrganizationMemberRole|string $role): string {
            return $role instanceof OrganizationMemberRole ? $role->value : (string) $role;
        }, $roles);

        return $this->organizations()
            ->wherePivot('is_active', true)
            ->whereKey($organizationId)
            ->whereIn('organization_user.role', $allowed)
            ->exists();
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function assetLocation(): BelongsTo
    {
        return $this->belongsTo(AssetLocation::class, 'asset_location_id');
    }

    /**
     * Get the activity log options for this model.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'email', 'is_active'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    /**
     * Get the user's column preferences.
     *
     * @return HasMany<UserColumnPreference, $this>
     */
    public function columnPreferences(): HasMany
    {
        return $this->hasMany(UserColumnPreference::class);
    }

    public function technicianProfile(): HasOne
    {
        return $this->hasOne(TechnicianProfile::class);
    }
}
