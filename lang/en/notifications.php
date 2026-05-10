<?php

return [
    'title' => 'Notifications',
    'description' => 'Stay up to date with what matters to you.',
    'bell' => [
        'title' => 'Notifications',
        'empty' => 'No notifications yet.',
    ],
    'actions' => [
        'mark_all_read' => 'Mark all as read',
        'mark_read' => 'Mark as read',
        'view_all' => 'All notifications',
        'open' => 'Open',
    ],
    'filters' => [
        'unread' => 'Unread',
        'read' => 'Read',
        'all' => 'All',
    ],
    'list' => [
        'title' => 'All notifications',
        'description' => 'Review your recent activity and updates.',
        'empty' => 'You have no notifications for this filter.',
    ],
    'pagination' => [
        'page' => 'Page',
    ],
    'preferences' => [
        'title' => 'Notification preferences',
        'description' => 'Choose which channels you want to receive for each notification type.',
        'actions' => [
            'save' => 'Save preferences',
        ],
    ],
    'channels' => [
        'database' => 'In-app',
        'mail' => 'Email',
        'slack' => 'Slack',
    ],
    'types' => [
        'audit_finding_submitted' => [
            'title' => 'Audit finding submitted',
            'description' => 'Notifies you when a new audit finding is submitted for review.',
        ],
        'security_important' => [
            'title' => 'Important security alerts',
            'description' => 'High priority security events that may require your attention.',
        ],
        'marketing_announcement' => [
            'title' => 'Product announcements',
            'description' => 'Occasional updates about new features and improvements.',
        ],
        'system_general' => [
            'title' => 'General updates',
            'description' => 'Routine system updates and account activity.',
        ],
        'assets_depreciation_residual_reached' => [
            'title' => 'Asset reached residual value',
            'description' => 'Notifies you when an asset book value has reached its residual value.',
        ],
        'assets_warranty_notifications_expiring_soon' => [
            'title' => 'Asset warranty expiring soon',
            'description' => 'Notifies you when an asset warranty is about to expire.',
        ],
        'vendor_contracts_notifications_expiring_soon' => [
            'title' => 'Vendor contract expiring soon',
            'description' => 'Notifies you when a vendor contract is about to expire.',
        ],
        'assets_work_orders_sla_response_breached' => [
            'title' => 'Work order response SLA breached',
            'description' => 'Notifies you when a work order response time has exceeded SLA.',
        ],
        'assets_work_orders_sla_resolution_breached' => [
            'title' => 'Work order resolution SLA breached',
            'description' => 'Notifies you when a work order resolution time has exceeded SLA.',
        ],
        'assets_work_orders_assigned' => [
            'title' => 'Work order assigned',
            'description' => 'Notifies you when a work order is assigned to you.',
        ],
        'maintenance_schedules_due_in_7_days' => [
            'title' => 'Maintenance due in 7 days',
            'description' => 'Notifies you 7 days before a maintenance schedule is due.',
        ],
        'maintenance_schedules_due_in_3_days' => [
            'title' => 'Maintenance due in 3 days',
            'description' => 'Notifies you 3 days before a maintenance schedule is due.',
        ],
        'maintenance_schedules_due_in_1_day' => [
            'title' => 'Maintenance due in 1 day',
            'description' => 'Notifies you 1 day before a maintenance schedule is due.',
        ],
    ],
    'toast' => [
        'preferences_saved' => 'Notification preferences updated.',
    ],
];
