<?php

use App\Models\Asset;
use App\Models\Branch;
use App\Models\Organization;
use App\Models\User;
use App\Models\Vendor;
use App\Models\VendorContract;
use App\Services\OrganizationContext;

test('reminder command sends database notifications to admin and manager', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $admin = User::factory()->inOrganization($organization, role: 'Admin')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);
    $manager = User::factory()->inOrganization($organization, role: 'Manager')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);
    User::factory()->inOrganization($organization, role: 'Member')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $branch = Branch::factory()->create(['organization_id' => $organization->id]);
    $vendor = Vendor::query()->create(['name' => 'Vendor Reminder']);

    VendorContract::query()->create([
        'vendor_id' => $vendor->id,
        'vendor_name' => $vendor->name,
        'title' => 'Reminder Contract',
        'type' => 'maintenance',
        'status' => 'active',
        'end_date' => now()->addDays(10)->toDateString(),
    ]);

    Asset::query()->create([
        'code' => 'AST-REM-1',
        'name' => 'Warranty Reminder',
        'branch_id' => $branch->id,
        'warranty_end' => now()->addDays(12)->toDateString(),
    ]);

    $this->artisan('contracts-and-warranties:remind')->assertSuccessful();

    expect($admin->fresh()->notifications()->count())->toBe(2);
    expect($manager->fresh()->notifications()->count())->toBe(2);
});
