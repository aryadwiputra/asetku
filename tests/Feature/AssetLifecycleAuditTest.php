<?php

use App\Http\Middleware\HandleInertiaRequests;
use App\Models\Asset;
use App\Models\AssetHistory;
use App\Models\AssetMedia;
use App\Models\AssetMovement;
use App\Models\AssetStatus;
use App\Models\AssetUser;
use App\Models\Branch;
use App\Models\MediaAsset;
use App\Models\Organization;
use App\Models\User;
use App\Services\OrganizationContext;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
    $this->withoutMiddleware(HandleInertiaRequests::class);
});

test('updating an asset status records immutable history', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $user = User::factory()->inOrganization($organization, role: 'Owner')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);
    $user->assignRole('super-admin');

    $branch = Branch::factory()->create(['organization_id' => $organization->id]);

    $status = AssetStatus::query()->create([
        'organization_id' => $organization->id,
        'name' => 'Active',
        'code' => 'active',
    ]);

    $asset = Asset::query()->create([
        'organization_id' => $organization->id,
        'code' => 'AST-JKT-2026-0001',
        'name' => 'Laptop A',
        'branch_id' => $branch->id,
    ]);

    actingAs($user)
        ->patch(route('assets.update', $asset), [
            'code' => $asset->code,
            'name' => $asset->name,
            'branch_id' => $asset->branch_id,
            'asset_status_id' => $status->id,
        ])
        ->assertRedirect();

    $history = AssetHistory::query()
        ->where('asset_id', $asset->id)
        ->where('action', 'status_changed')
        ->latest('id')
        ->first();

    expect($history)->not->toBeNull();

    $deleted = $history->delete();
    expect($deleted)->toBeFalse();
    expect(AssetHistory::query()->whereKey($history->id)->exists())->toBeTrue();
});

test('attaching a document stores stage/type and logs audit event', function () {
    Storage::fake('public');

    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $user = User::factory()->inOrganization($organization, role: 'Owner')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);
    $user->assignRole('super-admin');

    $branch = Branch::factory()->create(['organization_id' => $organization->id]);

    $asset = Asset::query()->create([
        'organization_id' => $organization->id,
        'code' => 'AST-JKT-2026-0002',
        'name' => 'Printer A',
        'branch_id' => $branch->id,
    ]);

    $mediaAsset = MediaAsset::query()->create([
        'organization_id' => $organization->id,
        'title' => 'Invoice',
    ]);

    $mediaAsset->addMediaFromString('invoice-bytes')
        ->usingFileName('invoice.txt')
        ->toMediaCollection('file');

    actingAs($user)
        ->post(route('assets.attachments.store', $asset), [
            'media_asset_id' => $mediaAsset->id,
            'kind' => 'document',
            'stage' => 'acquisition',
            'document_type' => 'invoice',
        ])
        ->assertRedirect();

    $assetMedia = AssetMedia::query()->where('asset_id', $asset->id)->first();

    expect($assetMedia)->not->toBeNull()
        ->and($assetMedia->stage)->toBe('acquisition')
        ->and($assetMedia->document_type)->toBe('invoice');

    $history = AssetHistory::query()
        ->where('asset_id', $asset->id)
        ->where('action', 'attachment_added')
        ->latest('id')
        ->first();

    expect($history)->not->toBeNull()
        ->and($history->payload)->toBeArray()
        ->and($history->payload['stage'] ?? null)->toBe('acquisition')
        ->and($history->payload['document_type'] ?? null)->toBe('invoice');
});

test('creating a borrow movement updates asset and writes lifecycle history', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $user = User::factory()->inOrganization($organization, role: 'Owner')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);
    $user->assignRole('super-admin');

    $branch = Branch::factory()->create(['organization_id' => $organization->id]);

    $asset = Asset::query()->create([
        'organization_id' => $organization->id,
        'code' => 'AST-JKT-2026-0003',
        'name' => 'Laptop B',
        'branch_id' => $branch->id,
    ]);

    $assetUser = AssetUser::query()->create([
        'organization_id' => $organization->id,
        'name' => 'Budi',
    ]);

    actingAs($user)
        ->post(route('assets.movements.store', $asset), [
            'type' => 'borrow',
            'to_asset_user_id' => $assetUser->id,
            'notes' => 'Borrowed for demo',
        ])
        ->assertRedirect();

    $movement = AssetMovement::query()->latest('id')->first();

    expect($movement)->not->toBeNull()
        ->and($movement->type)->toBe('borrow')
        ->and((int) $movement->asset_id)->toBe((int) $asset->id)
        ->and((int) $movement->to_asset_user_id)->toBe((int) $assetUser->id);

    $asset->refresh();
    expect((int) $asset->asset_user_id)->toBe((int) $assetUser->id);

    expect(
        AssetHistory::query()
            ->where('asset_id', $asset->id)
            ->where('action', 'borrowed')
            ->exists()
    )->toBeTrue();
});

test('asset show includes performed_at on histories payload', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $user = User::factory()->inOrganization($organization, role: 'Owner')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);
    $user->assignRole('super-admin');

    $branch = Branch::factory()->create(['organization_id' => $organization->id]);

    $asset = Asset::query()->create([
        'organization_id' => $organization->id,
        'code' => 'AST-JKT-2026-0004',
        'name' => 'Scanner A',
        'branch_id' => $branch->id,
    ]);

    AssetHistory::query()->create([
        'asset_id' => $asset->id,
        'action' => 'lifecycle_recorded',
        'performed_at' => now()->subDay(),
        'description' => 'Recorded',
        'changed_by' => $user->id,
        'payload' => ['stage' => 'receiving'],
    ]);

    actingAs($user)
        ->get(route('assets.show', $asset))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('assets/show')
            ->has('histories.0.performed_at')
        );
});

test('disposed assets cannot be reactivated directly', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $user = User::factory()->inOrganization($organization, role: 'Owner')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);
    $user->assignRole('super-admin');

    $branch = Branch::factory()->create(['organization_id' => $organization->id]);

    $disposed = AssetStatus::query()->create([
        'organization_id' => $organization->id,
        'name' => 'Disposed',
        'code' => 'disposed',
    ]);

    $active = AssetStatus::query()->create([
        'organization_id' => $organization->id,
        'name' => 'Active',
        'code' => 'active',
    ]);

    $asset = Asset::query()->create([
        'organization_id' => $organization->id,
        'code' => 'AST-JKT-2026-0005',
        'name' => 'Archived Laptop',
        'branch_id' => $branch->id,
        'asset_status_id' => $disposed->id,
    ]);

    actingAs($user)
        ->from(route('assets.show', $asset))
        ->post(route('assets.lifecycle.status', $asset), [
            'asset_status_id' => $active->id,
        ])
        ->assertSessionHasErrors('asset_status_id');

    $asset->refresh();

    expect((int) $asset->asset_status_id)->toBe((int) $disposed->id);
});

test('bulk status update changes multiple assets and records audit history', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $user = User::factory()->inOrganization($organization, role: 'Owner')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);
    $user->assignRole('super-admin');

    $branch = Branch::factory()->create(['organization_id' => $organization->id]);

    $borrowed = AssetStatus::query()->create([
        'organization_id' => $organization->id,
        'name' => 'Borrowed',
        'code' => 'borrowed',
    ]);

    $firstAsset = Asset::query()->create([
        'organization_id' => $organization->id,
        'code' => 'AST-JKT-2026-1001',
        'name' => 'Laptop Pool A',
        'branch_id' => $branch->id,
    ]);

    $secondAsset = Asset::query()->create([
        'organization_id' => $organization->id,
        'code' => 'AST-JKT-2026-1002',
        'name' => 'Laptop Pool B',
        'branch_id' => $branch->id,
    ]);

    actingAs($user)
        ->post(route('assets.bulk-status.store'), [
            'asset_ids' => [$firstAsset->id, $secondAsset->id],
            'asset_status_id' => $borrowed->id,
            'notes' => 'Bulk reassignment',
        ])
        ->assertRedirect();

    $firstAsset->refresh();
    $secondAsset->refresh();

    expect((int) $firstAsset->asset_status_id)->toBe((int) $borrowed->id)
        ->and((int) $secondAsset->asset_status_id)->toBe((int) $borrowed->id)
        ->and(
            AssetHistory::query()
                ->whereIn('asset_id', [$firstAsset->id, $secondAsset->id])
                ->where('action', 'status_changed')
                ->count()
        )->toBe(2);
});

test('asset allows up to twenty photos before rejecting more uploads', function () {
    Storage::fake('public');

    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $user = User::factory()->inOrganization($organization, role: 'Owner')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);
    $user->assignRole('super-admin');

    $branch = Branch::factory()->create(['organization_id' => $organization->id]);

    $asset = Asset::query()->create([
        'organization_id' => $organization->id,
        'code' => 'AST-JKT-2026-2001',
        'name' => 'Camera Kit',
        'branch_id' => $branch->id,
    ]);

    foreach (range(1, 20) as $index) {
        $mediaAsset = MediaAsset::query()->create([
            'organization_id' => $organization->id,
            'title' => "Photo {$index}",
        ]);

        $mediaAsset->addMediaFromString("photo-{$index}")
            ->usingFileName("photo-{$index}.jpg")
            ->toMediaCollection('file');

        actingAs($user)
            ->post(route('assets.attachments.store', $asset), [
                'media_asset_id' => $mediaAsset->id,
                'kind' => 'photo',
            ])
            ->assertRedirect();
    }

    $extraMediaAsset = MediaAsset::query()->create([
        'organization_id' => $organization->id,
        'title' => 'Photo 21',
    ]);

    $extraMediaAsset->addMediaFromString('photo-21')
        ->usingFileName('photo-21.jpg')
        ->toMediaCollection('file');

    actingAs($user)
        ->from(route('assets.show', $asset))
        ->post(route('assets.attachments.store', $asset), [
            'media_asset_id' => $extraMediaAsset->id,
            'kind' => 'photo',
        ])
        ->assertSessionHasErrors('kind');

    expect(
        AssetMedia::query()
            ->where('asset_id', $asset->id)
            ->where('kind', 'photo')
            ->count()
    )->toBe(20);
});
