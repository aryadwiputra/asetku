<?php

use App\Models\Asset;
use App\Models\Branch;
use App\Models\Organization;
use App\Models\User;
use App\Models\Vendor;
use App\Models\VendorContract;
use App\Services\OrganizationContext;
use Inertia\Testing\AssertableInertia as Assert;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->withoutVite();
});

test('owner can create vendor and blacklist it', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);
    $user = User::factory()->inOrganization($organization, role: 'Owner')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    actingAs($user)
        ->post(route('master-data.vendors.store'), [
            'name' => 'Vendor Blacklist',
            'tax_number' => '01.234.567.8-999.000',
            'is_blacklisted' => true,
            'blacklist_reason' => 'Repeated SLA breach',
        ])
        ->assertRedirect(route('master-data.vendors.index'));

    expect(Vendor::query()->first())
        ->name->toBe('Vendor Blacklist');
    expect(Vendor::query()->first()?->is_blacklisted)->toBeTrue();
});

test('member can view vendors but cannot create them', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);
    $member = User::factory()->inOrganization($organization, role: 'Member')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    actingAs($member)->get(route('master-data.vendors.index'))->assertOk();

    actingAs($member)
        ->post(route('master-data.vendors.store'), [
            'name' => 'Cannot Create',
        ])
        ->assertForbidden();
});

test('cannot create a contract for a blacklisted vendor', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);
    $user = User::factory()->inOrganization($organization, role: 'Owner')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $branch = Branch::factory()->create(['organization_id' => $organization->id]);
    $asset = Asset::query()->create(['code' => 'AST-1', 'name' => 'Asset 1', 'branch_id' => $branch->id]);
    $vendor = Vendor::query()->create(['name' => 'Blocked Vendor', 'is_blacklisted' => true]);

    actingAs($user)
        ->post(route('vendor-contracts.store'), [
            'vendor_id' => $vendor->id,
            'title' => 'Blocked contract',
            'type' => 'maintenance',
            'status' => 'draft',
            'asset_ids' => [$asset->id],
        ])
        ->assertSessionHasErrors(['vendor_id']);
});

test('contract renewal creates a draft clone with differences', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);
    $user = User::factory()->inOrganization($organization, role: 'Owner')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $vendor = Vendor::query()->create(['name' => 'Vendor Clone']);
    $contract = VendorContract::query()->create([
        'vendor_id' => $vendor->id,
        'vendor_name' => $vendor->name,
        'title' => 'Existing Contract',
        'type' => 'maintenance',
        'status' => 'active',
        'contract_number' => 'CNT-001',
        'end_date' => now()->addDays(5)->toDateString(),
    ]);

    actingAs($user)
        ->post(route('vendor-contracts.renew', $contract))
        ->assertRedirect();

    $renewal = $contract->renewals()->first();

    expect($renewal)->not->toBeNull();
    expect($renewal?->field_differences)->toHaveKey('status');
    expect(VendorContract::query()->where('title', 'like', '%Renewal')->exists())->toBeTrue();
});

test('asset detail page exposes warranty status and claims', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);
    $user = User::factory()->inOrganization($organization, role: 'Owner')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $branch = Branch::factory()->create(['organization_id' => $organization->id]);
    $asset = Asset::query()->create([
        'code' => 'AST-CLAIM-1',
        'name' => 'Claimable Asset',
        'branch_id' => $branch->id,
        'purchase_date' => now()->subMonths(11)->toDateString(),
        'warranty_end' => now()->addDays(15)->toDateString(),
    ]);

    actingAs($user)
        ->get(route('assets.show', $asset))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('assets/show')
            ->where('warrantyStatus.status', 'expiring_soon')
            ->has('warrantyClaims')
        );
});
