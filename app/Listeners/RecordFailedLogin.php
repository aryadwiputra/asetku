<?php

namespace App\Listeners;

use App\Models\UserLoginEvent;
use Illuminate\Auth\Events\Failed;

class RecordFailedLogin
{
    public function handle(Failed $event): void
    {
        $request = request();

        /** @var mixed $credentials */
        $credentials = $event->credentials;

        $email = is_array($credentials) ? ($credentials['email'] ?? null) : null;

        UserLoginEvent::query()->create([
            'user_id' => $event->user?->getAuthIdentifier(),
            'email' => is_string($email) ? $email : null,
            'event' => 'login_failed',
            'auth_method' => 'password',
            'ip' => $request?->ip(),
            'user_agent' => $request?->userAgent(),
            'metadata' => null,
            'occurred_at' => now(),
        ]);
    }
}
