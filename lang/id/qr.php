<?php

return [
    'title' => 'QR: :code',
    'subtitle' => 'Kode aset: :code',

    'actions' => [
        'scan_again' => 'Scan lagi',
        'open_asset' => 'Buka aset',
        'login' => 'Login untuk lanjut',
    ],

    'messages' => [
        'login_required_actions' => 'Login untuk melihat detail lengkap dan melakukan aksi cepat.',
        'org_inactive' => 'Organisasi sedang nonaktif.',
    ],

    'scan' => [
        'title' => 'Scan QR',
        'description' => 'Scan QR aset memakai kamera, atau masukkan token secara manual.',
        'supported' => 'Browser ini mendukung scan kamera.',
        'not_supported' => 'Browser ini tidak mendukung scan kamera.',
        'actions' => [
            'start' => 'Mulai scan',
            'stop' => 'Berhenti',
        ],
        'manual_title' => 'Input manual',
        'manual_placeholder' => 'Tempel URL QR atau token...',
        'offline' => [
            'title' => 'Mode offline',
            'description' => 'Hasil scan disimpan lokal dan akan dibuka otomatis saat online.',
        ],
    ],
];
