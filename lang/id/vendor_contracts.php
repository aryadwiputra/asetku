<?php

return [
    'title' => 'Kontrak vendor',
    'description' => 'Kelola kontrak vendor dan pengaturan SLA.',
    'fields' => [
        'vendor_name' => 'Nama vendor',
        'contract_number' => 'Nomor kontrak',
        'start_date' => 'Tanggal mulai',
        'end_date' => 'Tanggal selesai',
        'sla_response_hours' => 'SLA respons (jam)',
        'sla_resolution_hours' => 'SLA penyelesaian (jam)',
        'notes' => 'Catatan',
    ],
    'actions' => [
        'new' => 'Kontrak baru',
        'delete_confirm' => 'Hapus ":name"?',
    ],
    'create' => [
        'title' => 'Buat kontrak vendor',
        'description' => 'Tambah kontrak vendor baru.',
    ],
    'edit' => [
        'title' => 'Edit kontrak vendor',
    ],
    'toast' => [
        'created' => 'Kontrak vendor berhasil dibuat.',
        'updated' => 'Kontrak vendor berhasil diperbarui.',
        'deleted' => 'Kontrak vendor berhasil dihapus.',
    ],
];

