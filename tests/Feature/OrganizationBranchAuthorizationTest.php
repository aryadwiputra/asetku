<?php

use App\Models\Branch;
use App\Models\Organization;
use App\Models\User;
use App\Services\OrganizationContext;

test('member cannot create branches', function () {
    $organization = Organization::factory()->create(['slug' => 'org-a']);
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $user = User::factory()->inOrganization($organization, role: 'Member')->create([
        'current_organization_id' => $organization->id,
    ]);

    $this->actingAs($user)
        ->post(route('branches.store'), [
            'name' => 'Jakarta',
            'code' => 'JKT',
        ])
        ->assertForbidden();

    expect(Branch::query()->where('code', 'JKT')->exists())->toBeFalse();
});

test('manager can create and deactivate branches', function () {
    $organization = Organization::factory()->create(['slug' => 'org-a']);
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $user = User::factory()->inOrganization($organization, role: 'Manager')->create([
        'current_organization_id' => $organization->id,
    ]);

    $this->actingAs($user)
        ->post(route('branches.store'), [
            'name' => 'Jakarta',
            'code' => 'JKT',
        ])
        ->assertRedirect();

    $branch = Branch::query()->where('code', 'JKT')->firstOrFail();

    $this->actingAs($user)
        ->delete(route('branches.destroy', $branch))
        ->assertRedirect(route('branches.index'));

    $branch->refresh();
    expect($branch->is_active)->toBeFalse();
});

test('manager cannot edit organization', function () {
    $organization = Organization::factory()->create(['slug' => 'org-a']);
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $user = User::factory()->inOrganization($organization, role: 'Manager')->create([
        'current_organization_id' => $organization->id,
    ]);

    $this->actingAs($user)
        ->get(route('organizations.edit', $organization))
        ->assertForbidden();
});
