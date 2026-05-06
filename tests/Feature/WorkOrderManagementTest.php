<?php

use App\Jobs\EscalateOverdueWorkOrdersJob;
use App\Jobs\GenerateWorkOrdersFromSchedulesJob;
use App\Models\Asset;
use App\Models\AssetMaintenance;
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
        ->and($workOrder->type)->toBe('corrective');
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
        ->patch(route('work-orders.update', $workOrder), ['status' => 'completed'])
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
