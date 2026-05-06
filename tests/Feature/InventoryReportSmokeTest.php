<?php

use App\Http\Middleware\HandleInertiaRequests;
use App\Models\Asset;
use App\Models\AssetCondition;
use App\Models\AssetStatus;
use App\Models\Branch;
use App\Models\Department;
use App\Models\Organization;
use App\Models\User;
use App\Services\OrganizationContext;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

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

test('inventory report only counts assets visible to staff scope', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $branch = Branch::factory()->create(['organization_id' => $organization->id]);
    $visibleDepartment = Department::query()->create([
        'organization_id' => $organization->id,
        'branch_id' => $branch->id,
        'code' => 'IT',
        'name' => 'IT',
    ]);
    $hiddenDepartment = Department::query()->create([
        'organization_id' => $organization->id,
        'branch_id' => $branch->id,
        'code' => 'OPS',
        'name' => 'Operations',
    ]);

    $staff = User::factory()->inOrganization($organization, role: 'Member')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
        'department_id' => $visibleDepartment->id,
    ]);

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
        'code' => 'AST-INV-0001',
        'name' => 'Visible Laptop',
        'branch_id' => $branch->id,
        'department_id' => $visibleDepartment->id,
        'asset_status_id' => $status->id,
        'asset_condition_id' => $condition->id,
        'cost' => 10_000_000,
        'qr_token' => Str::random(40),
    ]);

    Asset::query()->create([
        'organization_id' => $organization->id,
        'code' => 'AST-INV-0002',
        'name' => 'Hidden Laptop',
        'branch_id' => $branch->id,
        'department_id' => $hiddenDepartment->id,
        'asset_status_id' => $status->id,
        'asset_condition_id' => $condition->id,
        'cost' => 20_000_000,
        'qr_token' => Str::random(40),
    ]);

    actingAs($staff)
        ->get(route('reports.inventory.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('summary.total_assets', 1)
            ->where('summary.total_value', '10000000')
        );

    actingAs($staff)
        ->get(route('reports.inventory.stocktake.print', ['branch_id' => $branch->id]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('assets', 1)
            ->where('assets.0.code', 'AST-INV-0001')
        );
});
