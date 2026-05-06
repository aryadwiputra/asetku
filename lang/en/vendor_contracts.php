<?php

return [
    'title' => 'Vendor contracts',
    'description' => 'Manage operational vendor contracts, covered assets, reminders, renewals, and documents.',
    'fields' => [
        'vendor' => 'Vendor',
        'vendor_name' => 'Vendor name',
        'title' => 'Contract title',
        'type' => 'Contract type',
        'contract_number' => 'Contract number',
        'status' => 'Status',
        'baseline_cost' => 'Baseline cost',
        'start_date' => 'Start date',
        'end_date' => 'End date',
        'sla_response_hours' => 'SLA response (hours)',
        'sla_resolution_hours' => 'SLA resolution (hours)',
        'notes' => 'Notes',
        'terms' => 'Terms',
        'assets' => 'Covered assets',
        'maintenance_cost_total' => 'Maintenance cost total',
        'documents' => 'Documents',
    ],
    'types' => [
        'maintenance' => 'Maintenance',
        'subscription' => 'Subscription',
        'lease' => 'Lease',
    ],
    'statuses' => [
        'draft' => 'Draft',
        'active' => 'Active',
        'expired' => 'Expired',
        'expiring_soon' => 'Expiring soon',
    ],
    'actions' => [
        'new' => 'New contract',
        'renew' => 'Renew contract',
        'upload_document' => 'Upload document',
        'delete_confirm' => 'Delete ":name"?',
    ],
    'create' => [
        'title' => 'Create vendor contract',
        'description' => 'Add a new operational vendor contract.',
    ],
    'edit' => [
        'title' => 'Edit vendor contract',
    ],
    'show' => [
        'title' => 'Contract detail',
        'description' => 'Review terms, covered assets, renewals, costs, and documents.',
        'documents_empty' => 'No contract documents yet.',
        'renewals_empty' => 'No renewal drafts yet.',
        'assets_empty' => 'No assets linked to this contract.',
    ],
    'renewals' => [
        'title' => 'Renewal history',
        'status' => 'Renewal status',
        'created_at' => 'Created at',
        'field_differences' => 'Terms comparison',
        'statuses' => [
            'draft' => 'Draft',
            'active' => 'Active',
            'activated' => 'Activated',
            'replaced' => 'Replaced',
            'expired' => 'Expired',
        ],
        'suffix' => 'Renewal',
    ],
    'documents' => [
        'fallback_title' => 'Document',
        'fallback_type' => 'File',
    ],
    'toast' => [
        'created' => 'Vendor contract created.',
        'updated' => 'Vendor contract updated.',
        'deleted' => 'Vendor contract deleted.',
        'renewed' => 'Renewal draft created from the current contract.',
        'document_uploaded' => 'Contract document uploaded.',
    ],
    'notifications' => [
        'expiring_soon' => 'Vendor contract is expiring soon.',
    ],
];
