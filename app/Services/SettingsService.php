<?php

namespace App\Services;

use App\Models\Organization;
use App\Models\Setting;
use Illuminate\Contracts\Cache\Repository as CacheRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Crypt;
use Throwable;

class SettingsService
{
    private const CACHE_TTL_SECONDS = 3600;

    /**
     * Get a setting value.
     */
    public function get(string $key, mixed $default = null): mixed
    {
        $this->ensureOrganizationContext();

        $all = $this->getAllCached();

        if (array_key_exists($key, $all)) {
            return $all[$key];
        }

        return $default;
    }

    /**
     * Set a setting value.
     */
    public function set(string $key, mixed $value, string $type = 'string', bool $encrypted = false): void
    {
        $this->ensureOrganizationContext();

        $prepared = $this->prepareForStorage($value, $type, $encrypted);

        if ($prepared['value'] === null) {
            Setting::query()->where('key', $key)->delete();
            $this->forgetCache();

            return;
        }

        Setting::query()->updateOrCreate(
            ['key' => $key],
            [
                'value' => $prepared['value'],
                'type' => $prepared['type'],
                'is_encrypted' => $prepared['is_encrypted'],
            ],
        );

        $this->forgetCache();
    }

    /**
     * Forget cached settings.
     */
    public function forgetCache(): void
    {
        try {
            $this->cache()->forget($this->cacheKey());
        } catch (Throwable) {
            // If Redis is down, we still want the app to function using DB reads.
        }
    }

    /**
     * Get all settings as a flat key => value array (decrypted and cast).
     *
     * @return array<string, mixed>
     */
    public function all(): array
    {
        $this->ensureOrganizationContext();

        return $this->getAllCached();
    }

    /**
     * @return array<string, mixed>
     */
    private function getAllCached(): array
    {
        try {
            return $this->cache()->remember($this->cacheKey(), self::CACHE_TTL_SECONDS, function (): array {
                return $this->loadAllFromDatabase();
            });
        } catch (Throwable) {
            return $this->loadAllFromDatabase();
        }
    }

    private function cacheKey(): string
    {
        $organizationId = app(OrganizationContext::class)->currentOrganizationId();

        return 'settings:all:'.($organizationId === null ? 'global' : (string) $organizationId);
    }

    private function ensureOrganizationContext(): void
    {
        $context = app(OrganizationContext::class);

        if ($context->currentOrganizationId() !== null) {
            return;
        }

        $user = Auth::user();

        $userOrganizationId = $user?->current_organization_id ?? $user?->organization_id;

        if ($userOrganizationId !== null) {
            $context->setCurrentOrganizationId((int) $userOrganizationId);

            return;
        }

        if ($user !== null) {
            $membership = $user->organizations()
                ->wherePivot('is_active', true)
                ->orderBy('organization_user.created_at')
                ->first();

            if ($membership !== null) {
                $context->setCurrentOrganizationId((int) $membership->id);

                return;
            }
        }

        if (Organization::query()->count() !== 1) {
            return;
        }

        $organizationId = Organization::query()->value('id');

        if ($organizationId === null) {
            return;
        }

        $context->setCurrentOrganizationId((int) $organizationId);
    }

    /**
     * @return array<string, mixed>
     */
    private function loadAllFromDatabase(): array
    {
        return Setting::query()
            ->get(['key', 'value', 'type', 'is_encrypted'])
            ->mapWithKeys(function (Setting $setting): array {
                return [
                    $setting->key => $this->castFromStorage(
                        value: $setting->value,
                        type: $setting->type,
                        encrypted: $setting->is_encrypted,
                    ),
                ];
            })
            ->all();
    }

    private function cache(): CacheRepository
    {
        return Cache::store('redis');
    }

    /**
     * @return array{value: string|null, type: string, is_encrypted: bool}
     */
    private function prepareForStorage(mixed $value, string $type, bool $encrypted): array
    {
        $normalizedType = match ($type) {
            'bool', 'boolean' => 'bool',
            'int', 'integer' => 'int',
            'json', 'array' => 'json',
            default => 'string',
        };

        if ($normalizedType === 'string' && is_string($value)) {
            $value = trim($value);

            if ($value === '') {
                $value = null;
            }
        }

        $stringValue = match ($normalizedType) {
            'bool' => $value === null ? null : ((bool) $value ? '1' : '0'),
            'int' => $value === null ? null : (string) ((int) $value),
            'json' => $value === null ? null : json_encode($value, JSON_THROW_ON_ERROR),
            default => $value === null ? null : (string) $value,
        };

        if ($encrypted && $stringValue !== null) {
            $stringValue = Crypt::encryptString($stringValue);
        }

        return [
            'value' => $stringValue,
            'type' => $normalizedType,
            'is_encrypted' => $encrypted,
        ];
    }

    private function castFromStorage(?string $value, string $type, bool $encrypted): mixed
    {
        if ($value === null) {
            return null;
        }

        $raw = $encrypted ? Crypt::decryptString($value) : $value;

        return match ($type) {
            'bool' => $raw === '1' || strtolower($raw) === 'true',
            'int' => (int) $raw,
            'json' => json_decode($raw, true, flags: JSON_THROW_ON_ERROR),
            default => $raw,
        };
    }
}
