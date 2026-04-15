<?php

use App\Models\Organization;
use App\Models\User;
use App\Models\UserDelegation;
use Database\Seeders\RolePermissionSeeder;
use Spatie\Activitylog\Models\Activity;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

test('delegation can be created approved started and stopped', function () {
    $organization = Organization::factory()->create();

    $admin = User::factory()->inOrganization($organization, 'Admin')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);
    $admin->assignRole('admin');

    $delegator = User::factory()->inOrganization($organization, 'Member')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $delegatee = User::factory()->inOrganization($organization, 'Member')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $this->actingAs($admin)
        ->post(route('delegations.store'), [
            'delegator_user_id' => $delegator->id,
            'delegatee_user_id' => $delegatee->id,
            'starts_at' => now()->subMinute()->toDateTimeString(),
            'ends_at' => now()->addHour()->toDateTimeString(),
            'reason' => 'Vacation',
        ])
        ->assertRedirect();

    $delegation = UserDelegation::query()->withoutGlobalScopes()->firstOrFail();

    expect($delegation->status)->toBe('pending');

    $this->actingAs($admin)
        ->post(route('delegations.approve', $delegation))
        ->assertRedirect();

    $delegation->refresh();
    expect($delegation->status)->toBe('active');

    $this->actingAs($delegatee)
        ->post(route('delegations.start', $delegation))
        ->assertRedirect(route('dashboard'));

    $this->assertAuthenticatedAs($delegator);

    $activity = Activity::query()
        ->where('description', 'Delegation started')
        ->latest()
        ->firstOrFail();

    expect($activity->subject_type)->toBe(UserDelegation::class)
        ->and((int) $activity->subject_id)->toBe((int) $delegation->id)
        ->and((int) $activity->causer_id)->toBe((int) $delegatee->id)
        ->and(data_get($activity->properties->toArray(), 'acting_as.user_id'))->toBe((int) $delegator->id);

    $this->post(route('delegations.stop'))
        ->assertRedirect(route('dashboard'));

    $this->assertAuthenticatedAs($delegatee);
});
