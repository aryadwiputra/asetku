<?php

namespace Database\Factories;

use App\Models\Organization;
use App\Models\User;
use App\Models\UserDelegation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<UserDelegation>
 */
class UserDelegationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'organization_id' => Organization::factory(),
            'delegator_user_id' => User::factory(),
            'delegatee_user_id' => User::factory(),
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDay(),
            'status' => 'pending',
            'reason' => fake()->sentence(),
            'created_by' => User::factory(),
            'approved_by' => null,
            'revoked_at' => null,
        ];
    }
}
