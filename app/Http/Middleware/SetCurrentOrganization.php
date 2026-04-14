<?php

namespace App\Http\Middleware;

use App\Services\OrganizationContext;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetCurrentOrganization
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        app(OrganizationContext::class)->setCurrentOrganizationId(null);

        $user = $request->user();

        if (! $user) {
            return $next($request);
        }

        if (! is_int($user->organization_id) && ! is_string($user->organization_id) && $user->organization_id !== null) {
            abort(500, 'Invalid organization_id.');
        }

        $organizationId = $user->organization_id === null ? null : (int) $user->organization_id;

        if ($organizationId === null) {
            abort(403, 'Organization is not set for this user.');
        }

        app(OrganizationContext::class)->setCurrentOrganizationId($organizationId);

        return $next($request);
    }
}
