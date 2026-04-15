<?php

namespace App\Models\Concerns;

use App\Models\Organization;
use App\Services\OrganizationContext;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait BelongsToOrganization
{
    protected static function bootBelongsToOrganization(): void
    {
        static::addGlobalScope('organization', function (Builder $builder): void {
            $organizationId = app(OrganizationContext::class)->currentOrganizationId();

            if ($organizationId === null) {
                $user = auth()->user();

                if ($user !== null && $user->current_organization_id !== null) {
                    $candidateOrganizationId = (int) $user->current_organization_id;

                    $isMember = $user->organizations()
                        ->whereKey($candidateOrganizationId)
                        ->wherePivot('is_active', true)
                        ->exists();

                    if ($isMember) {
                        $organizationId = $candidateOrganizationId;
                    }
                }
            }

            if ($organizationId === null) {
                $builder->whereRaw('1 = 0');

                return;
            }

            $builder->where($builder->getModel()->getTable().'.organization_id', $organizationId);
        });

        static::creating(function (Model $model): void {
            if ($model->getAttribute('organization_id') !== null) {
                return;
            }

            $organizationId = app(OrganizationContext::class)->currentOrganizationId();

            if ($organizationId === null) {
                $user = auth()->user();

                if ($user !== null && $user->current_organization_id !== null) {
                    $candidateOrganizationId = (int) $user->current_organization_id;

                    $isMember = $user->organizations()
                        ->whereKey($candidateOrganizationId)
                        ->wherePivot('is_active', true)
                        ->exists();

                    if ($isMember) {
                        $organizationId = $candidateOrganizationId;
                    }
                }
            }

            if ($organizationId === null) {
                return;
            }

            $model->setAttribute('organization_id', $organizationId);
        });
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }
}
