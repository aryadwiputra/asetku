<?php

return [
    'toast' => [
        'queued' => 'Import queued.',
        'apply_queued' => 'Import apply queued.',
    ],

    'validation' => [
        'forbidden' => 'You do not have access to import in this organization.',
        'upload_failed' => 'Upload failed.',
        'not_ready' => 'Import is not ready yet.',
        'has_errors' => 'Import contains errors. Fix them before applying.',
    ],

    'actions' => [
        'validate' => 'Validate file',
        'queue' => 'Queue import',
        'apply' => 'Apply import',
    ],

    'runs' => [
        'title' => 'Import runs',
        'description' => 'Recent imports and their status.',
        'empty' => 'No imports yet.',
    ],

    'assets' => [
        'title' => 'Asset import',
        'description' => 'Validate and import assets from Excel, and attach photos via ZIP.',
        'upload_xlsx_title' => 'Upload Excel (.xlsx)',
        'upload_xlsx_desc' => 'Upload a template file and validate it asynchronously.',
        'upload_zip_title' => 'Upload photos ZIP',
        'upload_zip_desc' => 'File names must start with asset code (e.g. CODE_01.jpg).',
        'history' => [
            'imported' => 'Imported via Excel.',
        ],
        'errors' => [
            'name_required' => 'Name is required.',
            'branch_required' => 'Branch code is required.',
            'branch_not_found' => 'Branch not found: :code',
            'department_not_found' => 'Department not found: :code',
            'department_branch_mismatch' => 'Department does not belong to branch: :code',
            'location_not_found' => 'Location not found: :code',
            'location_branch_mismatch' => 'Location does not belong to branch: :code',
            'category_not_found' => 'Category not found: :code',
            'status_not_found' => 'Status not found: :code',
            'condition_not_found' => 'Condition not found: :code',
            'pic_not_found' => 'PIC not found: :name',
            'asset_user_not_found' => 'Asset user not found: :name',
            'purchase_date_invalid' => 'Invalid purchase date.',
            'cost_invalid' => 'Invalid cost.',
        ],
    ],
];
