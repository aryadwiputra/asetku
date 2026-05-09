<?php

return [
    'title' => 'Audit',
    'description' => 'Pengelolaan jadwal dan temuan audit.',

    'status' => [
        'draft' => 'Draf',
        'in_progress' => 'Sedang Berlangsung',
        'completed' => 'Selesai',
        'cancelled' => 'Dibatalkan',
    ],

    'status_values' => [
        'matched' => 'Sesuai',
        'mismatched' => 'Tidak Sesuai',
        'not_found' => 'Tidak Ditemukan',
    ],

    'approval_status' => [
        'pending' => 'Menunggu Persetujuan',
        'approved' => 'Disetujui',
        'rejected' => 'Ditolak',
    ],

    'fields' => [
        'name' => 'Nama Jadwal',
        'description' => 'Deskripsi',
        'start_date' => 'Tanggal Mulai',
        'end_date' => 'Tanggal Selesai',
        'auditors' => 'Auditor',
        'assets' => 'Aset',
        'status' => 'Status',
        'current_location' => 'Lokasi Saat Ini',
        'expected_location' => 'Lokasi Expected',
        'current_condition' => 'Kondisi Saat Ini',
        'notes' => 'Catatan',
        'signature' => 'Tanda Tangan',
        'photos' => 'Foto',
        'approval_status' => 'Status Persetujuan',
        'audited_at' => 'Tanggal Audit',
        'total_assets' => 'Total Aset',
        'completed_assets' => 'Selesai',
    ],

    'actions' => [
        'new_schedule' => 'Jadwal Audit Baru',
        'start_audit' => 'Mulai Audit',
        'complete_audit' => 'Selesaikan Audit',
        'cancel_audit' => 'Batalkan Audit',
        'record_finding' => 'Catat Temuan',
        'approve' => 'Setujui',
        'reject' => 'Tolak',
        'ad_hoc_audit' => 'Audit Dadakan',
    ],

    'sections' => [
        'schedule_info' => 'Informasi Jadwal',
        'auditors' => 'Auditor yang Ditugaskan',
        'asset_list' => 'Aset yang Dienumerasi',
        'findings' => 'Temuan Audit',
        'progress' => 'Progres',
    ],

    'validation' => [
        'at_least_one_auditor' => 'Minimal satu auditor harus ditugaskan.',
        'at_least_one_asset' => 'Minimal satu aset harus ditugaskan.',
        'end_date_after_start' => 'Tanggal selesai harus setelah atau sama dengan tanggal mulai.',
        'cannot_start' => 'Tidak dapat memulai audit. Jadwal harus berstatus draf.',
        'cannot_complete' => 'Tidak dapat menyelesaikan audit. Jadwal harus berstatus sedang berlangsung.',
    ],

    'toast' => [
        'schedule_created' => 'Jadwal audit berhasil dibuat.',
        'schedule_updated' => 'Jadwal audit berhasil diperbarui.',
        'schedule_deleted' => 'Jadwal audit berhasil dihapus.',
        'schedule_started' => 'Audit telah dimulai.',
        'schedule_completed' => 'Audit telah diselesaikan.',
        'finding_created' => 'Temuan audit berhasil dicatat.',
        'finding_updated' => 'Temuan audit berhasil diperbarui.',
        'finding_deleted' => 'Temuan audit berhasil dihapus.',
        'finding_approved' => 'Temuan audit disetujui.',
        'finding_rejected' => 'Temuan audit ditolak.',
    ],

    'notifications' => [
        'finding_submitted' => [
            'subject' => 'Temuan Audit Submitted untuk :asset_code',
            'line1' => ':auditor telah mengajukan temuan audit untuk aset :asset_code.',
            'line2' => 'Status temuan: :status',
            'action' => 'Lihat Detail',
            'unknown_auditor' => 'Auditor Tidak Dikenal',
        ],
    ],

    'history' => [
        'finding_recorded' => 'Temuan audit dicatat oleh :auditor (Status: :status)',
    ],

    'empty_auditors' => 'Belum ada auditor ditugaskan.',
    'empty_assets' => 'Belum ada aset ditugaskan.',
    'empty_findings' => 'Belum ada temuan tercatat.',

    'tabs' => [
        'schedules' => 'Jadwal',
        'findings' => 'Temuan',
    ],

    'my_audits' => 'Audit Saya',
    'pending_approval' => 'Menunggu Persetujuan',

    'placeholders' => [
        'name' => 'contoh: Audit Aset Q2',
        'description' => 'Jelaskan ruang lingkup dan tujuan audit',
        'search_assets' => 'Cari berdasarkan kode atau nama',
        'all_branches' => 'Semua cabang',
        'select_location' => 'Pilih lokasi',
        'select_condition' => 'Pilih kondisi',
        'notes' => 'Jelaskan ketidaksesuaian atau observasi',
        'select_auditors' => 'Pilih auditor',
        'select_assets' => 'Pilih aset',
    ],

    'fields_assets_selected' => 'aset dipilih',
    'empty_schedules' => 'Belum ada jadwal audit',
    'empty_schedules_desc' => 'Buat jadwal audit pertama untuk mulai melacak audit aset.',
];
