<?php

use App\Jobs\RunDepreciationJob;
use App\Models\Asset;
use App\Models\AssetDepreciationEntry;
use App\Models\AssetDepreciationRun;
use App\Models\Organization;
use App\Models\PersonInCharge;
use App\Models\User;
use App\Notifications\AssetResidualValueReachedNotification;
use App\Services\AssetDepreciationCalculator;
use App\Services\OrganizationContext;
use Illuminate\Support\Facades\Notification;

it('calculates double declining depreciation more aggressive than straight-line in early months', function () {
    $organization = Organization::factory()->create();
    $user = User::factory()->inOrganization($organization, role: 'Owner')->create();
    test()->actingAs($user);
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $periodEnd = now()->startOfMonth()->subDay();
    $periodStart = $periodEnd->startOfMonth();

    $purchaseDate = $periodStart->subMonths(2)->setDay(5);

    $straight = Asset::query()->create([
        'code' => 'AST-SL-0001',
        'name' => 'Straight-line Asset',
        'purchase_date' => $purchaseDate->toDateString(),
        'cost' => 1200,
        'residual_value' => 0,
        'useful_life_months' => 12,
        'depreciation_method' => 'straight_line',
    ]);

    $ddb = Asset::query()->create([
        'code' => 'AST-DDB-0001',
        'name' => 'Double Declining Asset',
        'purchase_date' => $purchaseDate->toDateString(),
        'cost' => 1200,
        'residual_value' => 0,
        'useful_life_months' => 12,
        'depreciation_method' => 'double_declining',
    ]);

    $calculator = app(AssetDepreciationCalculator::class);
    $slResult = $calculator->calculateForPeriod($straight, $periodStart->startOfDay(), $periodEnd->endOfDay());
    $ddbResult = $calculator->calculateForPeriod($ddb, $periodStart->startOfDay(), $periodEnd->endOfDay());

    expect($slResult->shouldPost)->toBeTrue()
        ->and($ddbResult->shouldPost)->toBeTrue()
        ->and((float) $ddbResult->depreciationAmount)->toBeGreaterThan((float) $slResult->depreciationAmount);
});

it('posts depreciation entries and updates cached book value', function () {
    $organization = Organization::factory()->create();
    $user = User::factory()->inOrganization($organization, role: 'Owner')->create();
    test()->actingAs($user);
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $periodEnd = now()->startOfMonth()->subDay();
    $periodStart = $periodEnd->startOfMonth();

    $asset = Asset::query()->create([
        'code' => 'AST-SL-0002',
        'name' => 'Asset',
        'purchase_date' => $periodStart->subMonths(2)->setDay(7)->toDateString(),
        'cost' => 1200,
        'residual_value' => 0,
        'useful_life_months' => 12,
        'depreciation_method' => 'straight_line',
    ]);

    $run = AssetDepreciationRun::query()->create([
        'period' => 'monthly',
        'period_start' => $periodStart->toDateString(),
        'period_end' => $periodEnd->toDateString(),
        'status' => 'queued',
        'requested_by' => $user->id,
    ]);

    (new RunDepreciationJob($run->id))->handle();

    $entry = AssetDepreciationEntry::query()
        ->where('asset_id', $asset->id)
        ->whereDate('period_end', $periodEnd->toDateString())
        ->first();

    expect($entry)->not()->toBeNull();

    $asset->refresh();
    expect($asset->book_value_cached)->not()->toBeNull()
        ->and((float) $asset->book_value_cached)->toBe((float) $entry->book_value_end);
});

it('handles units of production: skips without usage and posts with usage logs', function () {
    $organization = Organization::factory()->create();
    $user = User::factory()->inOrganization($organization, role: 'Owner')->create();
    test()->actingAs($user);
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $periodEnd = now()->startOfMonth()->subDay();
    $periodStart = $periodEnd->startOfMonth();

    $asset = Asset::query()->create([
        'code' => 'AST-UOP-0001',
        'name' => 'Units of production asset',
        'purchase_date' => $periodStart->subMonths(3)->setDay(10)->toDateString(),
        'cost' => 1000,
        'residual_value' => 100,
        'useful_life_months' => 12,
        'depreciation_method' => 'units_of_production',
        'production_units_total_estimate' => 90,
        'production_units_unit' => 'hours',
    ]);

    $run = AssetDepreciationRun::query()->create([
        'period' => 'monthly',
        'period_start' => $periodStart->toDateString(),
        'period_end' => $periodEnd->toDateString(),
        'status' => 'queued',
        'requested_by' => $user->id,
    ]);

    (new RunDepreciationJob($run->id))->handle();

    expect(AssetDepreciationEntry::query()->where('asset_id', $asset->id)->count())->toBe(0);

    \App\Models\AssetUsageLog::query()->create([
        'asset_id' => $asset->id,
        'recorded_at' => $periodStart->addDays(1)->toDateString(),
        'units' => 10,
        'unit' => 'hours',
        'notes' => null,
        'created_by' => $user->id,
    ]);

    (new RunDepreciationJob($run->id))->handle();

    expect(AssetDepreciationEntry::query()->where('asset_id', $asset->id)->count())->toBe(1);
});

it('sends notification when an asset reaches residual value', function () {
    Notification::fake();

    $organization = Organization::factory()->create();
    $owner = User::factory()->inOrganization($organization, role: 'Owner')->create();
    test()->actingAs($owner);
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $pic = PersonInCharge::query()->create([
        'name' => 'PIC',
        'email' => 'pic@example.com',
        'phone' => null,
        'notes' => null,
    ]);

    $periodEnd = now()->startOfMonth()->subDay();
    $periodStart = $periodEnd->startOfMonth();

    $asset = Asset::query()->create([
        'code' => 'AST-RES-0001',
        'name' => 'Residual asset',
        'purchase_date' => $periodStart->subMonth()->setDay(15)->toDateString(),
        'cost' => 100,
        'residual_value' => 99,
        'useful_life_months' => 1,
        'depreciation_method' => 'straight_line',
        'person_in_charge_id' => $pic->id,
    ]);

    $run = AssetDepreciationRun::query()->create([
        'period' => 'monthly',
        'period_start' => $periodStart->toDateString(),
        'period_end' => $periodEnd->toDateString(),
        'status' => 'queued',
        'requested_by' => $owner->id,
    ]);

    (new RunDepreciationJob($run->id))->handle();

    Notification::assertSentTo($owner, AssetResidualValueReachedNotification::class);
    Notification::assertSentOnDemand(AssetResidualValueReachedNotification::class);
});

it('allows organization members to view depreciation index', function () {
    $organization = Organization::factory()->create();
    $user = User::factory()->inOrganization($organization, role: 'Member')->create();
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    test()->actingAs($user)
        ->get(route('depreciation.index'))
        ->assertOk();
});
