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
        'warranty' => 'Warranty template',
        'vendor_contract' => 'Primary vendor contract',
        'brand' => 'Brand',
        'model' => 'Model',
        'series' => 'Series',
        'serial_number' => 'Serial number',
        'imei' => 'IMEI',
        'purchase_date' => 'Acquired date',
        'warranty_end' => 'Warranty end',
        'cost' => 'Acquisition cost',
        'book_value' => 'Book value',
        'depreciation_method' => 'Depreciation method',
        'useful_life_months' => 'Useful life (months)',
        'residual_value' => 'Residual value',
        'production_units_total_estimate' => 'Total production estimate',
        'production_units_unit' => 'Production unit',
        'latitude' => 'Latitude',
        'longitude' => 'Longitude',
    ],
    'depreciation_methods' => [
        'straight_line' => 'Straight-line',
        'diminishing' => 'Declining balance',
        'double_declining' => 'Double declining balance',
        'syd' => 'Sum of years digits',
        'units_of_production' => 'Units of production',
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
        'change_status' => 'Change status',
        'bulk_change_status' => 'Bulk change status',
        'bulk_change_status_confirm' => 'Change the status for :count selected assets?',
        'show_advanced' => 'Show advanced fields',
        'open_qr' => 'Open QR page',
        'copy_qr_link' => 'Copy QR link',
        'regenerate_qr_token' => 'Regenerate QR token',
        'regenerate_qr_token_confirm' => 'Regenerate the QR token for asset :code? Existing public QR links and labels will stop working immediately.',
        'regenerate_qr_token_submit' => 'Regenerate token',
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
        'vendor_contract' => 'Vendor contract',
        'vendor_contract_desc' => 'Current vendor linkage, service coverage, and contract health.',
        'warranty' => 'Warranty',
        'warranty_desc' => 'Current warranty status and claim history.',
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
        'movements' => 'Movements',
        'movements_desc' => 'Asset transfer and placement history.',
        'maintenance' => 'Maintenance',
        'maintenance_desc' => 'Maintenance and service history.',
        'depreciation' => 'Depreciation',
        'depreciation_desc' => 'Depreciation schedule and entries.',
        'audits' => 'Audits',
        'audits_desc' => 'Audit records and findings.',
    ],

    'tabs' => [
        'overview' => 'Overview',
        'history' => 'History',
        'movements' => 'Movements',
        'maintenance' => 'Maintenance',
        'warranty' => 'Warranty',
        'attachments' => 'Attachments',
        'depreciation' => 'Depreciation',
        'audits' => 'Audits',
    ],

    'map' => [
        'empty' => 'No coordinates set.',
    ],

    'movements' => [
        'empty' => 'No movements yet.',
        'fields' => [
            'type' => 'Type',
            'from' => 'From',
            'to' => 'To',
            'status' => 'Status',
            'performed_at' => 'Date',
        ],
    ],

    'maintenance' => [
        'empty' => 'No maintenance records yet.',
        'fields' => [
            'type' => 'Type',
            'description' => 'Description',
            'vendor' => 'Vendor / Technician',
            'cost' => 'Cost',
            'status' => 'Status',
            'performed_at' => 'Date',
        ],
    ],

    'depreciation' => [
        'empty' => 'No depreciation entries yet.',
        'fields' => [
            'period' => 'Period',
            'cost' => 'Cost',
            'residual_value' => 'Residual',
            'book_value_start' => 'Book Value (Start)',
            'depreciation' => 'Depreciation',
            'accumulated' => 'Accumulated',
            'book_value_end' => 'Book Value (End)',
            'units' => 'Units',
        ],
    ],

    'audits' => [
        'empty' => 'No audit records yet.',
        'fields' => [
            'audited_at' => 'Audit Date',
            'status' => 'Status',
            'location' => 'Location',
            'notes' => 'Notes',
        ],
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
        'bulk_status_updated' => ':count asset statuses updated.',
        'qr_token_regenerated' => 'QR token regenerated. Old public links are no longer valid.',
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
        'status_transition_blocked' => 'This status transition is not allowed.',
        'bulk_status_transition_blocked' => 'Some assets cannot use this transition: :assets.',
    ],
    'warranty' => [
        'unknown' => 'Unknown',
        'active' => 'Active',
        'expiring_soon' => 'Expiring soon',
        'expired' => 'Expired',
        'days_remaining' => ':count days remaining',
        'claims' => 'Warranty Claims',
        'no_claims' => 'No claims yet.',
        'claim_created' => 'Warranty claim created.',
        'claim_updated' => 'Warranty claim updated.',
        'fields' => [
            'claim_reference' => 'Claim reference',
            'status' => 'Claim status',
            'result' => 'Result',
            'submitted_at' => 'Submitted at',
            'resolved_at' => 'Resolved at',
        ],
        'toast' => [
            'claim_created' => 'Warranty claim saved.',
            'claim_updated' => 'Warranty claim updated.',
        ],
        'notifications' => [
            'expiring_soon' => 'Asset warranty is expiring soon.',
        ],
    ],

    'attachments' => [
        'max_photos' => 'Maximum 20 photos per asset.',
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

        'transitions' => [
            'allowed' => 'This transition is valid.',
            'discouraged' => 'This transition is allowed, but not recommended.',
            'blocked' => 'This transition is blocked by status rules.',
            'discouraged_direct_disposal' => 'Directly moving to disposed should go through the disposal flow to keep the audit trail complete.',
            'blocked_from_disposed' => 'Disposed assets cannot be reactivated directly.',
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

        'notes' => [
            'moved_to_maintenance' => 'Automatically moved to maintenance status from work order :number.',
            'restored_after_maintenance' => 'Automatically restored after work order :number was closed.',
        ],

        'validation' => [
            'destination_required' => 'Select at least one destination field.',
            'borrow_requires_user' => 'Borrow requires an assignee.',
            'department_branch_mismatch' => 'Department must belong to the selected branch.',
            'location_branch_mismatch' => 'Location must belong to the selected branch.',
        ],
    ],
];
