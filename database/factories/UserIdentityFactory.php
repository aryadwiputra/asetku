<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\UserIdentity;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<UserIdentity>
 */
class UserIdentityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'provider' => 'google',
            'provider_user_id' => (string) fake()->randomNumber(9),
            'email' => fake()->safeEmail(),
        ];
    }
}
