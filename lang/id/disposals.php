<?php

return [
    'title' => 'Penghapusan Aset',
    'description' => 'Ajukan, setujui, dan arsipkan aset melalui alur penghapusan yang terkontrol.',
    'create_description' => 'Pilih aset, tentukan tipe penghapusan, lalu ajukan untuk persetujuan.',

    'fields' => [
        'asset' => 'Aset',
        'asset_search' => 'Cari aset',
        'type' => 'Tipe',
        'status' => 'Status',
        'disposed_at' => 'Tanggal penghapusan',
        'reason' => 'Alasan',
        'proceeds' => 'Nilai hasil',
        'fees' => 'Biaya',
        'fair_value' => 'Nilai wajar',
        'net_proceeds' => 'Nilai hasil (net)',
        'book_value' => 'Nilai buku',
        'gain_loss' => 'Untung / rugi',
        'summary' => 'Ringkasan',
        'approval' => 'Persetujuan',
        'current_step' => 'Tahap aktif',
        'step' => 'Tahap',
        'documents' => 'Dokumen',
    ],

    'actions' => [
        'new' => 'Ajukan penghapusan',
        'submit' => 'Ajukan untuk persetujuan',
        'ba' => 'BA Penghapusan (PDF)',
    ],

    'types' => [
        'sale' => 'Penjualan',
        'scrap' => 'Scrapping',
        'donation' => 'Hibah',
        'writeoff' => 'Penghapusan total',
    ],

    'status' => [
        'pending' => 'Menunggu',
        'approved' => 'Disetujui',
        'rejected' => 'Ditolak',
        'executed' => 'Dieksekusi',
        'revoked' => 'Dibatalkan',
    ],

    'step_status' => [
        'pending' => 'Menunggu',
        'approved' => 'Disetujui',
        'rejected' => 'Ditolak',
    ],

    'toast' => [
        'requested' => 'Penghapusan berhasil diajukan.',
        'approved_step' => 'Tahap disetujui.',
        'rejected' => 'Pengajuan ditolak.',
    ],

    'errors' => [
        'workflow_missing' => 'Workflow penghapusan belum dikonfigurasi untuk organisasi ini.',
        'pending_exists' => 'Aset ini sudah memiliki pengajuan penghapusan yang menunggu.',
        'asset_deleted' => 'Aset yang dipilih sudah dihapus.',
        'asset_archived' => 'Aset yang dipilih sudah diarsipkan.',
        'type_invalid' => 'Tipe penghapusan tidak valid.',
        'select_asset' => 'Silakan pilih aset terlebih dahulu.',
        'no_approval' => 'Data persetujuan tidak ditemukan.',
    ],

    'empty' => [
        'documents' => 'Belum ada dokumen penghapusan.',
    ],

    'history' => [
        'requested' => 'Penghapusan diajukan.',
        'rejected' => 'Penghapusan ditolak.',
        'executed' => 'Penghapusan dieksekusi.',
    ],
];
