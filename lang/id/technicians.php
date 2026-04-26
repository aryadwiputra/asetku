<?php

return [
    'title' => 'Teknisi',
    'description' => 'Profil teknisi dan keahlian untuk penugasan work order.',
    'create_description' => 'Buat profil teknisi.',
    'fields' => [
        'user' => 'User',
        'skills' => 'Keahlian',
    ],
    'labels' => [
        'available' => 'Tersedia',
        'unavailable' => 'Tidak tersedia',
    ],
    'placeholders' => [
        'skills' => 'Pisahkan dengan koma (mis. network, printer, ac)',
    ],
    'actions' => [
        'new' => 'Buat teknisi',
        'edit' => 'Edit teknisi',
    ],
    'toast' => [
        'created' => 'Teknisi berhasil dibuat.',
        'updated' => 'Teknisi berhasil diperbarui.',
        'deleted' => 'Teknisi berhasil dihapus.',
    ],
    'validation' => [
        'user_not_in_org' => 'User yang dipilih bukan anggota aktif organisasi ini.',
    ],
];
