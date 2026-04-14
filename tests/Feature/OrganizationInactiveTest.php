<?php

use App\Models\Organization;
use App\Models\User;
use App\Services\OrganizationContext;

test('inactive organization blocks scoped routes', function () {
    $organization = Organization::factory()->create([
        'slug' => 'org-a',
        'is_active' => false,
        'deactivated_at' => now(),
    ]);

    $user = User::factory()->inOrganization($organization, role: 'Owner')->create([
        'current_organization_id' => $organization->id,
    ]);

    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $this->actingAs($user)
        ->get(route('branches.index'))
        ->assertRedirect(route('organizations.index'));
});
