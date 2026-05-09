<?php

return [
    'inventory' => [
        'title' => 'Inventory report',
        'description' => 'High-level inventory overview for the current organization.',
        'filters' => [
            'search' => 'Search',
            'branch' => 'Branch',
            'status' => 'Status',
            'condition' => 'Condition',
            'category' => 'Category',
            'location' => 'Location',
            'department' => 'Department',
        ],
        'actions' => [
            'apply' => 'Apply',
            'clear' => 'Clear',
            'export' => 'Export',
            'print_stocktake' => 'Print stocktake sheet',
        ],
        'kpis' => [
            'total_assets' => 'Total assets',
            'total_value' => 'Total value',
            'by_branch' => 'Top branches',
            'by_status' => 'Top status',
            'by_condition' => 'Top conditions',
        ],
        'stocktake' => [
            'title' => 'Stocktake sheet',
            'hint_print' => 'Use your browser print to save as PDF or print A4.',
            'actions' => [
                'print' => 'Print',
            ],
            'columns' => [
                'found' => 'Found?',
                'condition_actual' => 'Condition (actual)',
                'notes' => 'Notes',
                'checked_by' => 'Checked by',
                'signature' => 'Signature',
                'code' => 'Code',
                'asset' => 'Asset',
                'location' => 'Location',
                'pic' => 'PIC',
                'status' => 'Status',
                'condition' => 'Condition',
                'qr' => 'QR',
            ],
        ],
        'empty' => [
            'branch_required' => 'Select a branch to print the stocktake sheet.',
        ],
    ],
];
