<?php

use App\Http\Middleware\SetCurrentOrganization;
use App\Models\Branch;
use App\Models\Organization;
use App\Models\User;
use App\Services\OrganizationContext;
use Database\Seeders\RolePermissionSeeder;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

test('branch show and edit routes resolve for current organization', function () {
    $organization = Organization::factory()->create();

    $user = User::factory()->inOrganization($organization, 'Admin')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
        'password' => bcrypt('password'),
    ]);

    $branch = Branch::factory()->create([
        'organization_id' => $organization->id,
    ]);

    $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ])->assertRedirect();

    $this->get(route('branches.show', $branch))->assertOk();
    $this->get(route('branches.edit', $branch))->assertOk();
});

test('branch show and edit do not 404 when organization context is missing', function () {
    $organization = Organization::factory()->create();

    $user = User::factory()->inOrganization($organization, 'Admin')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $branch = Branch::factory()->create([
        'organization_id' => $organization->id,
    ]);

    app(OrganizationContext::class)->setCurrentOrganizationId(null);

    $this->withoutMiddleware(SetCurrentOrganization::class)
        ->actingAs($user)
        ->get(route('branches.show', $branch))
        ->assertOk();

    $this->withoutMiddleware(SetCurrentOrganization::class)
        ->actingAs($user)
        ->get(route('branches.edit', $branch))
        ->assertOk();
});

test('example', function () {
    $response = $this->get('/');

    $response->assertOk();
});
