<?php

namespace Database\Factories;

use App\Models\Organization;
use App\Models\User;
use App\Services\OrganizationContext;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    public function configure(): static
    {
        return $this->afterCreating(function (User $user): void {
            $organizationId = $user->current_organization_id ?? $user->organization_id;

            if ($organizationId === null) {
                $organization = Organization::factory()->create();

                $organizationId = $organization->id;

                $user->forceFill([
                    'current_organization_id' => $organizationId,
                    'organization_id' => $user->organization_id ?? $organizationId,
                ])->saveQuietly();
            }

            $alreadyAttached = $user->organizations()->whereKey($organizationId)->exists();

            if ($alreadyAttached) {
                return;
            }

            $user->organizations()->attach($organizationId, [
                'role' => 'Member',
                'is_active' => true,
            ]);
        });
    }

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $organizationId = app(OrganizationContext::class)->currentOrganizationId();

        return [
            'organization_id' => $organizationId,
            'current_organization_id' => $organizationId,
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'locale' => null,
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at' => null,
            'avatar_path' => null,
            'is_active' => true,
        ];
    }

    public function inOrganization(?Organization $organization = null, string $role = 'Member', bool $active = true): static
    {
        return $this->afterCreating(function (User $user) use ($organization, $role, $active): void {
            $resolvedOrganization = $organization ?? Organization::factory()->create();

            $user->organizations()->syncWithoutDetaching([
                $resolvedOrganization->id => [
                    'role' => $role,
                    'is_active' => $active,
                ],
            ]);

            if ($user->current_organization_id === null) {
                $user->forceFill([
                    'current_organization_id' => $resolvedOrganization->id,
                    'organization_id' => $user->organization_id ?? $resolvedOrganization->id,
                ])->saveQuietly();
            }
        });
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Indicate that the model has two-factor authentication configured.
     */
    public function withTwoFactor(): static
    {
        return $this->state(fn (array $attributes) => [
            'two_factor_secret' => encrypt('secret'),
            'two_factor_recovery_codes' => encrypt(json_encode(['recovery-code-1'])),
            'two_factor_confirmed_at' => now(),
        ]);
    }

    /**
     * Indicate that the user is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
