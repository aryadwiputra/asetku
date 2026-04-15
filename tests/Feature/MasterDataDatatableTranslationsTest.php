<?php

use App\Models\Organization;
use App\Models\User;
use App\Services\OrganizationContext;

use function Pest\Laravel\actingAs;

test('master data pages include datatable translations', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $user = User::factory()->inOrganization($organization, role: 'Owner')->create();

    actingAs($user)
        ->get(route('master-data.asset-statuses.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('translations.datatable')
            ->has('translations.datatable.search')
            ->has('translations.datatable.rows_per_page')
        );
});
