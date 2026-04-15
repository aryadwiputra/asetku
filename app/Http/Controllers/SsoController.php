<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Models\User;
use App\Models\UserIdentity;
use App\Services\OrganizationAccessPolicyEvaluator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Laravel\Socialite\Contracts\User as SocialiteUser;
use Laravel\Socialite\Facades\Socialite;

class SsoController extends Controller
{
    public function redirect(string $provider): RedirectResponse
    {
        $provider = $this->validateProvider($provider);

        return Socialite::driver($provider)->redirect();
    }

    public function callback(string $provider): RedirectResponse
    {
        $provider = $this->validateProvider($provider);

        /** @var SocialiteUser $socialUser */
        $socialUser = Socialite::driver($provider)->user();

        $email = $this->resolveEmail($provider, $socialUser);
        $providerUserId = (string) $socialUser->getId();

        if ($email === null || $providerUserId === '') {
            return Redirect::route('login')->withErrors(['email' => __('auth.sso.failed')]);
        }

        $user = User::query()->where('email', $email)->first();

        if ($user === null) {
            return Redirect::route('login')->withErrors(['email' => __('auth.sso.not_registered')]);
        }

        if (! $user->is_active) {
            return Redirect::route('login')->withErrors(['email' => __('auth.sso.suspended')]);
        }

        $organizationId = $user->current_organization_id;

        if ($organizationId !== null) {
            /** @var Organization|null $organization */
            $organization = Organization::query()
                ->whereKey($organizationId)
                ->first(['id', 'timezone', 'access_timezone', 'access_ip_allowlist', 'access_working_hours', 'is_active']);

            if ($organization !== null && $organization->is_active) {
                $allowed = app(OrganizationAccessPolicyEvaluator::class)->isRequestAllowed($organization, request());

                if (! $allowed) {
                    return Redirect::route('login')->withErrors(['email' => __('auth.sso.access_restricted')]);
                }
            }
        }

        $existingIdentity = UserIdentity::query()
            ->where('provider', $provider)
            ->where('provider_user_id', $providerUserId)
            ->first();

        if ($existingIdentity !== null && (int) $existingIdentity->user_id !== (int) $user->id) {
            return Redirect::route('login')->withErrors(['email' => __('auth.sso.identity_taken')]);
        }

        UserIdentity::query()->firstOrCreate([
            'provider' => $provider,
            'provider_user_id' => $providerUserId,
        ], [
            'user_id' => $user->id,
            'email' => $email,
        ]);

        session()->put('auth.method', $provider);
        Auth::login($user, true);

        return Redirect::route('dashboard');
    }

    private function validateProvider(string $provider): string
    {
        if (! in_array($provider, ['google', 'microsoft'], true)) {
            abort(404);
        }

        return $provider;
    }

    private function resolveEmail(string $provider, SocialiteUser $user): ?string
    {
        $email = $user->getEmail();

        if (! is_string($email) || trim($email) === '') {
            $raw = $user->user ?? [];

            $email = is_array($raw) ? ($raw['email'] ?? $raw['mail'] ?? $raw['userPrincipalName'] ?? null) : null;
        }

        if (! is_string($email) || trim($email) === '') {
            return null;
        }

        $email = strtolower(trim($email));

        $raw = $user->user ?? [];

        if ($provider === 'google' && is_array($raw) && array_key_exists('email_verified', $raw) && $raw['email_verified'] !== true) {
            return null;
        }

        return $email;
    }
}
