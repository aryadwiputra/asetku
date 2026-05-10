<?php

use App\Models\NotificationPreference;
use App\Models\Organization;
use App\Models\User;
use App\Notifications\AuditFindingSubmittedNotification;
use App\Notifications\ImportantSecurityNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\AnonymousNotifiable;

test('important security notification is queued', function () {
    expect(new ImportantSecurityNotification(
        title: 'Security alert',
        body: 'Your password was changed.',
        url: '/profile#security',
    ))->toBeInstanceOf(ShouldQueue::class);
});

test('important security notification uses mail only for anonymous recipients', function () {
    $notification = new ImportantSecurityNotification(
        title: 'Security alert',
        body: 'Your password was changed.',
        url: '/profile#security',
    );

    expect($notification->via(new AnonymousNotifiable))
        ->toBe(['mail']);
});

test('audit finding submitted notification type is registered for preferences', function () {
    $entry = collect(config('notification_types'))
        ->first(fn (mixed $item) => is_array($item) && ($item['key'] ?? null) === 'audit.finding_submitted');

    expect($entry)->toBeArray()
        ->and($entry['class'] ?? null)->toBe(AuditFindingSubmittedNotification::class)
        ->and($entry['default_channels']['database'] ?? null)->toBeTrue()
        ->and($entry['default_channels']['mail'] ?? null)->toBeTrue();
});

test('audit finding submitted preferences can be saved', function () {
    $organization = Organization::factory()->create();
    $user = User::factory()->create([
        'current_organization_id' => $organization->id,
    ]);

    NotificationPreference::query()->create([
        'organization_id' => $organization->id,
        'user_id' => $user->id,
        'type_key' => 'audit.finding_submitted',
        'channels' => [
            'database' => true,
            'mail' => false,
            'slack' => false,
        ],
    ]);

    $preference = NotificationPreference::withoutGlobalScopes()
        ->where('user_id', $user->id)
        ->where('type_key', 'audit.finding_submitted')
        ->first();

    expect($preference)->not->toBeNull()
        ->and($preference?->channels['mail'] ?? null)->toBeFalse();
});
