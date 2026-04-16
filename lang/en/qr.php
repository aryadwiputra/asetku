<?php

return [
    'title' => 'QR: :code',
    'subtitle' => 'Asset code: :code',

    'sections' => [
        'basic' => 'Basic information',
        'basic_desc' => 'Identity, ownership, and classification details.',
        'financial' => 'Financial information',
        'financial_desc' => 'Acquisition and depreciation snapshot.',
        'technical' => 'Technical information',
        'technical_desc' => 'Identifiers, stock details, and coordinates.',
        'attachments_desc' => 'Public photos and documents attached to this asset.',
        'history_desc' => 'Recent public activity related to this asset.',
        'organization' => 'Organization context',
        'organization_desc' => 'Owning organization for this asset.',
        'metadata_desc' => 'Custom fields and additional information.',
        'references' => 'References',
        'references_desc' => 'Warranty and vendor contract references.',
    ],

    'fields' => [
        'class' => 'Class',
        'unit' => 'Unit',
        'capex_opex' => 'CAPEX / OPEX',
        'warranty_end' => 'Warranty end',
        'rfid_tag' => 'RFID tag',
        'nfc_tag' => 'NFC tag',
        'label_template' => 'Label template',
        'is_consumable' => 'Consumable',
        'quantity' => 'Quantity',
        'available_quantity' => 'Available quantity',
        'is_pool' => 'Pool asset',
        'retention_until' => 'Retention until',
        'warranty' => 'Warranty',
        'warranty_notes' => 'Warranty notes',
        'vendor_contract' => 'Vendor contract',
        'vendor_contract_start' => 'Vendor contract start',
        'vendor_contract_end' => 'Vendor contract end',
        'vendor_contract_notes' => 'Vendor contract notes',
        'organization_slug' => 'Organization slug',
        'currency' => 'Currency',
        'timezone' => 'Timezone',
    ],

    'actions' => [
        'scan_again' => 'Scan again',
        'open_asset' => 'Open asset',
        'login' => 'Login to continue',
        'download' => 'Download',
    ],

    'messages' => [
        'login_required_actions' => 'Login to access full details and quick actions.',
        'org_inactive' => 'Organization is inactive.',
        'no_description' => 'No description has been added for this asset yet.',
        'public_read_only_title' => 'Public read-only view',
        'public_read_only_description' => 'This QR page is intended for quick lookup only. Any change still requires access to the application.',
        'file_unavailable' => 'This file is not available.',
    ],

    'empty' => [
        'photos' => 'No photos are available for this asset.',
        'documents' => 'No documents are available for this asset.',
        'metadata' => 'No custom data has been added yet.',
    ],

    'labels' => [
        'unknown_file' => 'Unknown file',
        'untitled_file' => 'Untitled file',
        'yes' => 'Yes',
        'no' => 'No',
    ],

    'depreciation' => [
        'straight_line' => 'Straight line',
        'diminishing' => 'Diminishing balance',
        'syd' => 'Sum of years digits',
        'units_of_production' => 'Units of production',
    ],

    'scan' => [
        'title' => 'Scan QR',
        'description' => 'Scan an asset QR using your camera, or enter the token manually.',
        'supported' => 'Camera scanning supported on this browser.',
        'not_supported' => 'Camera scanning is not supported on this browser.',
        'actions' => [
            'start' => 'Start scan',
            'stop' => 'Stop',
        ],
        'manual_title' => 'Manual entry',
        'manual_placeholder' => 'Paste QR URL or token...',
        'offline' => [
            'title' => 'Offline mode',
            'description' => 'Scans are saved locally and opened automatically when you are back online.',
        ],
    ],
];
