<?php

use App\Models\Branch;
use App\Models\Organization;
use App\Models\User;
use App\Services\OrganizationContext;

test('branch can be created and listed within current organization', function () {
    $organization = Organization::factory()->create(['slug' => 'org-a']);
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $user = User::factory()->inOrganization($organization, role: 'Manager')->create([
        'current_organization_id' => $organization->id,
    ]);

    $this->actingAs($user)
        ->post(route('branches.store'), [
            'name' => 'Jakarta',
            'code' => 'JKT',
            'is_active' => 1,
            'latitude' => -6.2,
            'longitude' => 106.816666,
        ])
        ->assertRedirect();

    $branch = Branch::query()->where('code', 'JKT')->firstOrFail();

    $this->actingAs($user)
        ->get(route('branches.index'))
        ->assertSuccessful();

    $this->actingAs($user)
        ->get(route('branches.show', $branch))
        ->assertSuccessful();

    $this->actingAs($user)
        ->get(route('branches.edit', $branch))
        ->assertSuccessful();
});
