<?php

return [
    'title' => 'Depreciation',
    'description' => 'Run and review asset depreciation schedules.',
    'actions' => [
        'run' => 'Run depreciation',
        'export' => 'Export',
        'view_schedule' => 'View schedule',
    ],
    'kpis' => [
        'eligible_assets' => 'Eligible assets',
        'latest_period_total_depreciation' => 'Latest period total depreciation',
    ],
    'fields' => [
        'month' => 'Month',
        'period' => 'Period',
        'period_start' => 'Period start',
        'period_end' => 'Period end',
        'status' => 'Status',
        'created' => 'Created',
        'skipped' => 'Skipped',
        'started_at' => 'Started',
        'finished_at' => 'Finished',
        'method' => 'Method',
        'book_value_start' => 'Book value (start)',
        'book_value_end' => 'Book value (end)',
        'depreciation_amount' => 'Depreciation',
        'accumulated_depreciation' => 'Accumulated depreciation',
        'units' => 'Units',
        'units_total_estimate' => 'Total estimate',
        'units_in_period' => 'Units in period',
    ],
    'status' => [
        'queued' => 'Queued',
        'running' => 'Running',
        'completed' => 'Completed',
        'failed' => 'Failed',
    ],
    'methods' => [
        'straight_line' => 'Straight-line',
        'diminishing' => 'Declining balance',
        'double_declining' => 'Double declining balance',
        'syd' => 'Sum of years digits',
        'units_of_production' => 'Units of production',
    ],
    'skip_reasons' => [
        'missing_purchase_date' => 'Missing purchase date.',
        'missing_cost' => 'Missing cost.',
        'missing_useful_life' => 'Missing useful life.',
        'not_acquired_yet' => 'Not acquired yet for this period.',
        'already_at_residual' => 'Already at residual value.',
        'no_depreciation_for_period' => 'No depreciation for this period.',
        'missing_production_total_estimate' => 'Missing total production estimate.',
        'missing_production_units_for_period' => 'No production usage recorded for this period.',
    ],
    'toast' => [
        'run_queued' => 'Depreciation run queued.',
    ],
    'notifications' => [
        'residual_reached' => [
            'subject' => 'Asset reached residual value: :code',
            'line1' => 'Asset :code (:name) has reached its residual value.',
            'line2' => 'Residual: :residual (period end: :period_end).',
        ],
    ],
];
