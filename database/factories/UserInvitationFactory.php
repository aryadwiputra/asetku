<?php

namespace Database\Factories;

use App\Models\Organization;
use App\Models\User;
use App\Models\UserInvitation;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @extends Factory<UserInvitation>
 */
class UserInvitationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $token = Str::random(64);

        return [
            'organization_id' => Organization::factory(),
            'email' => fake()->unique()->safeEmail(),
            'org_role' => 'Member',
            'token_hash' => hash('sha256', $token),
            'expires_at' => Carbon::now()->addHours(48),
            'accepted_at' => null,
            'revoked_at' => null,
            'invited_by' => User::factory(),
        ];
    }
}
