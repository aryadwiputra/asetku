<?php

use App\Notifications\AssetResidualValueReachedNotification;
use App\Notifications\AssetWarrantyExpiringSoonNotification;
use App\Notifications\ContractExpiringSoonNotification;
use App\Notifications\ImportantSecurityNotification;
use App\Notifications\MaintenanceScheduleDueInOneDayNotification;
use App\Notifications\MaintenanceScheduleDueInSevenDaysNotification;
use App\Notifications\MaintenanceScheduleDueInThreeDaysNotification;
use App\Notifications\WorkOrderAssignedNotification;
use App\Notifications\WorkOrderResolutionSlaBreachedNotification;
use App\Notifications\WorkOrderResponseSlaBreachedNotification;

return [
    [
        'key' => 'security.important',
        'title_key' => 'notifications.types.security_important.title',
        'description_key' => 'notifications.types.security_important.description',
        'class' => ImportantSecurityNotification::class,
        'default_channels' => [
            'database' => true,
            'mail' => true,
            'slack' => true,
        ],
    ],
    [
        'key' => 'marketing.announcement',
        'title_key' => 'notifications.types.marketing_announcement.title',
        'description_key' => 'notifications.types.marketing_announcement.description',
        'default_channels' => [
            'database' => true,
            'mail' => false,
            'slack' => false,
        ],
    ],
    [
        'key' => 'system.general',
        'title_key' => 'notifications.types.system_general.title',
        'description_key' => 'notifications.types.system_general.description',
        'default_channels' => [
            'database' => true,
            'mail' => false,
            'slack' => false,
        ],
    ],
    [
        'key' => 'assets.depreciation.residual_reached',
        'title_key' => 'notifications.types.assets_depreciation_residual_reached.title',
        'description_key' => 'notifications.types.assets_depreciation_residual_reached.description',
        'class' => AssetResidualValueReachedNotification::class,
        'default_channels' => [
            'database' => true,
            'mail' => true,
            'slack' => false,
        ],
    ],
    [
        'key' => 'assets.warranty.notifications.expiring_soon',
        'title_key' => 'notifications.types.assets_warranty_notifications_expiring_soon.title',
        'description_key' => 'notifications.types.assets_warranty_notifications_expiring_soon.description',
        'class' => AssetWarrantyExpiringSoonNotification::class,
        'default_channels' => [
            'database' => true,
            'mail' => true,
            'slack' => false,
        ],
    ],
    [
        'key' => 'vendor_contracts.notifications.expiring_soon',
        'title_key' => 'notifications.types.vendor_contracts_notifications_expiring_soon.title',
        'description_key' => 'notifications.types.vendor_contracts_notifications_expiring_soon.description',
        'class' => ContractExpiringSoonNotification::class,
        'default_channels' => [
            'database' => true,
            'mail' => true,
            'slack' => false,
        ],
    ],
    [
        'key' => 'assets.work_orders.sla_response_breached',
        'title_key' => 'notifications.types.assets_work_orders_sla_response_breached.title',
        'description_key' => 'notifications.types.assets_work_orders_sla_response_breached.description',
        'class' => WorkOrderResponseSlaBreachedNotification::class,
        'default_channels' => [
            'database' => true,
            'mail' => true,
            'slack' => false,
        ],
    ],
    [
        'key' => 'assets.work_orders.sla_resolution_breached',
        'title_key' => 'notifications.types.assets_work_orders_sla_resolution_breached.title',
        'description_key' => 'notifications.types.assets_work_orders_sla_resolution_breached.description',
        'class' => WorkOrderResolutionSlaBreachedNotification::class,
        'default_channels' => [
            'database' => true,
            'mail' => true,
            'slack' => false,
        ],
    ],
    [
        'key' => 'assets.work_orders.assigned',
        'title_key' => 'notifications.types.assets_work_orders_assigned.title',
        'description_key' => 'notifications.types.assets_work_orders_assigned.description',
        'class' => WorkOrderAssignedNotification::class,
        'default_channels' => [
            'database' => true,
            'mail' => true,
            'slack' => false,
        ],
    ],
    [
        'key' => 'maintenance_schedules.notifications.due_in_7_days',
        'title_key' => 'notifications.types.maintenance_schedules_due_in_7_days.title',
        'description_key' => 'notifications.types.maintenance_schedules_due_in_7_days.description',
        'class' => MaintenanceScheduleDueInSevenDaysNotification::class,
        'default_channels' => [
            'database' => true,
            'mail' => true,
            'slack' => false,
        ],
    ],
    [
        'key' => 'maintenance_schedules.notifications.due_in_3_days',
        'title_key' => 'notifications.types.maintenance_schedules_due_in_3_days.title',
        'description_key' => 'notifications.types.maintenance_schedules_due_in_3_days.description',
        'class' => MaintenanceScheduleDueInThreeDaysNotification::class,
        'default_channels' => [
            'database' => true,
            'mail' => true,
            'slack' => false,
        ],
    ],
    [
        'key' => 'maintenance_schedules.notifications.due_in_1_day',
        'title_key' => 'notifications.types.maintenance_schedules_due_in_1_day.title',
        'description_key' => 'notifications.types.maintenance_schedules_due_in_1_day.description',
        'class' => MaintenanceScheduleDueInOneDayNotification::class,
        'default_channels' => [
            'database' => true,
            'mail' => true,
            'slack' => false,
        ],
    ],
];
