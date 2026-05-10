<?php

use App\Models\Asset;
use App\Models\AssetHistory;
use App\Models\AssetMedia;
use App\Models\Branch;
use App\Models\Department;
use App\Models\MediaAsset;
use App\Models\Organization;
use App\Models\User;
use App\Services\OrganizationContext;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
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

test('staff only sees scoped assets and cannot open unrelated assets', function () {
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

    $visibleAsset = Asset::query()->create([
        'organization_id' => $organization->id,
        'code' => 'AST-SCP-0001',
        'name' => 'Visible Asset',
        'branch_id' => $branch->id,
        'department_id' => $visibleDepartment->id,
    ]);

    $hiddenAsset = Asset::query()->create([
        'organization_id' => $organization->id,
        'code' => 'AST-SCP-0002',
        'name' => 'Hidden Asset',
        'branch_id' => $branch->id,
        'department_id' => $hiddenDepartment->id,
    ]);

    actingAs($staff)
        ->get(route('assets.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('summary.total_count', 1)
            ->has('items.data', 1)
            ->where('items.data.0.id', $visibleAsset->id)
        );

    actingAs($staff)->get(route('assets.show', $visibleAsset))->assertOk();
    actingAs($staff)->get(route('assets.show', $hiddenAsset))->assertForbidden();
});

test('staff cannot access asset import or export endpoints by default', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $staff = User::factory()->inOrganization($organization, role: 'Member')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    actingAs($staff)->get(route('assets.import.index'))->assertForbidden();
    actingAs($staff)->get(route('assets.export', ['format' => 'csv']))->assertForbidden();
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

test('authorized user can regenerate asset qr token and invalidate old token routes', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $user = User::factory()->inOrganization($organization, role: 'Owner')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $asset = Asset::query()->create([
        'organization_id' => $organization->id,
        'code' => 'AST-JKT-2026-QR1',
        'name' => 'Tablet A',
        'branch_id' => Branch::factory()->create(['organization_id' => $organization->id])->id,
        'qr_token' => Str::lower(Str::random(40)),
    ]);

    $oldToken = $asset->qr_token;

    actingAs($user)
        ->patch(route('assets.qr-token.update', $asset))
        ->assertRedirect(route('assets.show', $asset));

    $asset->refresh();

    expect($asset->qr_token)
        ->not->toBe($oldToken)
        ->and(strlen($asset->qr_token))->toBe(40);

    $this->get(route('qr.show', ['token' => $oldToken]))->assertNotFound();
    $this->get(route('qr.show', ['token' => $asset->qr_token]))->assertOk();

    actingAs($user)
        ->get(route('assets.lifecycle.by-token', ['token' => $oldToken]))
        ->assertNotFound();

    actingAs($user)
        ->get(route('assets.lifecycle.by-token', ['token' => $asset->qr_token]))
        ->assertRedirect(route('assets.lifecycle.show', $asset));

    actingAs($user)
        ->get(route('disposals.by-token', ['token' => $oldToken]))
        ->assertNotFound();

    actingAs($user)
        ->get(route('disposals.by-token', ['token' => $asset->qr_token]))
        ->assertRedirect(route('disposals.create', ['asset_id' => $asset->id]));

    actingAs($user)
        ->get(route('work-orders.by-token', ['token' => $oldToken]))
        ->assertNotFound();

    actingAs($user)
        ->get(route('work-orders.by-token', ['token' => $asset->qr_token]))
        ->assertRedirect(route('work-orders.create', ['asset_id' => $asset->id]));

    expect(
        AssetHistory::query()
            ->where('asset_id', $asset->id)
            ->where('action', 'updated')
            ->where('payload->before->qr_token', $oldToken)
            ->where('payload->after->qr_token', $asset->qr_token)
            ->exists()
    )->toBeTrue();
});

test('user without asset update permission cannot regenerate asset qr token', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $user = User::factory()->inOrganization($organization, role: 'Member')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $asset = Asset::query()->create([
        'organization_id' => $organization->id,
        'code' => 'AST-JKT-2026-QR2',
        'name' => 'Tablet B',
        'branch_id' => Branch::factory()->create(['organization_id' => $organization->id])->id,
        'qr_token' => Str::lower(Str::random(40)),
    ]);

    $originalToken = $asset->qr_token;

    actingAs($user)
        ->patch(route('assets.qr-token.update', $asset))
        ->assertForbidden();

    expect($asset->fresh()?->qr_token)->toBe($originalToken);
});
