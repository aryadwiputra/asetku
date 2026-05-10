<?php

use App\Models\Asset;
use App\Models\AssetMaintenance;
use App\Models\Branch;
use App\Models\Organization;
use App\Models\User;
use App\Services\OrganizationContext;
use App\Services\Reports\WorkOrderReportService;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

test('owner can access maintenance report abilities', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $owner = User::factory()->inOrganization($organization, role: 'Owner')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    expect(Gate::forUser($owner)->allows('viewMaintenanceReport'))->toBeTrue()
        ->and(Gate::forUser($owner)->allows('exportMaintenanceReport'))->toBeTrue();
});

test('work order report service computes explicit SLA compliance and downtime', function () {
    $this->travelTo('2026-05-10 12:00:00');

    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $owner = User::factory()->inOrganization($organization, role: 'Owner')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $technician = User::factory()->inOrganization($organization, role: 'Member')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $branch = Branch::factory()->create(['organization_id' => $organization->id]);

    $assetA = Asset::query()->create([
        'organization_id' => $organization->id,
        'code' => 'AST-RPT-001',
        'name' => 'Pump A',
        'branch_id' => $branch->id,
        'qr_token' => Str::random(40),
    ]);

    $assetB = Asset::query()->create([
        'organization_id' => $organization->id,
        'code' => 'AST-RPT-002',
        'name' => 'Pump B',
        'branch_id' => $branch->id,
        'qr_token' => Str::random(40),
    ]);

    AssetMaintenance::query()->create([
        'organization_id' => $organization->id,
        'asset_id' => $assetA->id,
        'type' => 'corrective',
        'source' => 'manual',
        'priority' => 'high',
        'branch_id' => $branch->id,
        'assigned_to' => $technician->id,
        'description' => 'Corrective on time',
        'status' => 'completed',
        'performed_at' => now()->subHours(6),
        'acknowledged_at' => now()->subHours(5),
        'completed_at' => now()->subHours(2),
        'response_due_at' => now()->subHours(4),
        'resolution_due_at' => now()->subHour(),
        'assigned_at' => now()->subHours(6),
        'created_at' => now()->subHours(6),
        'updated_at' => now()->subHours(2),
    ]);

    AssetMaintenance::query()->create([
        'organization_id' => $organization->id,
        'asset_id' => $assetA->id,
        'type' => 'corrective',
        'source' => 'manual',
        'priority' => 'critical',
        'branch_id' => $branch->id,
        'assigned_to' => $technician->id,
        'description' => 'Corrective breached',
        'status' => 'completed',
        'performed_at' => now()->subHours(10),
        'acknowledged_at' => now()->subHours(7),
        'completed_at' => now()->subHours(3),
        'response_due_at' => now()->subHours(8),
        'resolution_due_at' => now()->subHours(4),
        'assigned_at' => now()->subHours(10),
        'created_at' => now()->subHours(10),
        'updated_at' => now()->subHours(3),
    ]);

    AssetMaintenance::query()->create([
        'organization_id' => $organization->id,
        'asset_id' => $assetB->id,
        'type' => 'corrective',
        'source' => 'manual',
        'priority' => 'normal',
        'branch_id' => $branch->id,
        'description' => 'Response pending',
        'status' => 'open',
        'performed_at' => now()->subHour(),
        'response_due_at' => now()->addHours(2),
        'resolution_due_at' => now()->addHours(8),
        'created_at' => now()->subHour(),
        'updated_at' => now()->subHour(),
    ]);

    AssetMaintenance::query()->create([
        'organization_id' => $organization->id,
        'asset_id' => $assetB->id,
        'type' => 'corrective',
        'source' => 'manual',
        'priority' => 'low',
        'branch_id' => $branch->id,
        'description' => 'Cancelled work order',
        'status' => 'cancelled',
        'performed_at' => now()->subHours(3),
        'acknowledged_at' => now()->subHours(2),
        'cancelled_at' => now()->subHour(),
        'response_due_at' => now()->subHour(),
        'resolution_due_at' => now()->addHour(),
        'created_at' => now()->subHours(3),
        'updated_at' => now()->subHour(),
    ]);

    AssetMaintenance::query()->create([
        'organization_id' => $organization->id,
        'asset_id' => $assetB->id,
        'type' => 'preventive',
        'source' => 'schedule',
        'priority' => 'normal',
        'branch_id' => $branch->id,
        'description' => 'Preventive complete',
        'status' => 'completed',
        'performed_at' => now()->subHours(5),
        'acknowledged_at' => now()->subHours(5),
        'completed_at' => now()->subHours(4),
        'response_due_at' => now()->subHours(4),
        'resolution_due_at' => now()->subHours(3),
        'created_at' => now()->subHours(5),
        'updated_at' => now()->subHours(4),
    ]);

    $summary = app(WorkOrderReportService::class)->build($owner, []);

    expect($summary['kpis']['response_on_time'])->toBe(3)
        ->and($summary['kpis']['response_breached'])->toBe(1)
        ->and($summary['kpis']['response_compliance_percent'])->toBe(75.0)
        ->and($summary['kpis']['resolution_on_time'])->toBe(2)
        ->and($summary['kpis']['resolution_breached'])->toBe(1)
        ->and($summary['kpis']['resolution_compliance_percent'])->toBe(66.7)
        ->and($summary['kpis']['downtime_incident_count'])->toBe(2)
        ->and($summary['kpis']['downtime_total_hours'])->toBe(11.0)
        ->and($summary['kpis']['downtime_average_hours'])->toBe(5.5);

    expect($summary['sla_compliance'][0]['total_with_response_sla'])->toBe(5)
        ->and($summary['sla_compliance'][0]['total_with_resolution_sla'])->toBe(4);

    expect($summary['downtime_by_asset'])->toHaveCount(1)
        ->and($summary['downtime_by_asset'][0]['asset'])->toContain('AST-RPT-001')
        ->and($summary['downtime_by_asset'][0]['incident_count'])->toBe(2)
        ->and($summary['downtime_by_asset'][0]['latest_downtime_hours'])->toBe(4.0);

    expect($summary['downtime_by_month'])->toHaveCount(1)
        ->and($summary['downtime_by_month'][0]['incident_count'])->toBe(2);
});

test('work order report service filters SLA and downtime aggregates', function () {
    $this->travelTo('2026-05-10 12:00:00');

    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $owner = User::factory()->inOrganization($organization, role: 'Owner')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $techA = User::factory()->inOrganization($organization, role: 'Member')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $techB = User::factory()->inOrganization($organization, role: 'Member')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $branchA = Branch::factory()->create(['organization_id' => $organization->id]);
    $branchB = Branch::factory()->create(['organization_id' => $organization->id]);

    $assetA = Asset::query()->create([
        'organization_id' => $organization->id,
        'code' => 'AST-FLTR-001',
        'name' => 'Generator A',
        'branch_id' => $branchA->id,
        'qr_token' => Str::random(40),
    ]);

    $assetB = Asset::query()->create([
        'organization_id' => $organization->id,
        'code' => 'AST-FLTR-002',
        'name' => 'Generator B',
        'branch_id' => $branchB->id,
        'qr_token' => Str::random(40),
    ]);

    AssetMaintenance::query()->create([
        'organization_id' => $organization->id,
        'asset_id' => $assetA->id,
        'type' => 'corrective',
        'source' => 'manual',
        'priority' => 'high',
        'branch_id' => $branchA->id,
        'assigned_to' => $techA->id,
        'description' => 'Included by filters',
        'status' => 'completed',
        'performed_at' => now()->subHours(4),
        'acknowledged_at' => now()->subHours(3),
        'completed_at' => now()->subHour(),
        'response_due_at' => now()->subHours(2),
        'resolution_due_at' => now(),
        'assigned_at' => now()->subHours(4),
        'created_at' => now()->subHours(4),
        'updated_at' => now()->subHour(),
    ]);

    AssetMaintenance::query()->create([
        'organization_id' => $organization->id,
        'asset_id' => $assetB->id,
        'type' => 'corrective',
        'source' => 'manual',
        'priority' => 'high',
        'branch_id' => $branchB->id,
        'assigned_to' => $techB->id,
        'description' => 'Excluded by branch/tech filters',
        'status' => 'completed',
        'performed_at' => now()->subHours(8),
        'acknowledged_at' => now()->subHours(7),
        'completed_at' => now()->subHours(5),
        'response_due_at' => now()->subHours(6),
        'resolution_due_at' => now()->subHours(4),
        'assigned_at' => now()->subHours(8),
        'created_at' => now()->subHours(8),
        'updated_at' => now()->subHours(5),
    ]);

    $summary = app(WorkOrderReportService::class)->build($owner, [
        'branch_id' => (string) $branchA->id,
        'assigned_to' => (string) $techA->id,
        'date_from' => now()->subDay()->toDateString(),
        'date_to' => now()->toDateString(),
    ]);

    expect($summary['kpis']['opened'])->toBe(1)
        ->and($summary['kpis']['response_on_time'])->toBe(1)
        ->and($summary['kpis']['resolution_on_time'])->toBe(1)
        ->and($summary['kpis']['downtime_incident_count'])->toBe(1)
        ->and($summary['downtime_by_asset'])->toHaveCount(1)
        ->and($summary['downtime_by_asset'][0]['asset'])->toContain('AST-FLTR-001');
});
