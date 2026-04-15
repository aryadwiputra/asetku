<?php

use App\Contracts\SmsSender;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;

beforeEach(function () {
    config(['cache.stores.redis.driver' => 'array']);
    $this->seed(RolePermissionSeeder::class);
});

test('two factor sms recovery sends a recovery code when challenged', function () {
    $sent = [];

    app()->instance(SmsSender::class, new class($sent) implements SmsSender {
        /**
         * @param  array<int, array{to: string, message: string}>  $sent
         */
        public function __construct(private array &$sent)
        {
        }

        public function send(string $phoneNumber, string $message): void
        {
            $this->sent[] = ['to' => $phoneNumber, 'message' => $message];
        }
    });

    $user = User::factory()->withTwoFactor()->create([
        'phone_number' => '+628111111111',
        'phone_verified_at' => now(),
    ]);

    $this->withSession(['login.id' => $user->id])
        ->post(route('two-factor.sms-recovery'))
        ->assertRedirect();

    $user->refresh();

    expect($user->last_two_factor_sms_sent_at)->not->toBeNull();
    expect($sent)->toHaveCount(1)
        ->and($sent[0]['to'])->toBe('+628111111111')
        ->and($sent[0]['message'])->toContain('Recovery code:');
});
