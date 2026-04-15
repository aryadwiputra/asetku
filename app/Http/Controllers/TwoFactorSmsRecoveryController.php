<?php

namespace App\Http\Controllers;

use App\Contracts\SmsSender;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Laravel\Fortify\Http\Requests\TwoFactorLoginRequest;

class TwoFactorSmsRecoveryController extends Controller
{
    public function store(TwoFactorLoginRequest $request, SmsSender $sms): RedirectResponse
    {
        if (! $request->hasChallengedUser()) {
            abort(404);
        }

        $user = $request->challengedUser();

        if (! $user->phone_number || ! $user->phone_verified_at) {
            throw ValidationException::withMessages([
                'recovery_code' => __('auth.two_factor.sms_unavailable'),
            ]);
        }

        $key = 'two-factor-sms:'.$user->getAuthIdentifier();

        if (RateLimiter::tooManyAttempts($key, 1)) {
            throw ValidationException::withMessages([
                'recovery_code' => __('auth.two_factor.sms_rate_limited'),
            ]);
        }

        RateLimiter::hit($key, 60);

        $codes = (array) $user->recoveryCodes();

        $code = $codes[0] ?? null;

        if (! is_string($code) || $code === '') {
            throw ValidationException::withMessages([
                'recovery_code' => __('auth.two_factor.no_recovery_codes'),
            ]);
        }

        $sms->send((string) $user->phone_number, "Recovery code: {$code}");

        $user->forceFill(['last_two_factor_sms_sent_at' => now()])->saveQuietly();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('auth.two_factor.sms_sent')]);

        return back();
    }
}
