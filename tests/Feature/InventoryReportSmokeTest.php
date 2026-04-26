<?php

use App\Http\Middleware\HandleInertiaRequests;
use App\Models\Asset;
use App\Models\AssetCondition;
use App\Models\AssetStatus;
use App\Models\Branch;
use App\Models\Organization;
use App\Models\User;
use App\Services\OrganizationContext;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

test('inventory report and stocktake print load for an organization member', function () {
    $version = app(HandleInertiaRequests::class)->version(Request::create('/'));

    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $user = User::factory()->inOrganization($organization, role: 'Member')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $branch = Branch::factory()->create(['organization_id' => $organization->id]);
    $status = AssetStatus::query()->create([
        'organization_id' => $organization->id,
        'code' => 'active',
        'name' => 'Active',
    ]);
    $condition = AssetCondition::query()->create([
        'organization_id' => $organization->id,
        'code' => 'good',
        'name' => 'Good',
    ]);

    Asset::query()->create([
        'organization_id' => $organization->id,
        'code' => 'AST-JKT-2026-3001',
        'name' => 'Laptop A',
        'branch_id' => $branch->id,
        'asset_status_id' => $status->id,
        'asset_condition_id' => $condition->id,
        'cost' => 10_000_000,
        'qr_token' => Str::random(40),
    ]);

    actingAs($user)
        ->get(route('reports.inventory.index'), [
            'X-Inertia' => 'true',
            'X-Inertia-Version' => $version,
        ])
        ->assertOk();

    actingAs($user)
        ->get(route('reports.inventory.stocktake.print', ['branch_id' => $branch->id]), [
            'X-Inertia' => 'true',
            'X-Inertia-Version' => $version,
        ])
        ->assertOk();
});
