<?php

return [
    'title' => 'Penyusutan',
    'description' => 'Jalankan dan tinjau jadwal penyusutan aset.',
    'actions' => [
        'run' => 'Jalankan penyusutan',
        'export' => 'Export',
        'view_schedule' => 'Lihat jadwal',
    ],
    'kpis' => [
        'eligible_assets' => 'Aset eligible',
        'latest_period_total_depreciation' => 'Total penyusutan periode terakhir',
    ],
    'fields' => [
        'month' => 'Bulan',
        'period' => 'Periode',
        'period_start' => 'Mulai periode',
        'period_end' => 'Akhir periode',
        'status' => 'Status',
        'created' => 'Dibuat',
        'skipped' => 'Dilewati',
        'started_at' => 'Mulai',
        'finished_at' => 'Selesai',
        'method' => 'Metode',
        'book_value_start' => 'Nilai buku (awal)',
        'book_value_end' => 'Nilai buku (akhir)',
        'depreciation_amount' => 'Penyusutan',
        'accumulated_depreciation' => 'Akumulasi penyusutan',
        'units' => 'Satuan produksi',
        'units_total_estimate' => 'Estimasi total',
        'units_in_period' => 'Pemakaian periode ini',
    ],
    'status' => [
        'queued' => 'Antri',
        'running' => 'Berjalan',
        'completed' => 'Selesai',
        'failed' => 'Gagal',
    ],
    'methods' => [
        'straight_line' => 'Garis lurus',
        'diminishing' => 'Saldo menurun',
        'double_declining' => 'Saldo menurun ganda',
        'syd' => 'Jumlah angka tahun',
        'units_of_production' => 'Satuan produksi',
    ],
    'skip_reasons' => [
        'missing_purchase_date' => 'Tanggal perolehan belum diisi.',
        'missing_cost' => 'Harga perolehan belum diisi.',
        'missing_useful_life' => 'Umur ekonomis belum diisi.',
        'not_acquired_yet' => 'Aset belum diperoleh pada periode ini.',
        'already_at_residual' => 'Nilai buku sudah mencapai nilai residu.',
        'no_depreciation_for_period' => 'Tidak ada penyusutan untuk periode ini.',
        'missing_production_total_estimate' => 'Estimasi total produksi belum diisi.',
        'missing_production_units_for_period' => 'Pemakaian produksi periode ini belum dicatat.',
    ],
    'toast' => [
        'run_queued' => 'Proses penyusutan masuk antrian.',
    ],
    'notifications' => [
        'residual_reached' => [
            'subject' => 'Aset mencapai nilai residu: :code',
            'line1' => 'Aset :code (:name) telah mencapai nilai residu.',
            'line2' => 'Residu: :residual (akhir periode: :period_end).',
        ],
    ],
];
