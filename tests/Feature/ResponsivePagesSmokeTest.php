<?php

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;

beforeEach(function () {
    config(['cache.stores.redis.driver' => 'array']);
    $this->seed(RolePermissionSeeder::class);
});

test('authenticated pages load on mobile-friendly layout', function () {
    $user = User::factory()->create();
    $user->assignRole('super-admin');

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk();

    $this->get(route('organizations.index'))->assertSuccessful();
    $this->get(route('branches.index'))->assertSuccessful();
    $this->get(route('users.index'))->assertSuccessful();
    $this->get(route('roles.index'))->assertSuccessful();
    $this->get(route('settings.index'))->assertSuccessful();
    $this->get(route('notifications.index'))->assertSuccessful();
    $this->get(route('profile.edit'))->assertSuccessful();
});

