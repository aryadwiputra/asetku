<?php

use App\Models\Organization;
use App\Models\User;
use Illuminate\Support\Facades\DB;

test('user without memberships can access onboarding and create an organization', function () {
    $user = User::factory()->create([
        'organization_id' => null,
        'current_organization_id' => null,
    ]);

    $this->actingAs($user)
        ->get(route('organizations.onboarding.profile'))
        ->assertSuccessful();

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
