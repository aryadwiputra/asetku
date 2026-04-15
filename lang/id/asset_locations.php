<?php

return [
    'title' => 'Lokasi aset',
    'description' => 'Kelola lokasi aset (bertingkat).',
    'fields' => [
        'code' => 'Kode',
        'description' => 'Deskripsi',
        'parent' => 'Lokasi induk',
        'parent_placeholder' => 'Pilih induk (opsional)',
        'parent_none' => 'Tanpa induk',
    ],
    'actions' => [
        'new' => 'Lokasi baru',
        'delete_confirm' => 'Hapus ":name"?',
    ],
    'create' => [
        'title' => 'Buat lokasi',
        'description' => 'Tambah lokasi baru.',
    ],
    'edit' => [
        'title' => 'Edit lokasi',
    ],
    'toast' => [
        'created' => 'Lokasi berhasil dibuat.',
        'updated' => 'Lokasi berhasil diperbarui.',
        'deleted' => 'Lokasi berhasil dihapus.',
    ],
];

