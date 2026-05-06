<?php

return [
    'title' => 'Checklist pemeliharaan',
    'description' => 'Template checklist untuk work order.',
    'create_description' => 'Buat template checklist.',
    'fields' => [
        'name' => 'Nama',
        'category' => 'Kategori',
        'required_skill' => 'Keahlian yang dibutuhkan',
        'items' => 'Item',
        'item_title' => 'Judul tugas',
    ],
    'actions' => [
        'new' => 'Buat checklist',
        'edit' => 'Edit checklist',
    ],
    'toast' => [
        'created' => 'Checklist berhasil dibuat.',
        'updated' => 'Checklist berhasil diperbarui.',
        'deleted' => 'Checklist berhasil dihapus.',
    ],
];
