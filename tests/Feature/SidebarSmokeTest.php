<?php

use App\Models\Organization;
use App\Models\User;
use App\Services\OrganizationContext;
use Database\Seeders\RolePermissionSeeder;
use Inertia\Testing\AssertableInertia as Assert;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

test('dashboard includes common sidebar translations', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $user = User::factory()->inOrganization($organization, role: 'Owner')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('organization')
            ->has('organizations')
            ->where('orgRoleLabel', 'Owner')
            ->has('moduleAbilities.assets')
            ->has('translations.common.workspace')
            ->has('translations.common.organizations')
            ->has('translations.common.branches')
            ->has('translations.common.administration')
            ->has('translations.common.new_asset')
        );
});
