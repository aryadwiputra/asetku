<?php

namespace App\Listeners;

use App\Models\UserLoginEvent;
use Illuminate\Auth\Events\Logout;

class RecordLogout
{
    public function handle(Logout $event): void
    {
        $request = request();

        UserLoginEvent::query()->create([
            'user_id' => $event->user?->getAuthIdentifier(),
            'email' => $event->user?->email,
            'event' => 'logout',
            'auth_method' => (string) session()->get('auth.method', 'password'),
            'ip' => $request?->ip(),
            'user_agent' => $request?->userAgent(),
            'metadata' => null,
            'occurred_at' => now(),
        ]);
    }
}
