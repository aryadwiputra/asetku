<?php

return [
    'title' => 'Aset',
    'description' => 'Registrasi dan kelola aset pada organisasi aktif.',

    'fields' => [
        'code' => 'Kode aset',
        'name' => 'Nama aset',
        'description' => 'Deskripsi',
        'branch' => 'Cabang',
        'department' => 'Departemen',
        'location' => 'Lokasi',
        'category' => 'Kategori',
        'status' => 'Status',
        'condition' => 'Kondisi',
        'pic' => 'Penanggung jawab',
        'asset_user' => 'Pemegang',
        'brand' => 'Merek',
        'model' => 'Model',
        'series' => 'Seri',
        'serial_number' => 'Nomor seri',
        'imei' => 'IMEI',
        'purchase_date' => 'Tanggal perolehan',
        'cost' => 'Harga perolehan',
        'book_value' => 'Nilai buku',
        'depreciation_method' => 'Metode depresiasi',
        'useful_life_months' => 'Umur ekonomis (bulan)',
        'residual_value' => 'Nilai residu',
        'latitude' => 'Lintang',
        'longitude' => 'Bujur',
    ],

    'placeholders' => [
        'code_auto' => 'Otomatis (opsional)',
        'branch' => 'Pilih cabang',
        'department' => 'Pilih departemen',
        'location' => 'Pilih lokasi',
        'category' => 'Pilih kategori',
        'status' => 'Pilih status',
        'condition' => 'Pilih kondisi',
        'pic' => 'Pilih PIC',
        'asset_user' => 'Pilih pemegang',
    ],

    'actions' => [
        'new' => 'Tambah aset',
        'edit' => 'Edit aset',
        'export' => 'Ekspor',
        'delete_confirm' => 'Hapus aset :code?',
        'show_advanced' => 'Tampilkan field lanjutan',
        'open_qr' => 'Buka halaman QR',
        'copy_qr_link' => 'Salin link QR',
    ],

    'views' => [
        'all' => 'Semua aset',
        'manage' => 'Kelola tampilan',
    ],

    'filters' => [
        'title' => 'Filter',
        'more' => 'Filter',
        'active_count' => ':count aktif',
        'clear_all' => 'Bersihkan semua',
        'remove' => 'Hapus filter',
        'status' => 'Status',
        'condition' => 'Kondisi',
        'cost_min' => 'Biaya minimum',
        'cost_max' => 'Biaya maksimum',
        'groups' => [
            'structure' => 'Struktur',
            'classification' => 'Klasifikasi',
            'ownership' => 'Kepemilikan',
            'finance' => 'Keuangan',
        ],
    ],

    'kpis' => [
        'total_assets' => 'Total aset',
        'total_value' => 'Total nilai',
        'by_status' => 'Berdasarkan status',
        'by_condition' => 'Berdasarkan kondisi',
        'others' => 'Lainnya',
        'scoped' => 'Filter saat ini',
    ],

    'sections' => [
        'details' => 'Detail',
        'details_desc' => 'Informasi dasar dan kepemilikan.',
        'financial' => 'Keuangan',
        'financial_desc' => 'Ringkasan biaya dan depresiasi.',
        'history' => 'Riwayat',
        'history_desc' => 'Perubahan dan aktivitas terbaru.',
        'attachments' => 'Lampiran',
        'attachments_desc' => 'Foto dan dokumen aset.',
        'qr' => 'QR / Barcode',
        'qr_desc' => 'Gunakan link ini untuk cetak label dan scan.',
        'metadata' => 'Metadata',
        'custom_fields' => 'Field tambahan',
        'map' => 'Peta',
        'map_desc' => 'Koordinat aset (jika tersedia).',
    ],

    'map' => [
        'empty' => 'Koordinat belum diatur.',
    ],

    'create' => [
        'title' => 'Tambah aset',
        'description' => 'Buat aset baru pada organisasi aktif.',
    ],

    'edit' => [
        'title' => 'Edit aset (:code)',
        'description' => 'Perbarui data aset.',
    ],

    'show' => [
        'title' => 'Aset (:code)',
        'subtitle' => 'Kode: :code',
    ],

    'toast' => [
        'created' => 'Aset berhasil dibuat.',
        'updated' => 'Aset berhasil diperbarui.',
        'deleted' => 'Aset berhasil dihapus.',
    ],

    'history' => [
        'created' => 'Aset dibuat.',
        'updated' => 'Aset diperbarui.',
        'empty' => 'Belum ada riwayat.',
    ],

    'validation' => [
        'branch_required' => 'Cabang wajib diisi.',
        'department_branch_mismatch' => 'Departemen harus berada pada cabang yang dipilih.',
        'location_branch_mismatch' => 'Lokasi harus berada pada cabang yang dipilih.',
    ],

    'attachments' => [
        'max_photos' => 'Maksimal 10 foto per aset.',
        'primary' => 'Utama',
        'empty' => 'Belum ada lampiran.',
        'kinds' => [
            'photo' => 'Foto',
            'document' => 'Dokumen',
        ],
        'fields' => [
            'file' => 'File',
            'kind' => 'Jenis',
            'primary' => 'Jadikan foto utama',
        ],
        'actions' => [
            'upload' => 'Upload & pasang',
        ],
        'toast' => [
            'attached' => 'Lampiran ditambahkan.',
            'detached' => 'Lampiran dihapus.',
        ],
    ],
];
