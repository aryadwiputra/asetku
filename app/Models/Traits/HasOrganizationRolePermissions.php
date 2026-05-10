<?php

namespace App\Models\Traits;

use App\Enums\OrganizationMemberRole;
use App\Services\OrganizationContext;
use App\Services\OrganizationRolePermissionMap;
use Spatie\Permission\Exceptions\PermissionDoesNotExist;
use Spatie\Permission\Models\Permission;

trait HasOrganizationRolePermissions
{
    public function checkPermissionTo(string|int|Permission|\BackedEnum $permission, ?string $guardName = null): bool
    {
        $permissionString = $permission instanceof \BackedEnum ? $permission->value : (string) $permission;
        $guard = $guardName ?? $this->getDefaultGuardName();

        if (method_exists($this, 'getPermissionClass') && method_exists($this, 'hasDirectPermission')) {
            try {
                $permissionModel = $this->getPermissionClass()::findByName($permissionString, $guard);
                $spatieHasPermission = $this->hasDirectPermission($permissionModel) || $this->hasPermissionViaRole($permissionModel);

                if ($spatieHasPermission) {
                    return true;
                }
            } catch (PermissionDoesNotExist) {
                // Ignore plain Gate abilities like "update" so policies can handle them.
            }
        }

        $organizationId = $this->getCurrentOrganizationIdForPermissionCheck();

        if ($organizationId === null) {
            return false;
        }

        $orgRole = $this->organizationRole($organizationId);

        if ($orgRole === null) {
            return false;
        }

        $orgRoleEnum = OrganizationMemberRole::tryFrom($orgRole);

        if ($orgRoleEnum === null) {
            return false;
        }

        $orgPermissions = OrganizationRolePermissionMap::permissionsForRole($orgRoleEnum);

        return self::permissionMatchesOrgRole((string) $permission, $orgPermissions);
    }

    protected function getCurrentOrganizationIdForPermissionCheck(): ?int
    {
        $context = app(OrganizationContext::class);
        $organizationId = $context->currentOrganizationId();

        if ($organizationId !== null) {
            return $organizationId;
        }

        $organizationId = $this->current_organization_id ?? $this->organization_id;

        if ($organizationId !== null) {
            return (int) $organizationId;
        }

        $firstMembership = $this->organizations()
            ->wherePivot('is_active', true)
            ->first();

        return $firstMembership?->getKey();
    }

    /**
     * @param  array<string, array<string>|true>  $orgPermissions
     */
    protected static function permissionMatchesOrgRole(string $permission, array $orgPermissions): bool
    {
        [$group, $action] = explode('.', $permission) + [1 => null];

        if ($action === null) {
            return ($orgPermissions[$permission] ?? false) === true;
        }

        $actions = $orgPermissions[$group] ?? [];

        return is_array($actions) && in_array($action, $actions, true);
    }

    public function hasOrgRolePermission(string $permission, int $organizationId): bool
    {
        $orgRole = $this->organizationRole($organizationId);

        if ($orgRole === null) {
            return false;
        }

        $orgRoleEnum = OrganizationMemberRole::tryFrom($orgRole);

        if ($orgRoleEnum === null) {
            return false;
        }

        $orgPermissions = OrganizationRolePermissionMap::permissionsForRole($orgRoleEnum);

        return self::permissionMatchesOrgRole($permission, $orgPermissions);
    }

    /**
     * @return list<string>
     */
    public function getOrgRolePermissions(int $organizationId): array
    {
        $orgRole = $this->organizationRole($organizationId);

        if ($orgRole === null) {
            return [];
        }

        $orgRoleEnum = OrganizationMemberRole::tryFrom($orgRole);

        if ($orgRoleEnum === null) {
            return [];
        }

        $permissionsMap = OrganizationRolePermissionMap::permissionsForRole($orgRoleEnum);

        return OrganizationRolePermissionMap::permissionsToSpatieFormat($permissionsMap);
    }
}
