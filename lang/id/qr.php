<?php

return [
    'title' => 'QR: :code',
    'subtitle' => 'Kode aset: :code',

    'sections' => [
        'basic' => 'Informasi dasar',
        'basic_desc' => 'Identitas, kepemilikan, dan klasifikasi aset.',
        'financial' => 'Informasi keuangan',
        'financial_desc' => 'Ringkasan perolehan dan depresiasi.',
        'technical' => 'Informasi teknis',
        'technical_desc' => 'Identitas teknis, stok, dan koordinat.',
        'attachments_desc' => 'Foto dan dokumen publik yang terhubung ke aset ini.',
        'history_desc' => 'Aktivitas terbaru terkait aset ini.',
        'organization' => 'Konteks organisasi',
        'organization_desc' => 'Organisasi pemilik aset ini.',
        'metadata_desc' => 'Custom field dan informasi tambahan.',
        'references' => 'Referensi',
        'references_desc' => 'Referensi garansi dan kontrak vendor.',
    ],

    'fields' => [
        'class' => 'Kelas',
        'unit' => 'Satuan',
        'capex_opex' => 'CAPEX / OPEX',
        'warranty_end' => 'Akhir garansi',
        'rfid_tag' => 'Tag RFID',
        'nfc_tag' => 'Tag NFC',
        'label_template' => 'Template label',
        'is_consumable' => 'Consumable',
        'quantity' => 'Jumlah',
        'available_quantity' => 'Jumlah tersedia',
        'is_pool' => 'Aset pool',
        'retention_until' => 'Retensi sampai',
        'warranty' => 'Garansi',
        'warranty_notes' => 'Catatan garansi',
        'vendor_contract' => 'Kontrak vendor',
        'vendor_contract_start' => 'Mulai kontrak vendor',
        'vendor_contract_end' => 'Akhir kontrak vendor',
        'vendor_contract_notes' => 'Catatan kontrak vendor',
        'organization_slug' => 'Slug organisasi',
        'currency' => 'Mata uang',
        'timezone' => 'Zona waktu',
    ],

    'actions' => [
        'scan_again' => 'Scan lagi',
        'open_asset' => 'Buka aset',
        'login' => 'Login untuk lanjut',
        'download' => 'Unduh',
    ],

    'messages' => [
        'login_required_actions' => 'Login untuk melihat detail lengkap dan melakukan aksi cepat.',
        'org_inactive' => 'Organisasi sedang nonaktif.',
        'no_description' => 'Belum ada deskripsi untuk aset ini.',
        'public_read_only_title' => 'Tampilan publik read-only',
        'public_read_only_description' => 'Halaman QR ini hanya untuk melihat data secara cepat. Perubahan data tetap harus dilakukan dari aplikasi.',
        'file_unavailable' => 'File ini tidak tersedia.',
    ],

    'empty' => [
        'photos' => 'Belum ada foto untuk aset ini.',
        'documents' => 'Belum ada dokumen untuk aset ini.',
        'metadata' => 'Belum ada data tambahan.',
    ],

    'labels' => [
        'unknown_file' => 'File tidak dikenal',
        'untitled_file' => 'File tanpa judul',
        'yes' => 'Ya',
        'no' => 'Tidak',
    ],

    'depreciation' => [
        'straight_line' => 'Garis lurus',
        'diminishing' => 'Saldo menurun',
        'syd' => 'Jumlah angka tahun',
        'units_of_production' => 'Satuan produksi',
    ],

    'scan' => [
        'title' => 'Scan QR',
        'description' => 'Scan QR aset memakai kamera, atau masukkan token secara manual.',
        'supported' => 'Browser ini mendukung scan kamera.',
        'not_supported' => 'Browser ini tidak mendukung scan kamera.',
        'actions' => [
            'start' => 'Mulai scan',
            'stop' => 'Berhenti',
        ],
        'manual_title' => 'Input manual',
        'manual_placeholder' => 'Tempel URL QR atau token...',
        'offline' => [
            'title' => 'Mode offline',
            'description' => 'Hasil scan disimpan lokal dan akan dibuka otomatis saat online.',
        ],
    ],
];
