<?php

use App\Models\Asset;
use App\Models\AssetCondition;
use App\Models\AssetHistory;
use App\Models\Branch;
use App\Models\Department;
use App\Models\Organization;
use App\Models\User;
use App\Services\OrganizationContext;
use Database\Seeders\RolePermissionSeeder;
use Inertia\Testing\AssertableInertia as Assert;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

test('dashboard returns real asset KPIs and sections', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $user = User::factory()->inOrganization($organization, role: 'Owner')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $branch = Branch::factory()->create(['organization_id' => $organization->id, 'code' => 'JKT']);
    $department = Department::query()->create([
        'name' => 'IT',
        'code' => 'IT',
        'branch_id' => $branch->id,
    ]);

    $good = AssetCondition::query()->create(['name' => 'Good', 'code' => 'good']);
    $needsAttention = AssetCondition::query()->create(['name' => 'Needs attention', 'code' => 'needs_attention']);
    $broken = AssetCondition::query()->create(['name' => 'Broken', 'code' => 'broken']);

    $assetVisible = Asset::query()->create([
        'code' => 'AST-JKT-0001',
        'name' => 'Laptop A',
        'branch_id' => $branch->id,
        'department_id' => $department->id,
        'asset_condition_id' => $needsAttention->id,
        'cost' => 15000000,
    ]);

    $assetVisible->forceFill([
        'created_at' => now()->subDays(2),
        'updated_at' => now()->subDays(1),
    ])->saveQuietly();

    $assetOlder = Asset::query()->create([
        'code' => 'AST-JKT-0002',
        'name' => 'Printer B',
        'branch_id' => $branch->id,
        'department_id' => $department->id,
        'asset_condition_id' => $good->id,
        'cost' => 2500000,
    ]);

    $assetOlder->forceFill([
        'created_at' => now()->subDays(10),
        'updated_at' => now()->subDays(9),
    ])->saveQuietly();

    Asset::query()->create([
        'code' => 'AST-JKT-0003',
        'name' => 'Forklift',
        'branch_id' => $branch->id,
        'department_id' => $department->id,
        'asset_condition_id' => $broken->id,
        'cost' => 50000000,
    ]);

    AssetHistory::query()->create([
        'asset_id' => $assetVisible->id,
        'action' => 'created',
        'description' => 'Asset created',
        'changed_by' => $user->id,
        'payload' => [],
    ]);

    actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('kpis.total_assets')
            ->has('kpis.total_value')
            ->has('kpis.needs_attention')
            ->has('kpis.created_last_7_days')
            ->has('attention.items')
            ->has('topBranches')
            ->has('recentActivity')
            ->has('quickActions')
            ->where('kpis.needs_attention', 2)
        );
});

test('dashboard KPIs respect asset visibility for scoped user', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $branch = Branch::factory()->create(['organization_id' => $organization->id, 'code' => 'JKT']);
    $departmentA = Department::query()->create([
        'name' => 'IT',
        'code' => 'IT',
        'branch_id' => $branch->id,
    ]);
    $departmentB = Department::query()->create([
        'name' => 'GA',
        'code' => 'GA',
        'branch_id' => $branch->id,
    ]);

    $needsAttention = AssetCondition::query()->create(['name' => 'Needs attention', 'code' => 'needs_attention']);

    $user = User::factory()->inOrganization($organization, role: 'Member')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
        'department_id' => $departmentA->id,
    ]);

    Asset::query()->create([
        'code' => 'AST-JKT-1001',
        'name' => 'Visible asset',
        'branch_id' => $branch->id,
        'department_id' => $departmentA->id,
        'asset_condition_id' => $needsAttention->id,
    ]);

    Asset::query()->create([
        'code' => 'AST-JKT-2001',
        'name' => 'Hidden asset',
        'branch_id' => $branch->id,
        'department_id' => $departmentB->id,
        'asset_condition_id' => $needsAttention->id,
    ]);

    actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('kpis.total_assets', 1)
            ->where('kpis.needs_attention', 1)
        );
});
