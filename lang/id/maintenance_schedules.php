<?php

return [
    'title' => 'Jadwal pemeliharaan',
    'description' => 'Jadwal pemeliharaan preventif per aset.',
    'create_description' => 'Buat jadwal pemeliharaan preventif.',
    'fields' => [
        'asset' => 'Aset',
        'asset_search' => 'Cari aset',
        'name' => 'Nama',
        'interval_days' => 'Interval (hari)',
        'next_due_at' => 'Jatuh tempo berikutnya',
        'required_skill' => 'Keahlian yang dibutuhkan',
    ],
    'actions' => [
        'new' => 'Buat jadwal',
        'edit' => 'Edit jadwal',
    ],
    'toast' => [
        'created' => 'Jadwal berhasil dibuat.',
        'updated' => 'Jadwal berhasil diperbarui.',
        'deleted' => 'Jadwal berhasil dihapus.',
    ],
];
