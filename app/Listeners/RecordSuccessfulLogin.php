<?php

namespace App\Listeners;

use App\Models\UserLoginEvent;
use Illuminate\Auth\Events\Login;

class RecordSuccessfulLogin
{
    public function handle(Login $event): void
    {
        $request = request();
        $authMethod = (string) session()->get('auth.method', 'password');

        UserLoginEvent::query()->create([
            'user_id' => $event->user->getAuthIdentifier(),
            'email' => $event->user->email ?? null,
            'event' => 'login_success',
            'auth_method' => $authMethod,
            'ip' => $request?->ip(),
            'user_agent' => $request?->userAgent(),
            'metadata' => ['remember' => (bool) $event->remember],
            'occurred_at' => now(),
        ]);
    }
}
