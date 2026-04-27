<?php

return [
    'title' => 'Kalender pemeliharaan',
    'description' => 'Rencanakan dan pantau jadwal pemeliharaan preventif.',
    'filters' => [
        'branch' => 'Cabang',
        'category' => 'Kategori aset',
        'technician' => 'Teknisi',
        'search' => 'Cari',
    ],
    'actions' => [
        'new_schedule' => 'Buat jadwal',
        'edit_schedule' => 'Edit jadwal',
        'copy_feed_link' => 'Salin tautan berlangganan',
    ],
    'fields' => [
        'date' => 'Tanggal',
        'asset' => 'Aset',
        'branch' => 'Cabang',
        'technician' => 'Teknisi',
    ],
    'toast' => [
        'rescheduled' => 'Jadwal berhasil dipindahkan.',
        'reschedule_failed' => 'Gagal memindahkan jadwal. Silakan coba lagi.',
        'feed_link_ready' => 'Tautan berlangganan siap.',
        'feed_link_copied' => 'Tautan berlangganan tersalin.',
        'feed_link_failed' => 'Gagal membuat tautan berlangganan.',
    ],
    'history' => [
        'schedule_rescheduled' => 'Jadwal pemeliharaan dipindahkan.',
    ],
    'notifications' => [
        'due_soon_subject' => 'Pemeliharaan jatuh tempo dalam :days hari',
        'due_soon_body' => 'Ada jadwal pemeliharaan yang jatuh tempo dalam :days hari (tanggal: :date).',
    ],
];

