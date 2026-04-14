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

        $organizationId = $user->current_organization_id === null ? null : (int) $user->current_organization_id;

        if ($organizationId === null) {
            $membership = $user->organizations()
                ->wherePivot('is_active', true)
                ->orderBy('organization_user.created_at')
                ->first();

            if ($membership === null) {
                abort(403, 'No active organization membership.');
            }

            $organizationId = (int) $membership->id;

            $user->forceFill(['current_organization_id' => $organizationId])->saveQuietly();
        } else {
            $isMember = $user->organizations()
                ->whereKey($organizationId)
                ->wherePivot('is_active', true)
                ->exists();

            if (! $isMember) {
                abort(403, 'Current organization is not accessible.');
            }
        }

        app(OrganizationContext::class)->setCurrentOrganizationId($organizationId);

        return $next($request);
    }
}
