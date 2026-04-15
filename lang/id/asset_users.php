<?php

return [
    'title' => 'Pengguna aset',
    'description' => 'Kelola orang yang memakai atau menerima aset.',
    'fields' => [
        'email' => 'Email',
        'phone' => 'Telepon',
        'department' => 'Departemen',
        'department_placeholder' => 'Pilih departemen (opsional)',
        'department_none' => 'Tanpa departemen',
        'notes' => 'Catatan',
    ],
    'actions' => [
        'new' => 'Pengguna baru',
        'delete_confirm' => 'Hapus ":name"?',
    ],
    'create' => [
        'title' => 'Buat pengguna aset',
        'description' => 'Tambah pengguna aset untuk organisasi aktif.',
    ],
    'edit' => [
        'title' => 'Edit pengguna aset',
    ],
    'toast' => [
        'created' => 'Pengguna aset berhasil dibuat.',
        'updated' => 'Pengguna aset berhasil diperbarui.',
        'deleted' => 'Pengguna aset berhasil dihapus.',
    ],
];

