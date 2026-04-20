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
        'production_units_total_estimate' => 'Estimasi total produksi',
        'production_units_unit' => 'Satuan produksi',
        'latitude' => 'Lintang',
        'longitude' => 'Bujur',
    ],
    'depreciation_methods' => [
        'straight_line' => 'Garis lurus',
        'diminishing' => 'Saldo menurun',
        'double_declining' => 'Saldo menurun ganda',
        'syd' => 'Jumlah angka tahun',
        'units_of_production' => 'Satuan produksi',
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

    'lifecycle' => [
        'page' => [
            'description' => 'Catat dan kelola siklus aset tanpa membuka halaman detail aset.',
            'search_label' => 'Cari aset',
            'search_placeholder' => 'Cari berdasarkan kode, nama, nomor seri…',
            'search_action' => 'Cari',
            'scan_action' => 'Scan QR',
            'results' => 'Hasil',
            'empty' => 'Ketik kata kunci atau scan QR untuk mulai.',
            'select_asset_hint' => 'Pilih aset dari daftar untuk mulai mencatat siklus aset.',
            'actions' => 'Aksi',
            'tabs' => [
                'status' => 'Status',
                'condition' => 'Kondisi',
                'documents' => 'Dokumen',
            ],
            'read_only_notice' => 'Kamu bisa melihat data, tetapi tidak punya izin untuk mengubahnya.',
            'scan_title' => 'Scan QR aset',
            'scan_not_supported' => 'Fitur scan QR tidak didukung di browser ini. Coba Chrome/Safari versi terbaru di mobile.',
            'scan_start' => 'Mulai scan',
            'scan_stop' => 'Berhenti',
        ],

        'actions' => [
            'record_event' => 'Catat event siklus hidup',
            'record_movement' => 'Catat mutasi/peminjaman',
        ],

        'fields' => [
            'stage' => 'Tahap',
            'document_type' => 'Jenis dokumen',
            'movement_type' => 'Jenis pergerakan',
            'performed_at' => 'Waktu kejadian',
            'notes' => 'Catatan',
        ],

        'placeholders' => [
            'stage' => 'Pilih tahap',
            'document_type' => 'Pilih jenis dokumen',
        ],

        'stages' => [
            'acquisition' => 'Perolehan',
            'receiving' => 'Penerimaan',
            'placement' => 'Penempatan',
            'usage' => 'Penggunaan',
            'maintenance' => 'Pemeliharaan',
            'mutation' => 'Mutasi',
            'disposal' => 'Penghapusan',
        ],

        'document_types' => [
            'invoice' => 'Invoice',
            'po' => 'Purchase Order (PO)',
            'bast' => 'BAST',
            'receipt' => 'Kwitansi',
            'work_order' => 'Work order',
            'service_report' => 'Laporan servis',
            'assignment_letter' => 'Surat penugasan',
            'loan_form' => 'Form peminjaman',
            'disposal_report' => 'Berita acara penghapusan',
            'sale_proof' => 'Bukti penjualan',
            'other' => 'Lainnya',
        ],

        'movement_types' => [
            'placement' => 'Penempatan',
            'transfer' => 'Transfer',
            'borrow' => 'Dipinjamkan',
            'return' => 'Dikembalikan',
        ],

        'toast' => [
            'recorded' => 'Event siklus hidup tercatat.',
            'movement_recorded' => 'Pergerakan tercatat.',
        ],

        'history' => [
            'lifecycle_recorded' => 'Mencatat tahap siklus hidup: :stage.',
            'status_changed' => 'Status berubah.',
            'condition_changed' => 'Kondisi berubah.',
            'assigned' => 'Pemegang diperbarui.',
            'relocated' => 'Penempatan diperbarui.',
            'attachment_added' => 'Lampiran ditambahkan.',
            'attachment_removed' => 'Lampiran dihapus.',
            'placed' => 'Ditempatkan.',
            'transferred' => 'Dipindahkan.',
            'borrowed' => 'Dipinjamkan.',
            'returned' => 'Dikembalikan.',
        ],

        'validation' => [
            'destination_required' => 'Pilih minimal satu tujuan.',
            'borrow_requires_user' => 'Peminjaman wajib memilih pemegang.',
            'department_branch_mismatch' => 'Departemen harus berada pada cabang yang dipilih.',
            'location_branch_mismatch' => 'Lokasi harus berada pada cabang yang dipilih.',
        ],
    ],
];
