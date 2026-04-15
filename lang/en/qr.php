<?php

return [
    'title' => 'QR: :code',
    'subtitle' => 'Asset code: :code',

    'actions' => [
        'scan_again' => 'Scan again',
        'open_asset' => 'Open asset',
        'login' => 'Login to continue',
    ],

    'messages' => [
        'login_required_actions' => 'Login to access full details and quick actions.',
        'org_inactive' => 'Organization is inactive.',
    ],

    'scan' => [
        'title' => 'Scan QR',
        'description' => 'Scan an asset QR using your camera, or enter the token manually.',
        'supported' => 'Camera scanning supported on this browser.',
        'not_supported' => 'Camera scanning is not supported on this browser.',
        'actions' => [
            'start' => 'Start scan',
            'stop' => 'Stop',
        ],
        'manual_title' => 'Manual entry',
        'manual_placeholder' => 'Paste QR URL or token...',
        'offline' => [
            'title' => 'Offline mode',
            'description' => 'Scans are saved locally and opened automatically when you are back online.',
        ],
    ],
];
