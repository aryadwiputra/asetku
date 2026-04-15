<?php

return [
    'title' => 'Asset users',
    'description' => 'Manage people who use or receive assets.',
    'fields' => [
        'email' => 'Email',
        'phone' => 'Phone',
        'department' => 'Department',
        'department_placeholder' => 'Select department (optional)',
        'department_none' => 'No department',
        'notes' => 'Notes',
    ],
    'actions' => [
        'new' => 'New asset user',
        'delete_confirm' => 'Delete ":name"?',
    ],
    'create' => [
        'title' => 'Create asset user',
        'description' => 'Add a new asset user for this organization.',
    ],
    'edit' => [
        'title' => 'Edit asset user',
    ],
    'toast' => [
        'created' => 'Asset user created.',
        'updated' => 'Asset user updated.',
        'deleted' => 'Asset user deleted.',
    ],
];

