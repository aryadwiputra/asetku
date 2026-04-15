<?php

use App\Models\User;
use App\Models\UserLoginEvent;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Support\Facades\Hash;

beforeEach(function () {
    config(['cache.stores.redis.driver' => 'array']);
    $this->seed(RolePermissionSeeder::class);
});

test('login and logout create login history events', function () {
    $user = User::factory()->create([
        'password' => Hash::make('secret-password'),
    ]);

    $this->post(route('login'), [
        'email' => $user->email,
        'password' => 'secret-password',
    ])->assertRedirect(route('dashboard'));

    expect(UserLoginEvent::query()->where('user_id', $user->id)->where('event', 'login_success')->exists())->toBeTrue();

    $this->post(route('logout'))->assertRedirect('/');

    expect(UserLoginEvent::query()->where('user_id', $user->id)->where('event', 'logout')->exists())->toBeTrue();
});

