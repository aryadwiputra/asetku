<?php

return [
    'inventory' => [
        'title' => 'Laporan inventaris',
        'description' => 'Ringkasan inventaris untuk organisasi aktif.',
        'filters' => [
            'search' => 'Cari',
            'branch' => 'Cabang',
            'status' => 'Status',
            'condition' => 'Kondisi',
            'category' => 'Kategori',
            'location' => 'Lokasi',
            'department' => 'Departemen',
        ],
        'actions' => [
            'apply' => 'Terapkan',
            'clear' => 'Reset',
            'export' => 'Export',
            'print_stocktake' => 'Cetak lembar stok opname',
        ],
        'kpis' => [
            'total_assets' => 'Total aset',
            'total_value' => 'Total nilai',
            'by_branch' => 'Cabang teratas',
            'by_status' => 'Status teratas',
            'by_condition' => 'Kondisi teratas',
        ],
        'stocktake' => [
            'title' => 'Lembar stok opname',
            'hint_print' => 'Gunakan fitur print browser untuk simpan PDF atau cetak A4.',
            'actions' => [
                'print' => 'Cetak',
            ],
            'columns' => [
                'found' => 'Ditemukan?',
                'condition_actual' => 'Kondisi (aktual)',
                'notes' => 'Catatan',
                'checked_by' => 'Dicek oleh',
                'signature' => 'Tanda tangan',
            ],
        ],
        'empty' => [
            'branch_required' => 'Pilih cabang untuk mencetak lembar stok opname.',
        ],
    ],
];
