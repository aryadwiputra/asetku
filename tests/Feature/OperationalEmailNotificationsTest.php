<?php

use App\Models\Asset;
use App\Models\Organization;
use App\Models\PersonInCharge;
use App\Models\User;
use App\Models\VendorContract;
use App\Notifications\AssetWarrantyExpiringSoonNotification;
use App\Notifications\ContractExpiringSoonNotification;
use App\Services\OrganizationContext;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

test('contracts and warranties reminders send database and email (preference-aware)', function () {
    Notification::fake();

    $organization = Organization::factory()->create(['is_active' => true, 'timezone' => 'Asia/Jakarta']);
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $owner = User::factory()->inOrganization($organization, role: 'Owner')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $admin = User::factory()->inOrganization($organization, role: 'Admin')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $pic = PersonInCharge::query()->create([
        'organization_id' => $organization->id,
        'name' => 'Budi',
        'email' => 'pic@example.com',
    ]);

    $contract = VendorContract::query()->create([
        'organization_id' => $organization->id,
        'vendor_name' => 'PT Vendor',
        'start_date' => now()->subMonth()->toDateString(),
        'end_date' => now()->addDays(10)->toDateString(),
        'notes' => null,
    ]);

    Asset::query()->create([
        'organization_id' => $organization->id,
        'code' => 'AST-JKT-2026-4001',
        'name' => 'Server A',
        'vendor_contract_id' => $contract->id,
        'person_in_charge_id' => $pic->id,
        'warranty_end' => now()->addDays(10)->toDateString(),
        'qr_token' => Str::random(40),
    ]);

    Artisan::call('contracts-and-warranties:remind');

    Notification::assertSentTo([$owner, $admin], ContractExpiringSoonNotification::class);
    Notification::assertSentTo([$owner, $admin], AssetWarrantyExpiringSoonNotification::class);

    Notification::assertSentOnDemand(ContractExpiringSoonNotification::class);
    Notification::assertSentOnDemand(AssetWarrantyExpiringSoonNotification::class);
});
