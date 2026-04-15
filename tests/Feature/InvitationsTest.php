<?php

use App\Models\Organization;
use App\Models\User;
use App\Models\UserInvitation;
use App\Notifications\OrganizationInvitationNotification;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;

beforeEach(function () {
    config(['cache.stores.redis.driver' => 'array']);
    $this->seed(RolePermissionSeeder::class);
});

test('authorized user can send an invitation', function () {
    Notification::fake();

    $organization = Organization::factory()->create();

    $admin = User::factory()
        ->inOrganization($organization, role: 'Owner')
        ->create(['current_organization_id' => $organization->id]);

    $admin->assignRole('admin');

    $this->actingAs($admin)
        ->post(route('invitations.store'), [
            'email' => 'invitee@example.com',
            'org_role' => 'Member',
        ])
        ->assertRedirect();

    expect(UserInvitation::query()->where('email', 'invitee@example.com')->exists())->toBeTrue();

    Notification::assertSentOnDemand(OrganizationInvitationNotification::class);
});

test('new user can accept an invitation', function () {
    $organization = Organization::factory()->create(['name' => 'Org A']);

    $token = Str::random(64);

    UserInvitation::factory()->create([
        'organization_id' => $organization->id,
        'email' => 'new-user@example.com',
        'org_role' => 'Member',
        'token_hash' => hash('sha256', $token),
    ]);

    $this->get(route('invites.show', ['token' => $token]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('email', 'new-user@example.com')
            ->where('isExistingUser', false)
            ->where('isAvailable', true)
        );

    $this->post(route('invites.accept', ['token' => $token]), [
        'name' => 'New User',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertRedirect(route('login'));

    $user = User::query()->where('email', 'new-user@example.com')->first();

    expect($user)->not->toBeNull();
    expect($user->organizations()->whereKey($organization->id)->exists())->toBeTrue();
});

test('existing user can accept an invitation without setting password', function () {
    $organization = Organization::factory()->create();
    $existing = User::factory()->create(['email' => 'existing@example.com']);

    $token = Str::random(64);

    UserInvitation::factory()->create([
        'organization_id' => $organization->id,
        'email' => 'existing@example.com',
        'org_role' => 'Manager',
        'token_hash' => hash('sha256', $token),
    ]);

    $this->post(route('invites.accept', ['token' => $token]), [])
        ->assertRedirect(route('login'));

    expect($existing->organizations()->whereKey($organization->id)->exists())->toBeTrue();
});

