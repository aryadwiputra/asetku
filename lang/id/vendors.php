<?php

return [
    'title' => 'Vendor',
    'description' => 'Kelola profil vendor, status blacklist, dan rating performa otomatis.',
    'fields' => [
        'name' => 'Nama vendor',
        'tax_number' => 'NPWP',
        'email' => 'Email',
        'phone' => 'Telepon',
        'address' => 'Alamat',
        'service_category' => 'Kategori jasa',
        'is_blacklisted' => 'Blacklist',
        'blacklist_reason' => 'Alasan blacklist',
        'notes' => 'Catatan',
        'rating_total' => 'Rating total',
        'contracts_count' => 'Jumlah kontrak',
    ],
    'actions' => [
        'new' => 'Vendor baru',
        'delete_confirm' => 'Hapus ":name"?',
    ],
    'badges' => [
        'blacklisted_suffix' => '(diblacklist)',
    ],
    'validation' => [
        'blacklisted' => 'Vendor ini sedang diblacklist dan tidak bisa dipakai untuk kontrak baru.',
    ],
    'create' => [
        'title' => 'Buat vendor',
        'description' => 'Tambahkan profil vendor untuk layanan maintenance, langganan, atau sewa.',
    ],
    'edit' => [
        'title' => 'Edit vendor',
    ],
    'toast' => [
        'created' => 'Vendor berhasil dibuat.',
        'updated' => 'Vendor berhasil diperbarui.',
        'deleted' => 'Vendor berhasil dihapus.',
    ],
];
