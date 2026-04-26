<?php

use App\Models\AssetCategory;
use App\Models\AssetClass;
use App\Models\AssetLocation;
use App\Models\AssetStatus;
use App\Models\AssetUser;
use App\Models\Branch;
use App\Models\Department;
use App\Models\Organization;
use App\Models\PersonInCharge;
use App\Models\Unit;
use App\Models\User;
use App\Models\Vendor;
use App\Models\VendorContract;
use App\Models\Warranty;
use App\Services\OrganizationContext;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->withoutVite();
});

test('master data pages render for an owner', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);
    $user = User::factory()->inOrganization($organization, role: 'Owner')->create();

    $branch = Branch::factory()->create(['organization_id' => $organization->id]);

    $assetStatus = AssetStatus::query()->create(['name' => 'Good', 'code' => 'GOOD']);
    $assetClass = AssetClass::query()->create(['name' => 'IT', 'code' => 'IT']);
    $unit = Unit::query()->create(['name' => 'Unit', 'symbol' => 'pcs']);
    $department = Department::query()->create(['name' => 'General', 'code' => 'GEN', 'branch_id' => $branch->id]);
    $pic = PersonInCharge::query()->create(['name' => 'PIC', 'email' => 'pic@example.com']);
    $assetUser = AssetUser::query()->create(['name' => 'User', 'email' => 'user@example.com', 'department_id' => $department->id]);
    $category = AssetCategory::query()->create(['name' => 'Laptop', 'code' => 'LAP', 'depreciation_method' => 'straight_line']);
    $location = AssetLocation::query()->create(['name' => 'HQ', 'code' => 'HQ', 'branch_id' => $branch->id]);
    $vendor = Vendor::query()->create(['name' => 'Vendor A']);
    $warranty = Warranty::query()->create(['name' => 'Standard', 'duration_months' => 12]);
    $contract = VendorContract::query()->create(['vendor_id' => $vendor->id, 'vendor_name' => 'Vendor A', 'title' => 'Support', 'type' => 'maintenance', 'status' => 'active', 'contract_number' => 'C-001']);

    actingAs($user)
        ->get(route('master-data.index'))
        ->assertOk();

    actingAs($user)->get(route('master-data.asset-statuses.index'))->assertOk();
    actingAs($user)->get(route('master-data.asset-statuses.create'))->assertOk();
    actingAs($user)->get(route('master-data.asset-statuses.edit', $assetStatus))->assertOk();

    actingAs($user)->get(route('master-data.asset-classes.index'))->assertOk();
    actingAs($user)->get(route('master-data.asset-classes.create'))->assertOk();
    actingAs($user)->get(route('master-data.asset-classes.edit', $assetClass))->assertOk();

    actingAs($user)->get(route('master-data.units.index'))->assertOk();
    actingAs($user)->get(route('master-data.units.create'))->assertOk();
    actingAs($user)->get(route('master-data.units.edit', $unit))->assertOk();

    actingAs($user)->get(route('master-data.departments.index'))->assertOk();
    actingAs($user)->get(route('master-data.departments.create'))->assertOk();
    actingAs($user)->get(route('master-data.departments.edit', $department))->assertOk();

    actingAs($user)->get(route('master-data.person-in-charges.index'))->assertOk();
    actingAs($user)->get(route('master-data.person-in-charges.create'))->assertOk();
    actingAs($user)->get(route('master-data.person-in-charges.edit', $pic))->assertOk();

    actingAs($user)->get(route('master-data.asset-users.index'))->assertOk();
    actingAs($user)->get(route('master-data.asset-users.create'))->assertOk();
    actingAs($user)->get(route('master-data.asset-users.edit', $assetUser))->assertOk();

    actingAs($user)->get(route('master-data.asset-categories.index'))->assertOk();
    actingAs($user)->get(route('master-data.asset-categories.create'))->assertOk();
    actingAs($user)->get(route('master-data.asset-categories.edit', $category))->assertOk();

    actingAs($user)->get(route('master-data.asset-locations.index'))->assertOk();
    actingAs($user)->get(route('master-data.asset-locations.create'))->assertOk();
    actingAs($user)->get(route('master-data.asset-locations.edit', $location))->assertOk();

    actingAs($user)->get(route('master-data.vendors.index'))->assertOk();
    actingAs($user)->get(route('master-data.vendors.create'))->assertOk();
    actingAs($user)->get(route('master-data.vendors.edit', $vendor))->assertOk();

    actingAs($user)->get(route('master-data.warranties.index'))->assertOk();
    actingAs($user)->get(route('master-data.warranties.create'))->assertOk();
    actingAs($user)->get(route('master-data.warranties.edit', $warranty))->assertOk();

    actingAs($user)->get(route('vendor-contracts.index'))->assertOk();
    actingAs($user)->get(route('vendor-contracts.create'))->assertOk();
    actingAs($user)->get(route('vendor-contracts.edit', $contract))->assertOk();
    actingAs($user)->get(route('vendor-contracts.show', $contract))->assertOk();
});
