<?php

use App\Models\Organization;
use App\Models\User;
use App\Services\OrganizationContext;

test('organization switcher props are shared to inertia pages', function () {
    $organization = Organization::factory()->create(['slug' => 'org-a']);

    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $user = User::factory()->inOrganization($organization, role: 'Owner')->create([
        'current_organization_id' => $organization->id,
    ]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('organization')
            ->has('organizations')
            ->has('organizations.0.role_label')
            ->has('orgRoleLabel')
            ->has('orgAbilities.organizations.create')
            ->has('moduleAbilities.assets.view')
            ->has('moduleAbilities.workOrders.viewIndex')
            ->has('moduleAbilities.maintenanceSchedules.view')
            ->has('moduleAbilities.reports.inventoryView')
        );
});
