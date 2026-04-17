<?php

use App\Models\Asset;
use App\Models\AssetHistory;
use App\Models\AssetStatus;
use App\Models\AssetUser;
use App\Models\Branch;
use App\Models\Organization;
use App\Models\User;
use App\Services\OrganizationContext;
use Database\Seeders\RolePermissionSeeder;
use Inertia\Testing\AssertableInertia as Assert;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

test('asset lifecycle page loads for organization member', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $user = User::factory()->inOrganization($organization, role: 'Member')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    actingAs($user)
        ->get(route('assets.lifecycle.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('assets/lifecycle')
            ->has('search')
            ->has('results')
        );
});

test('asset lifecycle search returns visible results', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $user = User::factory()->inOrganization($organization, role: 'Member')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $branch = Branch::factory()->create(['organization_id' => $organization->id]);

    Asset::query()->create([
        'organization_id' => $organization->id,
        'code' => 'AST-JKT-2026-0001',
        'name' => 'Laptop A',
        'branch_id' => $branch->id,
    ]);

    actingAs($user)
        ->get(route('assets.lifecycle.index', ['q' => 'Laptop']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('results', 1)
            ->where('results.0.name', 'Laptop A')
        );
});

test('lookup by token redirects to lifecycle page', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $user = User::factory()->inOrganization($organization, role: 'Member')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $asset = Asset::query()->create([
        'organization_id' => $organization->id,
        'code' => 'AST-JKT-2026-0002',
        'name' => 'Printer A',
        'branch_id' => Branch::factory()->create(['organization_id' => $organization->id])->id,
    ]);

    actingAs($user)
        ->get(route('assets.lifecycle.by-token', ['token' => $asset->qr_token]))
        ->assertRedirect(route('assets.lifecycle.show', $asset));
});

test('status quick change updates asset and records history with performed_at', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $user = User::factory()->inOrganization($organization, role: 'Owner')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $branch = Branch::factory()->create(['organization_id' => $organization->id]);

    $status = AssetStatus::query()->create([
        'organization_id' => $organization->id,
        'name' => 'Borrowed',
        'code' => 'borrowed',
    ]);

    $asset = Asset::query()->create([
        'organization_id' => $organization->id,
        'code' => 'AST-JKT-2026-0003',
        'name' => 'Scanner A',
        'branch_id' => $branch->id,
    ]);

    $performedAt = now()->subHours(2)->toDateTimeString();

    actingAs($user)
        ->post(route('assets.lifecycle.status', $asset), [
            'asset_status_id' => $status->id,
            'performed_at' => $performedAt,
            'notes' => 'Updated from lifecycle menu',
        ])
        ->assertRedirect();

    $asset->refresh();
    expect((int) $asset->asset_status_id)->toBe((int) $status->id);

    expect(
        AssetHistory::query()
            ->where('asset_id', $asset->id)
            ->where('action', 'status_changed')
            ->whereNotNull('performed_at')
            ->exists()
    )->toBeTrue();
});

test('borrow and return auto update status when master codes exist', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $user = User::factory()->inOrganization($organization, role: 'Owner')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $branch = Branch::factory()->create(['organization_id' => $organization->id]);

    $active = AssetStatus::query()->create([
        'organization_id' => $organization->id,
        'name' => 'Active',
        'code' => 'active',
    ]);

    $borrowed = AssetStatus::query()->create([
        'organization_id' => $organization->id,
        'name' => 'Borrowed',
        'code' => 'borrowed',
    ]);

    $asset = Asset::query()->create([
        'organization_id' => $organization->id,
        'code' => 'AST-JKT-2026-0004',
        'name' => 'Laptop B',
        'branch_id' => $branch->id,
        'asset_status_id' => $active->id,
    ]);

    $assetUser = AssetUser::query()->create([
        'organization_id' => $organization->id,
        'name' => 'Budi',
    ]);

    actingAs($user)
        ->post(route('assets.movements.store', $asset), [
            'type' => 'borrow',
            'to_asset_user_id' => $assetUser->id,
        ])
        ->assertRedirect();

    $asset->refresh();
    expect((int) $asset->asset_status_id)->toBe((int) $borrowed->id);

    actingAs($user)
        ->post(route('assets.movements.store', $asset), [
            'type' => 'return',
        ])
        ->assertRedirect();

    $asset->refresh();
    expect((int) $asset->asset_status_id)->toBe((int) $active->id)
        ->and($asset->asset_user_id)->toBeNull();

    expect(
        AssetHistory::query()
            ->where('asset_id', $asset->id)
            ->where('action', 'status_changed')
            ->exists()
    )->toBeTrue();
});

