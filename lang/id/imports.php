<?php

return [
    'toast' => [
        'queued' => 'Import masuk antrian.',
        'apply_queued' => 'Penerapan import masuk antrian.',
    ],

    'validation' => [
        'forbidden' => 'Anda tidak memiliki akses untuk import di organisasi ini.',
        'upload_failed' => 'Upload gagal.',
        'not_ready' => 'Import belum siap.',
        'has_errors' => 'Import masih memiliki error. Perbaiki dulu sebelum diterapkan.',
    ],

    'actions' => [
        'validate' => 'Validasi file',
        'queue' => 'Antrikan import',
        'apply' => 'Terapkan import',
    ],

    'runs' => [
        'title' => 'Riwayat import',
        'description' => 'Daftar import terbaru beserta statusnya.',
        'empty' => 'Belum ada import.',
    ],

    'assets' => [
        'title' => 'Import aset',
        'description' => 'Validasi dan import aset dari Excel, serta lampirkan foto melalui ZIP.',
        'upload_xlsx_title' => 'Upload Excel (.xlsx)',
        'upload_xlsx_desc' => 'Upload file template dan validasi secara async.',
        'upload_zip_title' => 'Upload ZIP foto',
        'upload_zip_desc' => 'Nama file harus diawali kode aset (contoh KODE_01.jpg).',
        'history' => [
            'imported' => 'Diimport melalui Excel.',
        ],
        'errors' => [
            'name_required' => 'Nama wajib diisi.',
            'branch_required' => 'Kode cabang wajib diisi.',
            'branch_not_found' => 'Cabang tidak ditemukan: :code',
            'department_not_found' => 'Departemen tidak ditemukan: :code',
            'department_branch_mismatch' => 'Departemen tidak berada pada cabang: :code',
            'location_not_found' => 'Lokasi tidak ditemukan: :code',
            'location_branch_mismatch' => 'Lokasi tidak berada pada cabang: :code',
            'category_not_found' => 'Kategori tidak ditemukan: :code',
            'status_not_found' => 'Status tidak ditemukan: :code',
            'condition_not_found' => 'Kondisi tidak ditemukan: :code',
            'pic_not_found' => 'PIC tidak ditemukan: :name',
            'asset_user_not_found' => 'Pemegang aset tidak ditemukan: :name',
            'purchase_date_invalid' => 'Format tanggal perolehan tidak valid.',
            'cost_invalid' => 'Nilai biaya tidak valid.',
        ],
    ],
];
