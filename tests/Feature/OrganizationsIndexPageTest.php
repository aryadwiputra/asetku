<?php

use App\Models\Organization;
use App\Models\User;
use App\Services\OrganizationContext;

test('organizations index page loads for a user with memberships', function () {
    $organization = Organization::factory()->create(['slug' => 'org-a']);
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $user = User::factory()->inOrganization($organization)->create([
        'current_organization_id' => $organization->id,
    ]);

    $this->actingAs($user)
        ->get(route('organizations.index'))
        ->assertSuccessful();
});

test('example', function () {
    $response = $this->get('/');

    $response->assertStatus(200);
});
