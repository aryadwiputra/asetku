<?php

return [
    'title' => 'Status aset',
    'description' => 'Kelola pilihan kondisi/status aset.',
    'fields' => [
        'code' => 'Kode',
        'description' => 'Deskripsi',
    ],
    'actions' => [
        'new' => 'Status baru',
        'delete_confirm' => 'Hapus ":name"?',
    ],
    'create' => [
        'title' => 'Buat status aset',
        'description' => 'Tambah status aset untuk organisasi ini.',
    ],
    'edit' => [
        'title' => 'Edit status aset',
    ],
    'toast' => [
        'created' => 'Status aset berhasil dibuat.',
        'updated' => 'Status aset berhasil diperbarui.',
        'deleted' => 'Status aset berhasil dihapus.',
    ],
];
