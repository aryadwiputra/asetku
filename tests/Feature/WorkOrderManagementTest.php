<?php

use App\Jobs\EscalateOverdueWorkOrdersJob;
use App\Jobs\GenerateWorkOrdersFromSchedulesJob;
use App\Models\Asset;
use App\Models\AssetCategory;
use App\Models\AssetHistory;
use App\Models\AssetMaintenance;
use App\Models\AssetMaintenanceTask;
use App\Models\AssetStatus;
use App\Models\Branch;
use App\Models\Department;
use App\Models\MaintenanceChecklistTemplate;
use App\Models\MaintenanceChecklistTemplateItem;
use App\Models\MaintenanceSchedule;
use App\Models\Organization;
use App\Models\PersonInCharge;
use App\Models\TechnicianProfile;
use App\Models\User;
use App\Notifications\WorkOrderResponseSlaBreachedNotification;
use App\Services\OrganizationContext;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

test('scheduled maintenance schedules generate work orders and advance next due date', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    User::factory()->inOrganization($organization, role: 'Owner')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $branch = Branch::factory()->create(['organization_id' => $organization->id]);

    $asset = Asset::query()->create([
        'organization_id' => $organization->id,
        'code' => 'AST-JKT-2026-1001',
        'name' => 'Forklift A',
        'branch_id' => $branch->id,
        'qr_token' => Str::random(40),
    ]);

    $schedule = MaintenanceSchedule::query()->create([
        'organization_id' => $organization->id,
        'asset_id' => $asset->id,
        'name' => 'PM Bulanan',
        'interval_days' => 30,
        'next_due_at' => now()->toDateString(),
        'is_active' => true,
    ]);

    GenerateWorkOrdersFromSchedulesJob::dispatchSync($organization->id);

    $workOrder = AssetMaintenance::query()->where('schedule_id', $schedule->id)->first();
    expect($workOrder)->not->toBeNull()
        ->and($workOrder->source)->toBe('schedule')
        ->and($workOrder->type)->toBe('preventive');

    $schedule->refresh();
    expect($schedule->next_due_at->toDateString())->not->toBe(now()->toDateString());
});

test('damage report creates corrective work order', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $owner = User::factory()->inOrganization($organization, role: 'Owner')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $branch = Branch::factory()->create(['organization_id' => $organization->id]);

    $asset = Asset::query()->create([
        'organization_id' => $organization->id,
        'code' => 'AST-JKT-2026-1002',
        'name' => 'Router A',
        'branch_id' => $branch->id,
        'qr_token' => Str::random(40),
    ]);

    actingAs($owner)
        ->post(route('work-orders.store'), [
            'asset_id' => $asset->id,
            'description' => 'Router down',
            'source' => 'damage_report',
            'type' => 'corrective',
            'priority' => 'high',
        ])
        ->assertRedirect();

    $workOrder = AssetMaintenance::query()->latest('id')->first();
    expect($workOrder)->not->toBeNull()
        ->and($workOrder->source)->toBe('damage_report')
        ->and($workOrder->type)->toBe('corrective')
        ->and($workOrder->work_order_number)->toBe('WO-'.now()->year.'-001');
});

test('corrective work order moves asset to repair and restores previous status when the last work order closes', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $owner = User::factory()->inOrganization($organization, role: 'Owner')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $active = AssetStatus::query()->create([
        'organization_id' => $organization->id,
        'name' => 'Active',
        'code' => 'active',
    ]);

    $borrowed = AssetStatus::query()->create([
        'organization_id' => $organization->id,
        'name' => 'Borrowed',
        'code' => 'borrowed',
    ]);

    $repair = AssetStatus::query()->create([
        'organization_id' => $organization->id,
        'name' => 'Repair',
        'code' => 'repair',
    ]);

    $branch = Branch::factory()->create(['organization_id' => $organization->id]);
    $asset = Asset::query()->create([
        'organization_id' => $organization->id,
        'code' => 'AST-JKT-2026-1002A',
        'name' => 'Router B',
        'branch_id' => $branch->id,
        'asset_status_id' => $borrowed->id,
        'qr_token' => Str::random(40),
    ]);

    actingAs($owner)
        ->post(route('work-orders.store'), [
            'asset_id' => $asset->id,
            'description' => 'Router issue 1',
            'source' => 'damage_report',
            'type' => 'corrective',
            'priority' => 'high',
        ])
        ->assertRedirect();

    $asset->refresh();
    $firstWorkOrder = AssetMaintenance::query()->latest('id')->firstOrFail();

    expect($asset->asset_status_id)->toBe($repair->id)
        ->and($firstWorkOrder->asset_status_before_maintenance_id)->toBe($borrowed->id);

    actingAs($owner)
        ->post(route('work-orders.store'), [
            'asset_id' => $asset->id,
            'description' => 'Router issue 2',
            'source' => 'damage_report',
            'type' => 'corrective',
            'priority' => 'high',
        ])
        ->assertRedirect();

    $secondWorkOrder = AssetMaintenance::query()->latest('id')->firstOrFail();

    expect($secondWorkOrder->asset_status_before_maintenance_id)->toBe($borrowed->id);

    actingAs($owner)
        ->patch(route('work-orders.update', $firstWorkOrder), [
            'status' => 'completed',
            'internal_notes' => 'Resolved first issue',
        ])
        ->assertRedirect();

    $asset->refresh();
    expect($asset->asset_status_id)->toBe($repair->id);

    actingAs($owner)
        ->patch(route('work-orders.update', $secondWorkOrder), [
            'status' => 'cancelled',
            'internal_notes' => 'Duplicate issue',
        ])
        ->assertRedirect();

    $asset->refresh();
    expect($asset->asset_status_id)->toBe($borrowed->id);

    $historyPayloads = AssetHistory::query()
        ->where('asset_id', $asset->id)
        ->where('action', 'status_changed')
        ->pluck('payload')
        ->all();

    expect($historyPayloads)->toHaveCount(2)
        ->and($historyPayloads[0]['after']['asset_status_id'] ?? null)->toBe($repair->id)
        ->and($historyPayloads[1]['after']['asset_status_id'] ?? null)->toBe($borrowed->id);
});

test('work order numbering increments per organization and year', function () {
    $organizationA = Organization::factory()->create();
    $organizationB = Organization::factory()->create();

    $branchA = Branch::factory()->create(['organization_id' => $organizationA->id]);
    $branchB = Branch::factory()->create(['organization_id' => $organizationB->id]);

    $assetA1 = Asset::query()->create([
        'organization_id' => $organizationA->id,
        'code' => 'AST-WO-A1',
        'name' => 'Asset A1',
        'branch_id' => $branchA->id,
        'qr_token' => Str::random(40),
    ]);

    $assetA2 = Asset::query()->create([
        'organization_id' => $organizationA->id,
        'code' => 'AST-WO-A2',
        'name' => 'Asset A2',
        'branch_id' => $branchA->id,
        'qr_token' => Str::random(40),
    ]);

    $assetB1 = Asset::query()->create([
        'organization_id' => $organizationB->id,
        'code' => 'AST-WO-B1',
        'name' => 'Asset B1',
        'branch_id' => $branchB->id,
        'qr_token' => Str::random(40),
    ]);

    $first = AssetMaintenance::query()->create([
        'organization_id' => $organizationA->id,
        'asset_id' => $assetA1->id,
        'type' => 'corrective',
        'source' => 'manual',
        'priority' => 'normal',
        'branch_id' => $branchA->id,
        'description' => 'First',
        'status' => 'open',
    ]);

    $second = AssetMaintenance::query()->create([
        'organization_id' => $organizationA->id,
        'asset_id' => $assetA2->id,
        'type' => 'corrective',
        'source' => 'manual',
        'priority' => 'normal',
        'branch_id' => $branchA->id,
        'description' => 'Second',
        'status' => 'open',
    ]);

    app(OrganizationContext::class)->setCurrentOrganizationId($organizationB->id);

    $third = AssetMaintenance::query()->create([
        'organization_id' => $organizationB->id,
        'asset_id' => $assetB1->id,
        'type' => 'corrective',
        'source' => 'manual',
        'priority' => 'normal',
        'branch_id' => $branchB->id,
        'description' => 'Third',
        'status' => 'open',
    ]);

    expect($first->work_order_number)->toBe('WO-'.now()->year.'-001')
        ->and($second->work_order_number)->toBe('WO-'.now()->year.'-002')
        ->and($third->work_order_number)->toBe('WO-'.now()->year.'-001');
});

test('assigned technician can view and update progress, other users cannot', function () {
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

    TechnicianProfile::query()->create([
        'organization_id' => $organization->id,
        'user_id' => $technician->id,
        'branch_id' => null,
        'is_active' => true,
        'is_available' => true,
        'skills' => ['network'],
    ]);

    $other = User::factory()->inOrganization($organization, role: 'Member')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $branch = Branch::factory()->create(['organization_id' => $organization->id]);
    $asset = Asset::query()->create([
        'organization_id' => $organization->id,
        'code' => 'AST-JKT-2026-1003',
        'name' => 'AP A',
        'branch_id' => $branch->id,
        'qr_token' => Str::random(40),
    ]);

    $workOrder = AssetMaintenance::query()->create([
        'organization_id' => $organization->id,
        'asset_id' => $asset->id,
        'type' => 'corrective',
        'source' => 'manual',
        'priority' => 'normal',
        'branch_id' => $branch->id,
        'description' => 'Fix AP',
        'status' => 'open',
        'assigned_to' => $technician->id,
    ]);

    actingAs($technician)->get(route('work-orders.show', $workOrder))->assertOk();

    actingAs($technician)
        ->patch(route('work-orders.update', $workOrder), ['status' => 'in_progress'])
        ->assertRedirect();

    $workOrder->refresh();
    expect($workOrder->status)->toBe('in_progress');

    actingAs($other)
        ->patch(route('work-orders.update', $workOrder), ['status' => 'completed', 'internal_notes' => 'No access'])
        ->assertForbidden();
});

test('staff only sees work orders for assigned or visible assets', function () {
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
        'code' => 'AST-WO-0001',
        'name' => 'Visible Asset',
        'branch_id' => $branch->id,
        'department_id' => $visibleDepartment->id,
        'qr_token' => Str::random(40),
    ]);

    $hiddenAsset = Asset::query()->create([
        'organization_id' => $organization->id,
        'code' => 'AST-WO-0002',
        'name' => 'Hidden Asset',
        'branch_id' => $branch->id,
        'department_id' => $hiddenDepartment->id,
        'qr_token' => Str::random(40),
    ]);

    $visibleWorkOrder = AssetMaintenance::query()->create([
        'organization_id' => $organization->id,
        'asset_id' => $visibleAsset->id,
        'type' => 'corrective',
        'source' => 'manual',
        'priority' => 'normal',
        'branch_id' => $branch->id,
        'description' => 'Visible work order',
        'status' => 'open',
    ]);

    $hiddenWorkOrder = AssetMaintenance::query()->create([
        'organization_id' => $organization->id,
        'asset_id' => $hiddenAsset->id,
        'type' => 'corrective',
        'source' => 'manual',
        'priority' => 'normal',
        'branch_id' => $branch->id,
        'description' => 'Hidden work order',
        'status' => 'open',
    ]);

    actingAs($staff)
        ->get(route('work-orders.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('items.data', 1)
            ->where('items.data.0.id', $visibleWorkOrder->id)
        );

    actingAs($staff)->get(route('work-orders.show', $visibleWorkOrder))->assertOk();
    actingAs($staff)->get(route('work-orders.show', $hiddenWorkOrder))->assertForbidden();
});

test('creating a work order with checklist template clones tasks', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $owner = User::factory()->inOrganization($organization, role: 'Owner')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $branch = Branch::factory()->create(['organization_id' => $organization->id]);
    $asset = Asset::query()->create([
        'organization_id' => $organization->id,
        'code' => 'AST-JKT-2026-1004',
        'name' => 'Printer A',
        'branch_id' => $branch->id,
        'qr_token' => Str::random(40),
    ]);

    $template = MaintenanceChecklistTemplate::query()->create([
        'organization_id' => $organization->id,
        'name' => 'Printer Checklist',
        'is_active' => true,
    ]);

    MaintenanceChecklistTemplateItem::query()->create([
        'template_id' => $template->id,
        'title' => 'Check toner',
        'is_required' => true,
        'sort_order' => 0,
    ]);

    actingAs($owner)
        ->post(route('work-orders.store'), [
            'asset_id' => $asset->id,
            'description' => 'Printer maintenance',
            'source' => 'manual',
            'type' => 'preventive',
            'priority' => 'normal',
            'checklist_template_id' => $template->id,
        ])
        ->assertRedirect();

    $workOrder = AssetMaintenance::query()->latest('id')->firstOrFail();
    expect($workOrder->tasks()->count())->toBe(1);
});

test('completing or cancelling a work order requires a reason', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $owner = User::factory()->inOrganization($organization, role: 'Owner')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $branch = Branch::factory()->create(['organization_id' => $organization->id]);
    $asset = Asset::query()->create([
        'organization_id' => $organization->id,
        'code' => 'AST-WO-REASON',
        'name' => 'Asset Reason',
        'branch_id' => $branch->id,
        'qr_token' => Str::random(40),
    ]);

    $workOrder = AssetMaintenance::query()->create([
        'organization_id' => $organization->id,
        'asset_id' => $asset->id,
        'type' => 'corrective',
        'source' => 'manual',
        'priority' => 'normal',
        'branch_id' => $branch->id,
        'description' => 'Needs reason',
        'status' => 'open',
    ]);

    actingAs($owner)
        ->patch(route('work-orders.update', $workOrder), ['status' => 'completed'])
        ->assertSessionHasErrors('internal_notes');

    actingAs($owner)
        ->patch(route('work-orders.update', $workOrder), ['status' => 'cancelled'])
        ->assertSessionHasErrors('internal_notes');

    actingAs($owner)
        ->patch(route('work-orders.update', $workOrder), ['status' => 'completed', 'internal_notes' => 'Resolved and verified'])
        ->assertRedirect();

    $workOrder->refresh();
    expect($workOrder->status)->toBe('completed')
        ->and($workOrder->internal_notes)->toBe('Resolved and verified')
        ->and($workOrder->completed_at)->not->toBeNull();
});

test('category default maintenance interval creates a schedule when asset is created', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $owner = User::factory()->inOrganization($organization, role: 'Owner')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $branch = Branch::factory()->create(['organization_id' => $organization->id]);
    $category = AssetCategory::query()->create([
        'organization_id' => $organization->id,
        'name' => 'Networking',
        'code' => 'NET',
        'depreciation_method' => 'straight_line',
        'category_default_maintenance_interval' => 30,
    ]);

    actingAs($owner)
        ->post(route('assets.store'), [
            'name' => 'Switch Core',
            'branch_id' => $branch->id,
            'asset_category_id' => $category->id,
            'purchase_date' => '2026-01-15',
        ])
        ->assertRedirect();

    $asset = Asset::query()->latest('id')->firstOrFail();
    $schedule = MaintenanceSchedule::query()->where('asset_id', $asset->id)->first();

    expect($schedule)->not->toBeNull()
        ->and($schedule?->name)->toBe('Preventive Maintenance')
        ->and($schedule?->interval_days)->toBe(30)
        ->and($schedule?->next_due_at?->toDateString())->toBe('2026-02-14');
});

test('task completion recalculates work order progress but does not change completed work orders', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $owner = User::factory()->inOrganization($organization, role: 'Owner')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $branch = Branch::factory()->create(['organization_id' => $organization->id]);
    $asset = Asset::query()->create([
        'organization_id' => $organization->id,
        'code' => 'AST-WO-PROGRESS',
        'name' => 'Asset Progress',
        'branch_id' => $branch->id,
        'qr_token' => Str::random(40),
    ]);

    $workOrder = AssetMaintenance::query()->create([
        'organization_id' => $organization->id,
        'asset_id' => $asset->id,
        'type' => 'preventive',
        'source' => 'manual',
        'priority' => 'normal',
        'branch_id' => $branch->id,
        'description' => 'Checklist work',
        'status' => 'open',
    ]);

    $taskA = AssetMaintenanceTask::query()->create([
        'organization_id' => $organization->id,
        'maintenance_id' => $workOrder->id,
        'title' => 'Task A',
        'is_required' => true,
        'sort_order' => 1,
    ]);

    $taskB = AssetMaintenanceTask::query()->create([
        'organization_id' => $organization->id,
        'maintenance_id' => $workOrder->id,
        'title' => 'Task B',
        'is_required' => true,
        'sort_order' => 2,
    ]);

    actingAs($owner)
        ->patch(route('work-orders.tasks.update', [$workOrder, $taskA]), ['completed' => true])
        ->assertRedirect();

    $workOrder->refresh();
    expect($workOrder->progress_percent)->toBe(50);

    actingAs($owner)
        ->patch(route('work-orders.update', $workOrder), ['status' => 'completed', 'internal_notes' => 'Done'])
        ->assertRedirect();

    actingAs($owner)
        ->patch(route('work-orders.tasks.update', [$workOrder, $taskB]), ['completed' => true])
        ->assertRedirect();

    $workOrder->refresh();
    expect($workOrder->progress_percent)->toBe(100);
});

test('overdue response SLA escalates and notifies owners and PIC email', function () {
    Notification::fake();

    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $owner = User::factory()->inOrganization($organization, role: 'Owner')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $branch = Branch::factory()->create(['organization_id' => $organization->id]);
    $pic = PersonInCharge::query()->create([
        'organization_id' => $organization->id,
        'name' => 'Budi',
        'email' => 'pic@example.com',
    ]);

    $asset = Asset::query()->create([
        'organization_id' => $organization->id,
        'code' => 'AST-JKT-2026-1005',
        'name' => 'Server A',
        'branch_id' => $branch->id,
        'person_in_charge_id' => $pic->id,
        'qr_token' => Str::random(40),
    ]);

    $workOrder = AssetMaintenance::query()->create([
        'organization_id' => $organization->id,
        'asset_id' => $asset->id,
        'type' => 'corrective',
        'source' => 'manual',
        'priority' => 'high',
        'branch_id' => $branch->id,
        'description' => 'Server overheating',
        'status' => 'open',
        'sla_response_hours' => 1,
        'sla_resolution_hours' => 4,
        'response_due_at' => now()->subHour(),
        'resolution_due_at' => now()->addHour(),
    ]);

    EscalateOverdueWorkOrdersJob::dispatchSync($organization->id);

    $workOrder->refresh();
    expect($workOrder->escalation_level)->toBeGreaterThan(0);

    Notification::assertSentTo($owner, WorkOrderResponseSlaBreachedNotification::class);
    Notification::assertSentOnDemand(WorkOrderResponseSlaBreachedNotification::class);
});
