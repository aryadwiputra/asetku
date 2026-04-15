<?php

return [
    'title' => 'Asset locations',
    'description' => 'Manage asset locations (hierarchical).',
    'fields' => [
        'code' => 'Code',
        'description' => 'Description',
        'parent' => 'Parent location',
        'parent_placeholder' => 'Select parent (optional)',
        'parent_none' => 'No parent',
    ],
    'actions' => [
        'new' => 'New location',
        'delete_confirm' => 'Delete ":name"?',
    ],
    'create' => [
        'title' => 'Create location',
        'description' => 'Add a new location.',
    ],
    'edit' => [
        'title' => 'Edit location',
    ],
    'toast' => [
        'created' => 'Location created.',
        'updated' => 'Location updated.',
        'deleted' => 'Location deleted.',
    ],
];

