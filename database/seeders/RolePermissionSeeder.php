<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Cache;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    /**
     * The permissions to create.
     *
     * @var array<string, list<string>>
     */
    private const PERMISSIONS = [
        // Standardized granular permissions (v2)
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
        'invitation' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
        'delegation' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
        'access_policy' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
        'login_history' => ['view', 'create', 'update', 'delete', 'approve', 'export'],
        'settings' => ['app.manage', 'mail.manage', 'flags.manage'],
        'media' => ['manage'],
        'activity' => ['view'],
    ];

    /**
     * The role-permission mapping.
     *
     * @var array<string, list<string>>
     */
    private const ROLE_PERMISSIONS = [
        'admin' => [
            // Standard permissions
            'user.view', 'user.create', 'user.update', 'user.delete', 'user.approve', 'user.export',
            'role.view', 'role.create', 'role.update', 'role.delete', 'role.approve', 'role.export',
            'organization.view', 'organization.create', 'organization.update', 'organization.delete', 'organization.approve', 'organization.export',
            'branch.view', 'branch.create', 'branch.update', 'branch.delete', 'branch.approve', 'branch.export',
            'asset.view', 'asset.create', 'asset.update', 'asset.delete', 'asset.approve', 'asset.export',
            'asset_condition.view', 'asset_condition.create', 'asset_condition.update', 'asset_condition.delete', 'asset_condition.approve', 'asset_condition.export',
            'asset_status.view', 'asset_status.create', 'asset_status.update', 'asset_status.delete', 'asset_status.approve', 'asset_status.export',
            'asset_class.view', 'asset_class.create', 'asset_class.update', 'asset_class.delete', 'asset_class.approve', 'asset_class.export',
            'unit.view', 'unit.create', 'unit.update', 'unit.delete', 'unit.approve', 'unit.export',
            'department.view', 'department.create', 'department.update', 'department.delete', 'department.approve', 'department.export',
            'person_in_charge.view', 'person_in_charge.create', 'person_in_charge.update', 'person_in_charge.delete', 'person_in_charge.approve', 'person_in_charge.export',
            'asset_user.view', 'asset_user.create', 'asset_user.update', 'asset_user.delete', 'asset_user.approve', 'asset_user.export',
            'asset_category.view', 'asset_category.create', 'asset_category.update', 'asset_category.delete', 'asset_category.approve', 'asset_category.export',
            'asset_location.view', 'asset_location.create', 'asset_location.update', 'asset_location.delete', 'asset_location.approve', 'asset_location.export',
            'warranty.view', 'warranty.create', 'warranty.update', 'warranty.delete', 'warranty.approve', 'warranty.export',
            'vendor_contract.view', 'vendor_contract.create', 'vendor_contract.update', 'vendor_contract.delete', 'vendor_contract.approve', 'vendor_contract.export',
            'asset_import.view', 'asset_import.create', 'asset_import.update', 'asset_import.delete', 'asset_import.approve', 'asset_import.export',
            'asset_export.view', 'asset_export.create', 'asset_export.update', 'asset_export.delete', 'asset_export.approve', 'asset_export.export',
            'asset_label.view', 'asset_label.create', 'asset_label.update', 'asset_label.delete', 'asset_label.approve', 'asset_label.export',
            'asset_disposal.view', 'asset_disposal.create', 'asset_disposal.update', 'asset_disposal.delete', 'asset_disposal.approve', 'asset_disposal.export',
            'asset_depreciation.view', 'asset_depreciation.create', 'asset_depreciation.update', 'asset_depreciation.delete', 'asset_depreciation.approve', 'asset_depreciation.export',
            'work_order.view', 'work_order.create', 'work_order.update', 'work_order.delete', 'work_order.approve', 'work_order.export',
            'maintenance_schedule.view', 'maintenance_schedule.create', 'maintenance_schedule.update', 'maintenance_schedule.delete', 'maintenance_schedule.approve', 'maintenance_schedule.export',
            'maintenance_checklist.view', 'maintenance_checklist.create', 'maintenance_checklist.update', 'maintenance_checklist.delete', 'maintenance_checklist.approve', 'maintenance_checklist.export',
            'technician.view', 'technician.create', 'technician.update', 'technician.delete', 'technician.approve', 'technician.export',
            'invitation.view', 'invitation.create', 'invitation.update', 'invitation.delete', 'invitation.approve', 'invitation.export',
            'delegation.view', 'delegation.create', 'delegation.update', 'delegation.delete', 'delegation.approve', 'delegation.export',
            'access_policy.view', 'access_policy.create', 'access_policy.update', 'access_policy.delete', 'access_policy.approve', 'access_policy.export',
            'login_history.view', 'login_history.create', 'login_history.update', 'login_history.delete', 'login_history.approve', 'login_history.export',

            // Legacy permissions kept for backward compatibility (v1)
            'user.edit', 'user.impersonate',
            'role.edit',
            'organization.edit', 'organization.deactivate',
            'branch.edit', 'branch.deactivate',

            'settings.app.manage',
            'settings.mail.manage',
            'settings.flags.manage',
            'media.manage',
            'activity.view',
        ],
        'user' => [],
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $this->createPermissions();
        $this->createRoles();

        try {
            Cache::store('redis')->tags(['roles', 'permissions'])->flush();
        } catch (\Throwable) {
            // Ignore cache failures.
        }
    }

    /**
     * Create all permissions.
     */
    private function createPermissions(): void
    {
        foreach (self::PERMISSIONS as $group => $actions) {
            foreach ($actions as $action) {
                Permission::findOrCreate("{$group}.{$action}");
            }
        }

        // Legacy permissions (v1) that still exist in the app codebase.
        Permission::findOrCreate('user.edit');
        Permission::findOrCreate('user.impersonate');
        Permission::findOrCreate('role.edit');
        Permission::findOrCreate('organization.edit');
        Permission::findOrCreate('organization.deactivate');
        Permission::findOrCreate('branch.edit');
        Permission::findOrCreate('branch.deactivate');
    }

    /**
     * Create roles and assign permissions.
     */
    private function createRoles(): void
    {
        // Super admin gets all permissions via Gate::before
        Role::findOrCreate('super-admin');

        foreach (self::ROLE_PERMISSIONS as $roleName => $permissions) {
            $role = Role::findOrCreate($roleName);
            $role->syncPermissions($permissions);
        }
    }
}
