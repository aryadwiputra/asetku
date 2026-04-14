<?php

use App\Models\Asset;
use App\Models\Branch;
use App\Models\DatabaseNotification;
use App\Models\Department;
use App\Models\NotificationPreference;
use App\Models\Organization;
use App\Models\Setting;
use App\Models\User;
use App\Services\OrganizationContext;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;

test('global scope filters asset-domain queries by current organization', function () {
    $organizationA = Organization::factory()->create(['slug' => 'org-a']);
    $organizationB = Organization::factory()->create(['slug' => 'org-b']);

    app(OrganizationContext::class)->setCurrentOrganizationId($organizationA->id);
    $branchA = Branch::query()->create(['name' => 'Branch A', 'code' => 'A']);
    $departmentA = Department::query()->create(['branch_id' => $branchA->id, 'name' => 'Dept A', 'code' => 'DA']);
    Asset::query()->create(['code' => 'AST-1', 'name' => 'Asset A', 'qr_token' => Str::uuid()->toString()]);

    app(OrganizationContext::class)->setCurrentOrganizationId($organizationB->id);
    $branchB = Branch::query()->create(['name' => 'Branch B', 'code' => 'B']);
    $departmentB = Department::query()->create(['branch_id' => $branchB->id, 'name' => 'Dept B', 'code' => 'DB']);
    Asset::query()->create(['code' => 'AST-1', 'name' => 'Asset B', 'qr_token' => Str::uuid()->toString()]);

    app(OrganizationContext::class)->setCurrentOrganizationId($organizationA->id);
    expect(Asset::query()->count())->toBe(1);
    expect(Department::query()->whereKey($departmentA->id)->exists())->toBeTrue();
    expect(Department::query()->whereKey($departmentB->id)->exists())->toBeFalse();

    expect(Asset::withoutGlobalScopes()->count())->toBe(2);
});

test('settings are scoped and cached per organization', function () {
    $organizationA = Organization::factory()->create(['slug' => 'org-a']);
    $organizationB = Organization::factory()->create(['slug' => 'org-b']);

    app(OrganizationContext::class)->setCurrentOrganizationId($organizationA->id);
    settings()->set('app.name', 'Org A', 'string');

    app(OrganizationContext::class)->setCurrentOrganizationId($organizationB->id);
    settings()->set('app.name', 'Org B', 'string');

    app(OrganizationContext::class)->setCurrentOrganizationId($organizationA->id);
    expect(settings('app.name'))->toBe('Org A');
    expect(Setting::query()->where('key', 'app.name')->count())->toBe(1);

    app(OrganizationContext::class)->setCurrentOrganizationId($organizationB->id);
    expect(settings('app.name'))->toBe('Org B');
    expect(Setting::query()->where('key', 'app.name')->count())->toBe(1);

    expect(Setting::withoutGlobalScopes()->where('key', 'app.name')->count())->toBe(2);
});

test('notification preferences are scoped per organization', function () {
    $organizationA = Organization::factory()->create(['slug' => 'org-a']);
    $organizationB = Organization::factory()->create(['slug' => 'org-b']);

    $userA = User::factory()->inOrganization($organizationA)->create();
    $userB = User::factory()->inOrganization($organizationB)->create();

    app(OrganizationContext::class)->setCurrentOrganizationId($organizationA->id);
    NotificationPreference::query()->create([
        'user_id' => $userA->id,
        'type_key' => 'demo',
        'channels' => ['database'],
    ]);

    app(OrganizationContext::class)->setCurrentOrganizationId($organizationB->id);
    NotificationPreference::query()->create([
        'user_id' => $userB->id,
        'type_key' => 'demo',
        'channels' => ['database'],
    ]);

    app(OrganizationContext::class)->setCurrentOrganizationId($organizationA->id);
    expect(NotificationPreference::query()->count())->toBe(1);
    expect(NotificationPreference::withoutGlobalScopes()->count())->toBe(2);
});

test('database notifications are stored and scoped by organization', function () {
    $organization = Organization::factory()->create(['slug' => 'org-a']);
    $user = User::factory()->inOrganization($organization)->create();

    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $user->notify(new class extends Notification
    {
        public function via(object $notifiable): array
        {
            return ['database'];
        }

        /**
         * @return array<string, mixed>
         */
        public function toArray(object $notifiable): array
        {
            return ['message' => 'hello'];
        }
    });

    $notification = DatabaseNotification::query()->first();

    expect($notification)->not->toBeNull();
    expect((int) $notification->organization_id)->toBe($organization->id);
    expect(DatabaseNotification::withoutGlobalScopes()->count())->toBe(1);
});
