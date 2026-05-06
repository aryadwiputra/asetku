<?php

use App\Models\ApprovalWorkflow;
use App\Models\ApprovalWorkflowStep;
use App\Models\Asset;
use App\Models\AssetApprovalRequest;
use App\Models\AssetDisposal;
use App\Models\AssetHistory;
use App\Models\AssetMedia;
use App\Models\Branch;
use App\Models\Organization;
use App\Models\User;
use App\Services\OrganizationContext;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Support\Facades\Storage;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

function makeDisposalWorkflow(Organization $organization): void
{
    $workflow = ApprovalWorkflow::query()->create([
        'organization_id' => $organization->id,
        'type' => 'disposal',
        'name' => 'Disposal default',
        'is_active' => true,
    ]);

    ApprovalWorkflowStep::query()->create([
        'workflow_id' => $workflow->id,
        'step_number' => 1,
        'approver_kind' => 'role',
        'approver_reference' => 'Owner',
        'is_required' => true,
    ]);

    ApprovalWorkflowStep::query()->create([
        'workflow_id' => $workflow->id,
        'step_number' => 2,
        'approver_kind' => 'role',
        'approver_reference' => 'Admin',
        'is_required' => true,
    ]);
}

test('disposal request creates approval request and steps', function () {
    $organization = Organization::factory()->create(['currency_code' => 'IDR']);
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    makeDisposalWorkflow($organization);

    $owner = User::factory()->inOrganization($organization, role: 'Owner')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $branch = Branch::factory()->create(['organization_id' => $organization->id, 'code' => 'JKT']);

    $asset = Asset::query()->create([
        'code' => 'AST-JKT-2026-0001',
        'name' => 'Printer',
        'branch_id' => $branch->id,
        'cost' => 2_000_000,
        'purchase_date' => now()->subMonths(6)->toDateString(),
        'useful_life_months' => 24,
        'residual_value' => 200_000,
    ]);

    actingAs($owner)
        ->post(route('disposals.store'), [
            'asset_id' => $asset->id,
            'type' => 'sale',
            'disposed_at' => now()->toDateString(),
            'reason' => 'Sold',
            'proceeds_amount' => 1_500_000,
            'fees_amount' => 50_000,
        ])
        ->assertRedirect();

    $disposal = AssetDisposal::query()->first();

    expect($disposal)->not->toBeNull()
        ->and($disposal->status)->toBe('pending')
        ->and($disposal->type)->toBe('sale')
        ->and($disposal->net_proceeds_amount)->not->toBeNull()
        ->and($disposal->book_value_at_disposal)->not->toBeNull()
        ->and($disposal->gain_loss_amount)->not->toBeNull();

    $approval = AssetApprovalRequest::query()->first();

    expect($approval)->not->toBeNull()
        ->and($approval->status)->toBe('pending')
        ->and($approval->current_step)->toBe(1)
        ->and($approval->required_steps)->toBe(2)
        ->and($approval->steps()->count())->toBe(2);

    expect(AssetHistory::query()->where('asset_id', $asset->id)->where('action', 'disposal_requested')->exists())->toBeTrue();
});

test('multi-level approval executes disposal and archives asset', function () {
    Storage::fake('public');

    $organization = Organization::factory()->create(['currency_code' => 'IDR']);
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    makeDisposalWorkflow($organization);

    $owner = User::factory()->inOrganization($organization, role: 'Owner')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $admin = User::factory()->inOrganization($organization, role: 'Admin')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $branch = Branch::factory()->create(['organization_id' => $organization->id, 'code' => 'JKT']);

    $asset = Asset::query()->create([
        'code' => 'AST-JKT-2026-0002',
        'name' => 'Laptop',
        'branch_id' => $branch->id,
        'cost' => 10_000_000,
        'purchase_date' => now()->subMonths(12)->toDateString(),
        'useful_life_months' => 36,
        'residual_value' => 1_000_000,
    ]);

    actingAs($owner)->post(route('disposals.store'), [
        'asset_id' => $asset->id,
        'type' => 'writeoff',
        'disposed_at' => now()->toDateString(),
        'reason' => 'Write off',
    ])->assertRedirect();

    $disposal = AssetDisposal::query()->firstOrFail();

    actingAs($owner)->post(route('disposals.approve', $disposal), [
        'notes' => 'OK',
    ])->assertRedirect();

    $disposal->refresh();
    expect($disposal->status)->toBe('pending');

    actingAs($admin)->post(route('disposals.approve', $disposal), [
        'notes' => 'Approved',
    ])->assertRedirect();

    $disposal->refresh();
    $asset->refresh();

    expect($disposal->status)->toBe('executed')
        ->and($disposal->executed_at)->not->toBeNull()
        ->and($asset->archived_at)->not->toBeNull();

    expect(AssetHistory::query()->where('asset_id', $asset->id)->where('action', 'disposed')->exists())->toBeTrue();

    actingAs($admin)
        ->get(route('disposals.ba', $disposal))
        ->assertOk()
        ->assertDownload();

    expect(AssetMedia::query()
        ->where('asset_id', $asset->id)
        ->where('kind', 'document')
        ->where('stage', 'disposal')
        ->where('document_type', 'disposal_report')
        ->exists())->toBeTrue();
});

test('owner can reject disposal request', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    makeDisposalWorkflow($organization);

    $owner = User::factory()->inOrganization($organization, role: 'Owner')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $branch = Branch::factory()->create(['organization_id' => $organization->id]);
    $asset = Asset::query()->create([
        'code' => 'AST-0003',
        'name' => 'Router',
        'branch_id' => $branch->id,
    ]);

    actingAs($owner)->post(route('disposals.store'), [
        'asset_id' => $asset->id,
        'type' => 'scrap',
        'disposed_at' => now()->toDateString(),
    ])->assertRedirect();

    $disposal = AssetDisposal::query()->firstOrFail();

    actingAs($owner)->post(route('disposals.reject', $disposal), [
        'notes' => 'No',
    ])->assertRedirect();

    $disposal->refresh();
    $asset->refresh();

    expect($disposal->status)->toBe('rejected')
        ->and($asset->archived_at)->toBeNull();
});

test('creating disposal is blocked if workflow is missing', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $owner = User::factory()->inOrganization($organization, role: 'Owner')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $branch = Branch::factory()->create(['organization_id' => $organization->id]);
    $asset = Asset::query()->create([
        'code' => 'AST-0004',
        'name' => 'Switch',
        'branch_id' => $branch->id,
    ]);

    actingAs($owner)
        ->post(route('disposals.store'), [
            'asset_id' => $asset->id,
            'type' => 'donation',
            'disposed_at' => now()->toDateString(),
        ])
        ->assertSessionHasErrors('workflow');
});
