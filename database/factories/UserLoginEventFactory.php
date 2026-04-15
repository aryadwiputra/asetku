<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\UserLoginEvent;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends Factory<UserLoginEvent>
 */
class UserLoginEventFactory extends Factory
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
            'email' => fake()->safeEmail(),
            'event' => 'login_success',
            'auth_method' => 'password',
            'ip' => fake()->ipv4(),
            'user_agent' => fake()->userAgent(),
            'metadata' => null,
            'occurred_at' => Carbon::now(),
        ];
    }
}
