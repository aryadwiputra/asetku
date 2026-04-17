<?php

return [
    'title' => 'Assets',
    'description' => 'Register and manage assets in the current organization.',

    'fields' => [
        'code' => 'Asset code',
        'name' => 'Asset name',
        'description' => 'Description',
        'branch' => 'Branch',
        'department' => 'Department',
        'location' => 'Location',
        'category' => 'Category',
        'status' => 'Status',
        'condition' => 'Condition',
        'pic' => 'Person in charge',
        'asset_user' => 'Assigned to',
        'brand' => 'Brand',
        'model' => 'Model',
        'series' => 'Series',
        'serial_number' => 'Serial number',
        'imei' => 'IMEI',
        'purchase_date' => 'Acquired date',
        'cost' => 'Acquisition cost',
        'book_value' => 'Book value',
        'depreciation_method' => 'Depreciation method',
        'useful_life_months' => 'Useful life (months)',
        'residual_value' => 'Residual value',
        'latitude' => 'Latitude',
        'longitude' => 'Longitude',
    ],

    'placeholders' => [
        'code_auto' => 'Auto-generated (optional)',
        'branch' => 'Select branch',
        'department' => 'Select department',
        'location' => 'Select location',
        'category' => 'Select category',
        'status' => 'Select status',
        'condition' => 'Select condition',
        'pic' => 'Select PIC',
        'asset_user' => 'Select assignee',
    ],

    'actions' => [
        'new' => 'New asset',
        'edit' => 'Edit asset',
        'export' => 'Export',
        'delete_confirm' => 'Delete asset :code?',
        'show_advanced' => 'Show advanced fields',
        'open_qr' => 'Open QR page',
        'copy_qr_link' => 'Copy QR link',
    ],

    'views' => [
        'all' => 'All assets',
        'manage' => 'Manage views',
    ],

    'filters' => [
        'title' => 'Filters',
        'more' => 'Filters',
        'active_count' => ':count active',
        'clear_all' => 'Clear all',
        'remove' => 'Remove filter',
        'status' => 'Status',
        'condition' => 'Condition',
        'cost_min' => 'Min cost',
        'cost_max' => 'Max cost',
        'groups' => [
            'structure' => 'Structure',
            'classification' => 'Classification',
            'ownership' => 'Ownership',
            'finance' => 'Finance',
        ],
    ],

    'kpis' => [
        'total_assets' => 'Total assets',
        'total_value' => 'Total value',
        'by_status' => 'By status',
        'by_condition' => 'By condition',
        'others' => 'Others',
        'scoped' => 'Current filters',
    ],

    'sections' => [
        'details' => 'Details',
        'details_desc' => 'Basic information and ownership.',
        'financial' => 'Financial',
        'financial_desc' => 'Cost and depreciation snapshot.',
        'history' => 'History',
        'history_desc' => 'Recent changes and events.',
        'attachments' => 'Attachments',
        'attachments_desc' => 'Photos and documents for this asset.',
        'qr' => 'QR / Barcode',
        'qr_desc' => 'Use this link for label printing and scanning.',
        'metadata' => 'Metadata',
        'custom_fields' => 'Custom fields',
        'map' => 'Map',
        'map_desc' => 'Asset coordinates (if available).',
    ],

    'map' => [
        'empty' => 'No coordinates set.',
    ],

    'create' => [
        'title' => 'Create asset',
        'description' => 'Add a new asset to the current organization.',
    ],

    'edit' => [
        'title' => 'Edit asset (:code)',
        'description' => 'Update asset information.',
    ],

    'show' => [
        'title' => 'Asset (:code)',
        'subtitle' => 'Code: :code',
    ],

    'toast' => [
        'created' => 'Asset created.',
        'updated' => 'Asset updated.',
        'deleted' => 'Asset deleted.',
    ],

    'history' => [
        'created' => 'Asset created.',
        'updated' => 'Asset updated.',
        'empty' => 'No history yet.',
    ],

    'validation' => [
        'branch_required' => 'Branch is required.',
        'department_branch_mismatch' => 'Department must belong to the selected branch.',
        'location_branch_mismatch' => 'Location must belong to the selected branch.',
    ],

    'attachments' => [
        'max_photos' => 'Maximum 10 photos per asset.',
        'primary' => 'Primary',
        'empty' => 'No attachments yet.',
        'kinds' => [
            'photo' => 'Photos',
            'document' => 'Documents',
        ],
        'fields' => [
            'file' => 'File',
            'kind' => 'Type',
            'primary' => 'Set as primary photo',
        ],
        'actions' => [
            'upload' => 'Upload & attach',
        ],
        'toast' => [
            'attached' => 'Attachment added.',
            'detached' => 'Attachment removed.',
        ],
    ],

    'lifecycle' => [
        'page' => [
            'description' => 'Record and manage an asset lifecycle without opening the asset detail page.',
            'search_label' => 'Find asset',
            'search_placeholder' => 'Search by code, name, serial number…',
            'search_action' => 'Search',
            'scan_action' => 'Scan QR',
            'results' => 'Results',
            'empty' => 'Type a keyword or scan a QR code to start.',
            'select_asset_hint' => 'Select an asset from the list to start recording lifecycle events.',
            'actions' => 'Actions',
            'tabs' => [
                'status' => 'Status',
                'condition' => 'Condition',
                'documents' => 'Documents',
            ],
            'read_only_notice' => 'You can view the data, but you do not have permission to make changes.',
            'scan_title' => 'Scan asset QR',
            'scan_not_supported' => 'QR scanning is not supported on this browser. Try a newer Chrome/Safari on mobile.',
            'scan_start' => 'Start scanning',
            'scan_stop' => 'Stop',
        ],

        'actions' => [
            'record_event' => 'Record lifecycle event',
            'record_movement' => 'Record movement',
        ],

        'fields' => [
            'stage' => 'Stage',
            'document_type' => 'Document type',
            'movement_type' => 'Movement type',
            'performed_at' => 'Performed at',
            'notes' => 'Notes',
        ],

        'placeholders' => [
            'stage' => 'Select stage',
            'document_type' => 'Select document type',
        ],

        'stages' => [
            'acquisition' => 'Acquisition',
            'receiving' => 'Receiving',
            'placement' => 'Placement',
            'usage' => 'Usage',
            'maintenance' => 'Maintenance',
            'mutation' => 'Mutation',
            'disposal' => 'Disposal',
        ],

        'document_types' => [
            'invoice' => 'Invoice',
            'po' => 'Purchase order (PO)',
            'bast' => 'BAST',
            'receipt' => 'Receipt',
            'work_order' => 'Work order',
            'service_report' => 'Service report',
            'assignment_letter' => 'Assignment letter',
            'loan_form' => 'Loan form',
            'disposal_report' => 'Disposal report',
            'sale_proof' => 'Sale proof',
            'other' => 'Other',
        ],

        'movement_types' => [
            'placement' => 'Placement',
            'transfer' => 'Transfer',
            'borrow' => 'Borrow',
            'return' => 'Return',
        ],

        'toast' => [
            'recorded' => 'Lifecycle event recorded.',
            'movement_recorded' => 'Movement recorded.',
        ],

        'history' => [
            'lifecycle_recorded' => 'Recorded lifecycle stage: :stage.',
            'status_changed' => 'Status changed.',
            'condition_changed' => 'Condition changed.',
            'assigned' => 'Assignee updated.',
            'relocated' => 'Placement updated.',
            'attachment_added' => 'Attachment added.',
            'attachment_removed' => 'Attachment removed.',
            'placed' => 'Placed.',
            'transferred' => 'Transferred.',
            'borrowed' => 'Borrowed.',
            'returned' => 'Returned.',
        ],

        'validation' => [
            'destination_required' => 'Select at least one destination field.',
            'borrow_requires_user' => 'Borrow requires an assignee.',
            'department_branch_mismatch' => 'Department must belong to the selected branch.',
            'location_branch_mismatch' => 'Location must belong to the selected branch.',
        ],
    ],
];
