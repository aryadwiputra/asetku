<?php

use App\Notifications\ImportantSecurityNotification;
use App\Notifications\AssetResidualValueReachedNotification;

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
            'mail' => false,
            'slack' => false,
        ],
    ],
];
