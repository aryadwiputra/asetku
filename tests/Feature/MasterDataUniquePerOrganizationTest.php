<?php

use App\Models\Organization;
use App\Models\User;
use App\Services\OrganizationContext;

use function Pest\Laravel\actingAs;

test('master data code uniqueness is scoped per organization', function () {
    $orgA = Organization::factory()->create();
    $orgB = Organization::factory()->create();

    app(OrganizationContext::class)->setCurrentOrganizationId($orgA->id);
    $ownerA = User::factory()->inOrganization($orgA, role: 'Owner')->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($orgB->id);
    $ownerB = User::factory()->inOrganization($orgB, role: 'Owner')->create();

    actingAs($ownerA)->post(route('master-data.asset-statuses.store'), [
        'name' => 'Good',
        'code' => 'DUP',
        'description' => null,
    ])->assertRedirect(route('master-data.asset-statuses.index'));

    actingAs($ownerB)->post(route('master-data.asset-statuses.store'), [
        'name' => 'Good',
        'code' => 'DUP',
        'description' => null,
    ])->assertRedirect(route('master-data.asset-statuses.index'));

    actingAs($ownerA)->post(route('master-data.asset-statuses.store'), [
        'name' => 'Duplicate',
        'code' => 'DUP',
        'description' => null,
    ])->assertSessionHasErrors(['code']);
});
