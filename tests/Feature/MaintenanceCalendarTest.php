<?php

use App\Models\Asset;
use App\Models\AssetHistory;
use App\Models\Branch;
use App\Models\CalendarFeed;
use App\Models\MaintenanceSchedule;
use App\Models\MaintenanceScheduleReminder;
use App\Models\Organization;
use App\Models\User;
use App\Notifications\MaintenanceScheduleDueInSevenDaysNotification;
use App\Services\OrganizationContext;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Notification;

use function Pest\Laravel\actingAs;

test('events endpoint generates occurrences and supports filters', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $user = User::factory()->inOrganization($organization, role: 'Member')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $branch = Branch::factory()->create(['organization_id' => $organization->id]);

    $asset = Asset::query()->create([
        'organization_id' => $organization->id,
        'code' => 'AST-CAL-001',
        'name' => 'Calendar Asset',
        'branch_id' => $branch->id,
    ]);

    $technician = User::factory()->inOrganization($organization, role: 'Member')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    MaintenanceSchedule::query()->create([
        'organization_id' => $organization->id,
        'asset_id' => $asset->id,
        'name' => 'PM Weekly',
        'interval_days' => 7,
        'next_due_at' => CarbonImmutable::parse('2026-04-01')->toDateString(),
        'assigned_to' => $technician->id,
        'is_active' => true,
    ]);

    actingAs($user)
        ->get(route('maintenance-calendar.events', [
            'start' => '2026-04-01',
            'end' => '2026-05-01',
        ]))
        ->assertOk()
        ->assertJsonCount(5);

    actingAs($user)
        ->get(route('maintenance-calendar.events', [
            'start' => '2026-04-01',
            'end' => '2026-05-01',
            'assigned_to' => $technician->id,
        ]))
        ->assertOk()
        ->assertJsonCount(5);

    actingAs($user)
        ->get(route('maintenance-calendar.events', [
            'start' => '2026-04-01',
            'end' => '2026-05-01',
            'assigned_to' => $technician->id + 999,
        ]))
        ->assertOk()
        ->assertJsonCount(0);
});

test('reschedule endpoint updates next_due_at and records audit history', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $user = User::factory()->inOrganization($organization, role: 'Owner')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $branch = Branch::factory()->create(['organization_id' => $organization->id]);

    $asset = Asset::query()->create([
        'organization_id' => $organization->id,
        'code' => 'AST-CAL-002',
        'name' => 'Schedule Asset',
        'branch_id' => $branch->id,
    ]);

    $schedule = MaintenanceSchedule::query()->create([
        'organization_id' => $organization->id,
        'asset_id' => $asset->id,
        'name' => 'PM Monthly',
        'interval_days' => 30,
        'next_due_at' => CarbonImmutable::parse('2026-04-15')->toDateString(),
        'is_active' => true,
    ]);

    actingAs($user)
        ->patchJson(route('maintenance-schedules.reschedule', $schedule), [
            'next_due_at' => '2026-04-20',
            'reason' => 'Rescheduled from calendar',
        ])
        ->assertOk();

    $schedule->refresh();
    expect($schedule->next_due_at?->toDateString())->toBe('2026-04-20');

    expect(
        AssetHistory::query()
            ->where('asset_id', $asset->id)
            ->where('action', 'maintenance_schedule_rescheduled')
            ->exists()
    )->toBeTrue();
});

test('reminder command sends notifications and dedupes by schedule and due date', function () {
    Notification::fake();

    CarbonImmutable::setTestNow(CarbonImmutable::parse('2026-04-27 09:00:00'));

    $organization = Organization::factory()->create(['timezone' => 'Asia/Jakarta']);
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $owner = User::factory()->inOrganization($organization, role: 'Owner')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);
    $admin = User::factory()->inOrganization($organization, role: 'Admin')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $branch = Branch::factory()->create(['organization_id' => $organization->id]);
    $asset = Asset::query()->create([
        'organization_id' => $organization->id,
        'code' => 'AST-CAL-003',
        'name' => 'Reminder Asset',
        'branch_id' => $branch->id,
    ]);

    $technician = User::factory()->inOrganization($organization, role: 'Member')->create([
        'email_verified_at' => now(),
        'current_organization_id' => $organization->id,
    ]);

    $dueDate = CarbonImmutable::now($organization->timezone)->startOfDay()->addDays(7)->toDateString();

    MaintenanceSchedule::query()->create([
        'organization_id' => $organization->id,
        'asset_id' => $asset->id,
        'name' => 'PM Weekly',
        'interval_days' => 7,
        'next_due_at' => $dueDate,
        'assigned_to' => $technician->id,
        'is_active' => true,
    ]);

    $this->artisan('maintenance-schedules:send-reminders')->assertSuccessful();

    Notification::assertSentTo($owner, MaintenanceScheduleDueInSevenDaysNotification::class);
    Notification::assertSentTo($admin, MaintenanceScheduleDueInSevenDaysNotification::class);
    Notification::assertSentTo($technician, MaintenanceScheduleDueInSevenDaysNotification::class);

    expect(MaintenanceScheduleReminder::query()->count())->toBe(1);

    $this->artisan('maintenance-schedules:send-reminders')->assertSuccessful();

    expect(MaintenanceScheduleReminder::query()->count())->toBe(1);

    CarbonImmutable::setTestNow();
});

test('ICS feed returns calendar content', function () {
    $organization = Organization::factory()->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $branch = Branch::factory()->create(['organization_id' => $organization->id]);

    $asset = Asset::query()->create([
        'organization_id' => $organization->id,
        'code' => 'AST-CAL-004',
        'name' => 'ICS Asset',
        'branch_id' => $branch->id,
    ]);

    $schedule = MaintenanceSchedule::query()->create([
        'organization_id' => $organization->id,
        'asset_id' => $asset->id,
        'name' => 'PM Weekly',
        'interval_days' => 7,
        'next_due_at' => CarbonImmutable::now()->addDays(1)->toDateString(),
        'is_active' => true,
    ]);

    $token = 'test-token-ics-123';
    CalendarFeed::query()->create([
        'organization_id' => $organization->id,
        'user_id' => User::factory()->create()->id,
        'type' => 'maintenance',
        'token_hash' => hash('sha256', $token),
    ]);

    $response = $this->get(route('maintenance-calendar.feed', ['token' => $token]));
    $response->assertOk()->assertHeader('content-type', 'text/calendar; charset=utf-8');

    $body = (string) $response->getContent();
    expect($body)->toContain('BEGIN:VCALENDAR');
    expect($body)->toContain('BEGIN:VEVENT');
    expect($body)->toContain("maintenance-schedule-{$schedule->id}-");
});
