<?php

return [
    'title' => 'Audit',
    'description' => 'Audit schedules and findings management.',

    'status' => [
        'draft' => 'Draft',
        'in_progress' => 'In Progress',
        'completed' => 'Completed',
        'cancelled' => 'Cancelled',
    ],

    'status_values' => [
        'matched' => 'Matched',
        'mismatched' => 'Mismatched',
        'not_found' => 'Not Found',
    ],

    'approval_status' => [
        'pending' => 'Pending Approval',
        'approved' => 'Approved',
        'rejected' => 'Rejected',
    ],

    'fields' => [
        'name' => 'Schedule Name',
        'description' => 'Description',
        'start_date' => 'Start Date',
        'end_date' => 'End Date',
        'auditors' => 'Auditors',
        'assets' => 'Assets',
        'status' => 'Status',
        'current_location' => 'Current Location',
        'expected_location' => 'Expected Location',
        'current_condition' => 'Current Condition',
        'notes' => 'Notes',
        'signature' => 'Signature',
        'photos' => 'Photos',
        'approval_status' => 'Approval Status',
        'audited_at' => 'Audit Date',
        'total_assets' => 'Total Assets',
        'completed_assets' => 'Completed',
    ],

    'actions' => [
        'new_schedule' => 'New Audit Schedule',
        'start_audit' => 'Start Audit',
        'complete_audit' => 'Complete Audit',
        'cancel_audit' => 'Cancel Audit',
        'record_finding' => 'Record Finding',
        'approve' => 'Approve',
        'reject' => 'Reject',
        'ad_hoc_audit' => 'Ad-hoc Audit',
    ],

    'sections' => [
        'schedule_info' => 'Schedule Information',
        'auditors' => 'Assigned Auditors',
        'asset_list' => 'Assets to Audit',
        'findings' => 'Audit Findings',
        'progress' => 'Progress',
    ],

    'validation' => [
        'at_least_one_auditor' => 'At least one auditor must be assigned.',
        'at_least_one_asset' => 'At least one asset must be assigned.',
        'end_date_after_start' => 'End date must be after or equal to start date.',
        'cannot_start' => 'Cannot start audit. Schedule must be in draft status.',
        'cannot_complete' => 'Cannot complete audit. Schedule must be in progress.',
    ],

    'toast' => [
        'schedule_created' => 'Audit schedule created.',
        'schedule_updated' => 'Audit schedule updated.',
        'schedule_deleted' => 'Audit schedule deleted.',
        'schedule_started' => 'Audit has started.',
        'schedule_completed' => 'Audit has been completed.',
        'finding_created' => 'Audit finding recorded.',
        'finding_updated' => 'Audit finding updated.',
        'finding_deleted' => 'Audit finding deleted.',
        'finding_approved' => 'Audit finding approved.',
        'finding_rejected' => 'Audit finding rejected.',
    ],

    'notifications' => [
        'finding_submitted' => [
            'subject' => 'Audit Finding Submitted for :asset_code',
            'line1' => ':auditor has submitted an audit finding for asset :asset_code.',
            'line2' => 'Finding status: :status',
            'action' => 'View Details',
            'unknown_auditor' => 'Unknown Auditor',
        ],
    ],

    'history' => [
        'finding_recorded' => 'Audit finding recorded by :auditor (Status: :status)',
    ],

    'empty_auditors' => 'No auditors assigned.',
    'empty_assets' => 'No assets assigned.',
    'empty_findings' => 'No findings recorded yet.',

    'tabs' => [
        'schedules' => 'Schedules',
        'findings' => 'Findings',
    ],

    'my_audits' => 'My Audits',
    'pending_approval' => 'Pending Approval',

    'placeholders' => [
        'name' => 'e.g., Q2 Asset Audit',
        'description' => 'Describe the audit scope and objectives',
        'search_assets' => 'Search by code or name',
        'all_branches' => 'All branches',
        'select_location' => 'Select location',
        'select_condition' => 'Select condition',
        'notes' => 'Describe any discrepancies or observations',
        'select_auditors' => 'Select auditors',
        'select_assets' => 'Select assets',
    ],

    'fields_assets_selected' => 'assets selected',
    'empty_schedules' => 'No audit schedules yet',
    'empty_schedules_desc' => 'Create your first audit schedule to start tracking asset audits.',
];
