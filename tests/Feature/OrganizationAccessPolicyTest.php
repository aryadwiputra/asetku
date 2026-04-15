<?php

use App\Models\Organization;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Support\Facades\Hash;

beforeEach(function () {
    config(['cache.stores.redis.driver' => 'array']);
    $this->seed(RolePermissionSeeder::class);
});

test('login is blocked when organization access policy denies the request', function () {
    $organization = Organization::factory()->create([
        'access_ip_allowlist' => ['203.0.113.10'],
        'access_working_hours' => null,
    ]);

    $user = User::factory()
        ->inOrganization($organization)
        ->create([
            'password' => Hash::make('secret-password'),
            'current_organization_id' => $organization->id,
        ]);

    $this->post(route('login'), [
        'email' => $user->email,
        'password' => 'secret-password',
    ])->assertSessionHasErrors('email');
});

test('authenticated requests are blocked when organization access policy denies the request', function () {
    $organization = Organization::factory()->create([
        'access_ip_allowlist' => ['203.0.113.10'],
        'access_working_hours' => null,
    ]);

    $user = User::factory()
        ->inOrganization($organization)
        ->create([
            'current_organization_id' => $organization->id,
        ]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertRedirect(route('login'));
});

