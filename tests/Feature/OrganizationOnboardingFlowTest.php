<?php

use App\Models\Organization;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

test('non-admin cannot access onboarding create organization', function () {
    $user = User::factory()->create([
        'organization_id' => null,
        'current_organization_id' => null,
    ]);

    $this->actingAs($user)
        ->get(route('organizations.onboarding.profile'))
        ->assertForbidden();
});

test('admin can create an organization via onboarding and becomes owner', function () {
    Artisan::call('db:seed', ['--class' => RolePermissionSeeder::class]);

    $user = User::factory()->create([
        'organization_id' => null,
        'current_organization_id' => null,
    ]);
    $user->assignRole('admin');

    $this->actingAs($user)
        ->post(route('organizations.onboarding.profile.store'), [
            'organization_group_name' => 'PT Maju Bersama',
            'name' => 'PT Maju Teknologi',
            'slug' => 'maju-teknologi',
        ])
        ->assertRedirect(route('organizations.onboarding.plan'));

    $organization = Organization::query()->where('slug', 'maju-teknologi')->first();

    expect($organization)->not->toBeNull();

    $user->refresh();
    expect((int) $user->current_organization_id)->toBe((int) $organization->id);

    expect(DB::table('organization_user')->where([
        'organization_id' => $organization->id,
        'user_id' => $user->id,
        'is_active' => 1,
    ])->exists())->toBeTrue();
});
