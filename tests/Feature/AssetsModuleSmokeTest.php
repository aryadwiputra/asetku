<?php

use App\Models\Asset;
use App\Models\Branch;
use App\Models\Organization;
use App\Models\User;
use App\Services\OrganizationContext;
use Database\Seeders\RolePermissionSeeder;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

test('assets index loads for organization member', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $user = User::factory()->inOrganization($organization, role: 'Owner')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    actingAs($user)
        ->get(route('assets.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('assets/index')
            ->has('items')
            ->has('filtersMeta')
            ->has('savedFilters')
        );
});

test('asset can be created with auto code and qr token', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $user = User::factory()->inOrganization($organization, role: 'Owner')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $branch = Branch::factory()->create([
        'organization_id' => $organization->id,
        'code' => 'JKT',
    ]);

    actingAs($user)
        ->post(route('assets.store'), [
            'name' => 'Laptop A',
            'branch_id' => $branch->id,
        ])
        ->assertRedirect();

    $asset = Asset::query()->first();

    expect($asset)->not->toBeNull()
        ->and($asset->code)->toBeString()->not->toBeEmpty()
        ->and($asset->qr_token)->toBeString()->not->toBeEmpty();
});

test('public qr page returns ok for existing token', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $asset = Asset::query()->create([
        'code' => 'AST-JKT-2026-0001',
        'name' => 'Printer',
        'branch_id' => Branch::factory()->create(['organization_id' => $organization->id])->id,
    ]);

    $this->get(route('qr.show', ['token' => $asset->qr_token]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('qr/show')
            ->has('asset.code')
            ->has('canViewFull')
        );
});

test('assets export returns a download response', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $user = User::factory()->inOrganization($organization, role: 'Owner')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $branch = Branch::factory()->create(['organization_id' => $organization->id]);

    Asset::query()->create([
        'code' => 'AST-JKT-2026-0001',
        'name' => 'Printer',
        'branch_id' => $branch->id,
    ]);

    actingAs($user)
        ->get(route('assets.export', ['format' => 'csv']))
        ->assertOk()
        ->assertDownload();
});

test('asset labels print page loads', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $user = User::factory()->inOrganization($organization, role: 'Owner')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $branch = Branch::factory()->create(['organization_id' => $organization->id]);

    $asset = Asset::query()->create([
        'code' => 'AST-JKT-2026-0001',
        'name' => 'Printer',
        'branch_id' => $branch->id,
    ]);

    actingAs($user)
        ->get(route('assets.labels.print', ['ids' => [$asset->id]]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('assets/labels/print')
            ->has('assets')
        );
});
