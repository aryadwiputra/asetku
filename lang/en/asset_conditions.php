<?php

return [
    'title' => 'Asset conditions',
    'description' => 'Define asset condition master data (scoped per organization).',
    'fields' => [
        'code' => 'Code',
        'description' => 'Description',
    ],
    'actions' => [
        'new' => 'New condition',
        'delete_confirm' => 'Delete condition ":name"?',
    ],
    'create' => [
        'title' => 'Create condition',
        'description' => 'Add a new asset condition.',
    ],
    'edit' => [
        'title' => 'Edit condition',
        'description' => 'Update asset condition.',
    ],
    'toast' => [
        'created' => 'Condition created.',
        'updated' => 'Condition updated.',
        'deleted' => 'Condition deleted.',
    ],
];
