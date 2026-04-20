<?php

return [
    'title' => 'Disposals',
    'description' => 'Request, approve, and archive assets through a controlled disposal workflow.',
    'create_description' => 'Select an asset, choose disposal type, and submit for approval.',

    'fields' => [
        'asset' => 'Asset',
        'asset_search' => 'Search asset',
        'type' => 'Type',
        'status' => 'Status',
        'disposed_at' => 'Disposal date',
        'reason' => 'Reason',
        'proceeds' => 'Proceeds',
        'fees' => 'Fees',
        'fair_value' => 'Fair value',
        'net_proceeds' => 'Net proceeds',
        'book_value' => 'Book value',
        'gain_loss' => 'Gain / loss',
        'summary' => 'Summary',
        'approval' => 'Approval',
        'current_step' => 'Current step',
        'step' => 'Step',
        'documents' => 'Documents',
    ],

    'actions' => [
        'new' => 'New disposal',
        'submit' => 'Submit for approval',
        'ba' => 'BA Disposal (PDF)',
    ],

    'types' => [
        'sale' => 'Sale',
        'scrap' => 'Scrapping',
        'donation' => 'Donation',
        'writeoff' => 'Write-off',
    ],

    'status' => [
        'pending' => 'Pending',
        'approved' => 'Approved',
        'rejected' => 'Rejected',
        'executed' => 'Executed',
        'revoked' => 'Revoked',
    ],

    'step_status' => [
        'pending' => 'Pending',
        'approved' => 'Approved',
        'rejected' => 'Rejected',
    ],

    'toast' => [
        'requested' => 'Disposal request submitted.',
        'approved_step' => 'Step approved.',
        'rejected' => 'Request rejected.',
    ],

    'errors' => [
        'workflow_missing' => 'No active disposal workflow is configured for this organization.',
        'pending_exists' => 'This asset already has a pending disposal request.',
        'asset_deleted' => 'The selected asset is deleted.',
        'asset_archived' => 'The selected asset is archived.',
        'type_invalid' => 'Invalid disposal type.',
        'select_asset' => 'Select an asset first.',
        'no_approval' => 'No approval request found.',
    ],

    'empty' => [
        'documents' => 'No disposal documents yet.',
    ],

    'history' => [
        'requested' => 'Disposal requested.',
        'rejected' => 'Disposal rejected.',
        'executed' => 'Disposal executed.',
    ],
];
