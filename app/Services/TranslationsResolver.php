<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;

class TranslationsResolver
{
    /**
     * Resolve translations for the current request.
     *
     * @return array<string, array<string, mixed>>
     */
    public function resolve(Request $request): array
    {
        $routeName = $request->route()?->getName();
        $modules = $this->modulesForRoute($routeName);
        $locale = app()->getLocale();

        $translations = [];
        foreach ($modules as $module) {
            $translations[$module] = Lang::get($module, [], $locale);
        }

        return $translations;
    }

    /**
     * Determine translation modules for a given route name.
     *
     * @return array<int, string>
     */
    private function modulesForRoute(?string $routeName): array
    {
        $modules = ['common'];

        if (! $routeName) {
            return $modules;
        }

        if (str_starts_with($routeName, 'settings.')
            || str_starts_with($routeName, 'app-settings.')
            || str_starts_with($routeName, 'mail-settings.')
            || str_starts_with($routeName, 'feature-flags.')) {
            $modules[] = 'settings';
        }

        if (str_starts_with($routeName, 'users.')) {
            $modules[] = 'users';
            $modules[] = 'datatable';
        }

        if (str_starts_with($routeName, 'organizations.')) {
            $modules[] = 'organizations';
        }

        if (str_starts_with($routeName, 'branches.')) {
            $modules[] = 'branches';
        }

        if (str_starts_with($routeName, 'roles.')) {
            $modules[] = 'roles';
            $modules[] = 'users';
            $modules[] = 'datatable';
        }

        if (str_starts_with($routeName, 'profile.')) {
            $modules[] = 'profile';
            $modules[] = 'notifications';
        }

        if ($routeName === 'dashboard') {
            $modules[] = 'dashboard';
        }

        if ($routeName === 'home') {
            $modules[] = 'welcome';
            $modules[] = 'auth';
        }

        if (str_starts_with($routeName, 'password.')
            || str_starts_with($routeName, 'verification.')
            || str_starts_with($routeName, 'two-factor.')
            || str_starts_with($routeName, 'invites.')
            || in_array($routeName, ['login', 'register'], true)) {
            $modules[] = 'auth';
        }

        if ($routeName === 'maintenance') {
            $modules[] = 'maintenance';
        }

        if (str_starts_with($routeName, 'notifications.')) {
            $modules[] = 'notifications';
        }

        if (str_starts_with($routeName, 'activity.')) {
            $modules[] = 'activity';
            $modules[] = 'datatable';
        }

        if (str_starts_with($routeName, 'media.')
            || str_starts_with($routeName, 'media-uploads.')) {
            $modules[] = 'media';
            $modules[] = 'datatable';
        }

        if (str_starts_with($routeName, 'master-data.')) {
            $modules[] = 'master_data';
            $modules[] = 'datatable';
            $modules[] = 'asset_statuses';
            $modules[] = 'asset_conditions';
            $modules[] = 'asset_classes';
            $modules[] = 'units';
            $modules[] = 'departments';
            $modules[] = 'person_in_charges';
            $modules[] = 'asset_users';
            $modules[] = 'asset_categories';
            $modules[] = 'asset_locations';
            $modules[] = 'warranties';
            $modules[] = 'vendor_contracts';
        }

        if (str_starts_with($routeName, 'assets.')
            || str_starts_with($routeName, 'assets-import')
            || str_starts_with($routeName, 'assets-labels')
            || str_starts_with($routeName, 'assets-export')
            || str_starts_with($routeName, 'assets-saved-filters')) {
            $modules[] = 'assets';
            $modules[] = 'imports';
            $modules[] = 'labels';
            $modules[] = 'saved_filters';
            $modules[] = 'datatable';
        }

        if (str_starts_with($routeName, 'depreciation.')) {
            $modules[] = 'depreciation';
            $modules[] = 'assets';
            $modules[] = 'datatable';
        }

        if (str_starts_with($routeName, 'disposals.')) {
            $modules[] = 'disposals';
            $modules[] = 'assets';
            $modules[] = 'datatable';
        }

        if (str_starts_with($routeName, 'work-orders.')) {
            $modules[] = 'work_orders';
            $modules[] = 'datatable';
        }

        if (str_starts_with($routeName, 'maintenance-schedules.')) {
            $modules[] = 'maintenance_schedules';
            $modules[] = 'work_orders';
            $modules[] = 'datatable';
        }

        if (str_starts_with($routeName, 'maintenance-calendar.')) {
            $modules[] = 'maintenance_calendar';
            $modules[] = 'maintenance_schedules';
            $modules[] = 'datatable';
        }

        if (str_starts_with($routeName, 'maintenance-checklists.')) {
            $modules[] = 'maintenance_checklists';
            $modules[] = 'datatable';
        }

        if (str_starts_with($routeName, 'technicians.')) {
            $modules[] = 'technicians';
            $modules[] = 'datatable';
        }

        if (str_starts_with($routeName, 'qr.')
            || str_starts_with($routeName, 'scan.')) {
            $modules[] = 'qr';
            $modules[] = 'assets';
        }

        if (str_starts_with($routeName, 'reports.')) {
            $modules[] = 'reports';
            $modules[] = 'assets';
            $modules[] = 'datatable';
        }

        return array_values(array_unique($modules));
    }
}
