<?php

use App\Models\Branch;
use App\Models\Organization;
use App\Models\User;
use App\Services\OrganizationContext;

use function Pest\Laravel\actingAs;

test('member can view master data but cannot create', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);
    $member = User::factory()->inOrganization($organization, role: 'Member')->create();

    actingAs($member)->get(route('master-data.asset-statuses.index'))->assertOk();

    actingAs($member)->post(route('master-data.asset-statuses.store'), [
        'name' => 'Good',
        'code' => 'GOOD',
        'description' => null,
    ])->assertForbidden();
});

test('manager can manage master data', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);
    $manager = User::factory()->inOrganization($organization, role: 'Manager')->create();
    $branch = Branch::factory()->create(['organization_id' => $organization->id]);

    actingAs($manager)->post(route('master-data.departments.store'), [
        'branch_id' => $branch->id,
        'name' => 'General',
        'code' => 'GEN',
        'description' => null,
    ])->assertRedirect(route('master-data.departments.index'));
});
