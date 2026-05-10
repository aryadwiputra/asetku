<?php

namespace App\Services;

use App\Enums\OrganizationMemberRole;

class OrganizationRolePermissionMap
{
    public const PERMISSION_VIEW = 'view';

    public const PERMISSION_CREATE = 'create';

    public const PERMISSION_UPDATE = 'update';

    public const PERMISSION_DELETE = 'delete';

    public const PERMISSION_APPROVE = 'approve';

    public const PERMISSION_EXPORT = 'export';

    public const PERMISSION_MANAGE = 'manage';

    public const PERMISSION_VIEW_ALL = 'view_all';

    /**
     * @return array<string, array<string>|true>
     */
    public static function permissionsForRole(OrganizationMemberRole $role): array
    {
        return match ($role) {
            OrganizationMemberRole::Owner => self::ownerPermissions(),
            OrganizationMemberRole::Admin => self::adminPermissions(),
            OrganizationMemberRole::Manager => self::managerPermissions(),
            OrganizationMemberRole::Member => self::memberPermissions(),
        };
    }

    /**
     * @return array<string, array<string>|true>
     */
    public static function ownerPermissions(): array
    {
        return [
            // All CRUD permissions for all resources
            'user' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'role' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'organization' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'branch' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'asset' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'asset_condition' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'asset_status' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'asset_class' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'unit' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'department' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'person_in_charge' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'asset_user' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'asset_category' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'asset_location' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'warranty' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'vendor_contract' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'asset_import' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'asset_export' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'asset_label' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'asset_disposal' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'asset_depreciation' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'work_order' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'maintenance_schedule' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'maintenance_checklist' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'technician' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'report_inventory' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'report_maintenance' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'invitation' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'delegation' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'access_policy' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'login_history' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'settings' => ['app.manage', 'mail.manage', 'flags.manage'],
            'media' => ['manage'],
            'activity' => ['view'],

            // Special permissions
            'asset.view_all' => true,
            'work_order.view_all' => true,
            'maintenance_schedule.view_all' => true,
        ];
    }

    /**
     * @return array<string, array<string>|true>
     */
    public static function adminPermissions(): array
    {
        return [
            // All CRUD except cannot delete organization (only owner can)
            'user' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'role' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'organization' => ['view', 'create', 'update', 'approve', 'export'], // no delete
            'branch' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'asset' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'asset_condition' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'asset_status' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'asset_class' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'unit' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'department' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'person_in_charge' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'asset_user' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'asset_category' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'asset_location' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'warranty' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'vendor_contract' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'asset_import' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'asset_export' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'asset_label' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'asset_disposal' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'asset_depreciation' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'work_order' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'maintenance_schedule' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'maintenance_checklist' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'technician' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'report_inventory' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'report_maintenance' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'invitation' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'delegation' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'access_policy' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'login_history' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
            'settings' => ['app.manage', 'mail.manage', 'flags.manage'],
            'media' => ['manage'],
            'activity' => ['view'],

            'asset.view_all' => true,
            'work_order.view_all' => true,
            'maintenance_schedule.view_all' => true,
        ];
    }

    /**
     * @return array<string, array<string>|true>
     */
    public static function managerPermissions(): array
    {
        return [
            // View + Update + Create (no delete) + work order create
            'user' => ['view'],
            'role' => ['view'],
            'organization' => ['view'],
            'branch' => ['view', 'create', 'update'],
            'asset' => ['view', 'create', 'update', 'approve', 'export'], // no delete
            'asset_condition' => ['view', 'create', 'update'],
            'asset_status' => ['view', 'create', 'update'],
            'asset_class' => ['view', 'create', 'update'],
            'unit' => ['view', 'create', 'update'],
            'department' => ['view', 'create', 'update'],
            'person_in_charge' => ['view', 'create', 'update'],
            'asset_user' => ['view', 'create', 'update'],
            'asset_category' => ['view', 'create', 'update'],
            'asset_location' => ['view', 'create', 'update'],
            'warranty' => ['view', 'create', 'update'],
            'vendor_contract' => ['view', 'create', 'update'],
            'asset_import' => ['view', 'create', 'update'],
            'asset_export' => ['view', 'create', 'update'],
            'asset_label' => ['view', 'create', 'update'],
            'asset_disposal' => ['view', 'create', 'update'],
            'asset_depreciation' => ['view', 'create', 'update'],
            'work_order' => ['view', 'create', 'update', 'approve', 'export'], // Manager can create WO
            'maintenance_schedule' => ['view', 'create', 'update'],
            'maintenance_checklist' => ['view', 'create', 'update'],
            'technician' => ['view'],
            'report_inventory' => ['view', 'export'],
            'report_maintenance' => ['view', 'export'],
            'invitation' => ['view'],
            'delegation' => ['view'],
            'access_policy' => ['view'],
            'login_history' => ['view'],
            'settings' => ['app.manage', 'mail.manage', 'flags.manage'],
            'media' => ['manage'],
            'activity' => ['view'],
        ];
    }

    /**
     * @return array<string, array<string>|true>
     */
    public static function memberPermissions(): array
    {
        return [
            // View only
            'user' => ['view'],
            'role' => ['view'],
            'organization' => ['view'],
            'branch' => ['view'],
            'asset' => ['view'], // can view assets assigned to them
            'asset_condition' => ['view'],
            'asset_status' => ['view'],
            'asset_class' => ['view'],
            'unit' => ['view'],
            'department' => ['view'],
            'person_in_charge' => ['view'],
            'asset_user' => ['view'],
            'asset_category' => ['view'],
            'asset_location' => ['view'],
            'warranty' => ['view'],
            'vendor_contract' => ['view'],
            'asset_import' => ['view'],
            'asset_export' => ['view'],
            'asset_label' => ['view'],
            'asset_disposal' => ['view'],
            'asset_depreciation' => ['view'],
            'work_order' => ['view'], // can view assigned work orders
            'maintenance_schedule' => ['view'],
            'maintenance_checklist' => ['view'],
            'technician' => ['view'],
            'report_inventory' => ['view'],
            'report_maintenance' => ['view'],
            'invitation' => ['view'],
            'delegation' => ['view'],
            'access_policy' => ['view'],
            'login_history' => ['view'],
            'settings' => ['app.manage', 'mail.manage', 'flags.manage'],
            'media' => ['manage'],
            'activity' => ['view'],
        ];
    }

    /**
     * @param  array<string, array<string>|true>  $permissionsMap
     * @return list<string>
     */
    public static function permissionsToSpatieFormat(array $permissionsMap): array
    {
        $result = [];

        foreach ($permissionsMap as $group => $actions) {
            if (is_array($actions)) {
                foreach ($actions as $action) {
                    $result[] = "{$group}.{$action}";
                }
            } elseif ($actions === true) {
                $result[] = $group;
            }
        }

        return $result;
    }
}
