<?php

return [
    'title' => 'Kategori aset',
    'description' => 'Kelola kategori aset (bertingkat).',
    'sections' => [
        'depreciation' => 'Default depresiasi',
    ],
    'fields' => [
        'code' => 'Kode',
        'description' => 'Deskripsi',
        'parent' => 'Kategori induk',
        'parent_placeholder' => 'Pilih induk (opsional)',
        'parent_none' => 'Tanpa induk',
        'depreciation_method' => 'Metode depresiasi',
        'depreciation_method_placeholder' => 'Pilih metode',
        'useful_life_months' => 'Umur manfaat (bulan)',
        'residual_value' => 'Nilai residu',
        'capex_opex_default' => 'Default capex/opex',
    ],
    'depreciation_methods' => [
        'straight_line' => 'Garis lurus',
        'diminishing' => 'Saldo menurun',
    ],
    'actions' => [
        'new' => 'Kategori baru',
        'delete_confirm' => 'Hapus ":name"?',
    ],
    'create' => [
        'title' => 'Buat kategori',
        'description' => 'Tambah kategori aset baru.',
    ],
    'edit' => [
        'title' => 'Edit kategori',
    ],
    'toast' => [
        'created' => 'Kategori berhasil dibuat.',
        'updated' => 'Kategori berhasil diperbarui.',
        'deleted' => 'Kategori berhasil dihapus.',
    ],
];

