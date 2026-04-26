<?php

return [
    'title' => 'Vendors',
    'description' => 'Manage vendor profiles, blacklist status, and automatic performance ratings.',
    'fields' => [
        'name' => 'Vendor name',
        'tax_number' => 'NPWP / tax number',
        'email' => 'Email',
        'phone' => 'Phone',
        'address' => 'Address',
        'service_category' => 'Service category',
        'is_blacklisted' => 'Blacklisted',
        'blacklist_reason' => 'Blacklist reason',
        'notes' => 'Notes',
        'rating_total' => 'Overall rating',
        'contracts_count' => 'Contracts',
    ],
    'actions' => [
        'new' => 'New vendor',
        'delete_confirm' => 'Delete ":name"?',
    ],
    'badges' => [
        'blacklisted_suffix' => '(blacklisted)',
    ],
    'validation' => [
        'blacklisted' => 'This vendor is blacklisted and cannot be used for new contracts.',
    ],
    'create' => [
        'title' => 'Create vendor',
        'description' => 'Add a vendor profile for maintenance, subscription, or lease services.',
    ],
    'edit' => [
        'title' => 'Edit vendor',
    ],
    'toast' => [
        'created' => 'Vendor created.',
        'updated' => 'Vendor updated.',
        'deleted' => 'Vendor deleted.',
    ],
];
