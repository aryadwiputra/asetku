<?php

namespace App\Http\Middleware;

use App\Models\Organization;
use App\Services\OrganizationAccessPolicyEvaluator;
use App\Services\OrganizationContext;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnforceOrganizationAccessPolicy
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $organizationId = app(OrganizationContext::class)->currentOrganizationId();

        if ($organizationId === null) {
            return $next($request);
        }

        /** @var Organization|null $organization */
        $organization = Organization::query()
            ->whereKey($organizationId)
            ->first(['id', 'timezone', 'access_timezone', 'access_ip_allowlist', 'access_working_hours', 'is_active']);

        if ($organization === null || ! $organization->is_active) {
            return $next($request);
        }

        $allowed = app(OrganizationAccessPolicyEvaluator::class)->isRequestAllowed($organization, $request);

        if ($allowed) {
            return $next($request);
        }

        Auth::logout();

        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        if ($request->expectsJson()) {
            abort(403, __('auth.errors.access_restricted'));
        }

        return redirect()
            ->route('login')
            ->with('status', __('auth.errors.access_restricted'));
    }
}
