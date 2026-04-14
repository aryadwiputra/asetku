<?php

use App\Models\Organization;
use App\Models\User;

test('user can switch current organization when they are a member', function () {
    $organizationA = Organization::factory()->create(['slug' => 'org-a']);
    $organizationB = Organization::factory()->create(['slug' => 'org-b']);

    $user = User::factory()->inOrganization($organizationA)->create([
        'current_organization_id' => $organizationA->id,
    ]);

    $user->organizations()->attach($organizationB->id, [
        'role' => 'Member',
        'is_active' => true,
    ]);

    $this->actingAs($user)
        ->post(route('organizations.switch', $organizationB))
        ->assertRedirect();

    $user->refresh();
    expect((int) $user->current_organization_id)->toBe($organizationB->id);
});

test('switching is forbidden when user is not a member', function () {
    $organizationA = Organization::factory()->create(['slug' => 'org-a']);
    $organizationC = Organization::factory()->create(['slug' => 'org-c']);

    $user = User::factory()->inOrganization($organizationA)->create([
        'current_organization_id' => $organizationA->id,
    ]);

    $this->actingAs($user)
        ->post(route('organizations.switch', $organizationC))
        ->assertForbidden();
});
