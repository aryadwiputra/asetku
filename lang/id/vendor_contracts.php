<?php

return [
    'title' => 'Kontrak vendor',
    'description' => 'Kelola kontrak vendor operasional, aset tercakup, reminder, perpanjangan, dan dokumen.',
    'fields' => [
        'vendor' => 'Vendor',
        'vendor_name' => 'Nama vendor',
        'title' => 'Judul kontrak',
        'type' => 'Tipe kontrak',
        'contract_number' => 'Nomor kontrak',
        'status' => 'Status',
        'baseline_cost' => 'Biaya dasar',
        'start_date' => 'Tanggal mulai',
        'end_date' => 'Tanggal selesai',
        'sla_response_hours' => 'SLA respons (jam)',
        'sla_resolution_hours' => 'SLA penyelesaian (jam)',
        'notes' => 'Catatan',
        'terms' => 'Ketentuan',
        'assets' => 'Aset tercakup',
        'maintenance_cost_total' => 'Total biaya maintenance',
        'documents' => 'Dokumen',
    ],
    'types' => [
        'maintenance' => 'Pemeliharaan',
        'subscription' => 'Langganan',
        'lease' => 'Sewa',
    ],
    'statuses' => [
        'draft' => 'Draft',
        'active' => 'Aktif',
        'expired' => 'Kedaluwarsa',
        'expiring_soon' => 'Segera berakhir',
    ],
    'actions' => [
        'new' => 'Kontrak baru',
        'renew' => 'Perpanjang kontrak',
        'upload_document' => 'Unggah dokumen',
        'delete_confirm' => 'Hapus ":name"?',
    ],
    'create' => [
        'title' => 'Buat kontrak vendor',
        'description' => 'Tambah kontrak vendor operasional baru.',
    ],
    'edit' => [
        'title' => 'Edit kontrak vendor',
    ],
    'show' => [
        'title' => 'Detail kontrak',
        'description' => 'Tinjau terms, aset tercakup, renewal, biaya, dan dokumen.',
        'documents_empty' => 'Belum ada dokumen kontrak.',
        'renewals_empty' => 'Belum ada draft perpanjangan.',
        'assets_empty' => 'Belum ada aset yang terhubung ke kontrak ini.',
    ],
    'renewals' => [
        'title' => 'Riwayat perpanjangan',
        'status' => 'Status perpanjangan',
        'created_at' => 'Dibuat pada',
        'field_differences' => 'Perbandingan terms',
        'statuses' => [
            'draft' => 'Draft',
            'active' => 'Aktif',
            'activated' => 'Diaktifkan',
            'replaced' => 'Digantikan',
            'expired' => 'Kedaluwarsa',
        ],
        'suffix' => 'Perpanjangan',
    ],
    'documents' => [
        'fallback_title' => 'Dokumen',
        'fallback_type' => 'Berkas',
    ],
    'toast' => [
        'created' => 'Kontrak vendor berhasil dibuat.',
        'updated' => 'Kontrak vendor berhasil diperbarui.',
        'deleted' => 'Kontrak vendor berhasil dihapus.',
        'renewed' => 'Draft perpanjangan berhasil dibuat dari kontrak saat ini.',
        'document_uploaded' => 'Dokumen kontrak berhasil diunggah.',
    ],
    'notifications' => [
        'expiring_soon' => 'Kontrak vendor akan segera berakhir.',
    ],
];
