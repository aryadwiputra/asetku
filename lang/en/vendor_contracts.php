<?php

return [
    'title' => 'Vendor contracts',
    'description' => 'Manage vendor contracts and SLA settings.',
    'fields' => [
        'vendor_name' => 'Vendor name',
        'contract_number' => 'Contract number',
        'start_date' => 'Start date',
        'end_date' => 'End date',
        'sla_response_hours' => 'SLA response (hours)',
        'sla_resolution_hours' => 'SLA resolution (hours)',
        'notes' => 'Notes',
    ],
    'actions' => [
        'new' => 'New contract',
        'delete_confirm' => 'Delete ":name"?',
    ],
    'create' => [
        'title' => 'Create vendor contract',
        'description' => 'Add a new vendor contract.',
    ],
    'edit' => [
        'title' => 'Edit vendor contract',
    ],
    'toast' => [
        'created' => 'Vendor contract created.',
        'updated' => 'Vendor contract updated.',
        'deleted' => 'Vendor contract deleted.',
    ],
];

