<?php

return [
    'title' => 'Asset statuses',
    'description' => 'Manage asset condition/status options.',
    'fields' => [
        'code' => 'Code',
        'description' => 'Description',
    ],
    'actions' => [
        'new' => 'New status',
        'delete_confirm' => 'Delete ":name"?',
    ],
    'create' => [
        'title' => 'Create asset status',
        'description' => 'Add a new asset status for this organization.',
    ],
    'edit' => [
        'title' => 'Edit asset status',
    ],
    'toast' => [
        'created' => 'Asset status created.',
        'updated' => 'Asset status updated.',
        'deleted' => 'Asset status deleted.',
    ],
];
