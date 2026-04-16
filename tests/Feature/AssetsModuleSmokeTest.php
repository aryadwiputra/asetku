<?php

use App\Models\Asset;
use App\Models\AssetHistory;
use App\Models\AssetMedia;
use App\Models\Branch;
use App\Models\MediaAsset;
use App\Models\Organization;
use App\Models\User;
use App\Services\OrganizationContext;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

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
        ->assertInertia(fn (Assert $page) => $page
            ->component('assets/index')
            ->has('items')
            ->has('summary.total_count')
            ->has('filtersMeta')
            ->has('savedFilters')
        );
});

test('assets summary follows filters', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $user = User::factory()->inOrganization($organization, role: 'Owner')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $branchA = Branch::factory()->create(['organization_id' => $organization->id, 'code' => 'A']);
    $branchB = Branch::factory()->create(['organization_id' => $organization->id, 'code' => 'B']);

    Asset::query()->create([
        'code' => 'AST-A-0001',
        'name' => 'A1',
        'branch_id' => $branchA->id,
    ]);
    Asset::query()->create([
        'code' => 'AST-B-0001',
        'name' => 'B1',
        'branch_id' => $branchB->id,
    ]);

    actingAs($user)
        ->get(route('assets.index', ['filters' => ['branch_id' => $branchA->id]]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('summary.total_count', 1)
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
    Storage::fake('public');

    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $asset = Asset::query()->create([
        'code' => 'AST-JKT-2026-0001',
        'name' => 'Printer',
        'branch_id' => Branch::factory()->create(['organization_id' => $organization->id])->id,
    ]);

    $photo = MediaAsset::query()->create([
        'organization_id' => $organization->id,
        'title' => 'Asset photo',
    ]);

    $image = UploadedFile::fake()->image('photo.png');

    $photo->addMedia($image->getPathname())
        ->usingFileName('photo.png')
        ->toMediaCollection('file');

    AssetMedia::query()->create([
        'organization_id' => $organization->id,
        'asset_id' => $asset->id,
        'media_asset_id' => $photo->id,
        'kind' => 'photo',
        'sort_order' => 1,
        'is_primary' => true,
    ]);

    $document = MediaAsset::query()->create([
        'organization_id' => $organization->id,
        'title' => 'Manual book',
    ]);

    $document->addMediaFromString('manual-content')
        ->usingFileName('manual.txt')
        ->toMediaCollection('file');

    AssetMedia::query()->create([
        'organization_id' => $organization->id,
        'asset_id' => $asset->id,
        'media_asset_id' => $document->id,
        'kind' => 'document',
        'sort_order' => 2,
    ]);

    $this->get(route('qr.show', ['token' => $asset->qr_token]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('qr/show')
            ->has('asset.code')
            ->has('asset.serial_number')
            ->has('attachments', 2)
            ->has('attachments.0.media_asset.url')
            ->has('histories')
            ->has('organization')
            ->has('canViewFull')
        );
});

test('public qr page handles asset without attachments', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $asset = Asset::query()->create([
        'code' => 'AST-JKT-2026-0002',
        'name' => 'Scanner',
        'branch_id' => Branch::factory()->create(['organization_id' => $organization->id])->id,
    ]);

    $this->get(route('qr.show', ['token' => $asset->qr_token]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('qr/show')
            ->where('asset.code', 'AST-JKT-2026-0002')
            ->has('attachments', 0)
        );
});

test('public qr page returns 404 for invalid token', function () {
    $this->get(route('qr.show', ['token' => 'missing-token']))
        ->assertNotFound();
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

test('asset show includes history actor name', function () {
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

    AssetHistory::query()->create([
        'asset_id' => $asset->id,
        'action' => 'updated',
        'description' => 'Updated',
        'changed_by' => $user->id,
        'payload' => ['x' => 'y'],
    ]);

    actingAs($user)
        ->get(route('assets.show', $asset))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('assets/show')
            ->has('computedBookValue')
            ->has('histories.0.actor.name')
        );
});
