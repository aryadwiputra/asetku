<?php

return [
    'title' => 'Departments',
    'description' => 'Manage departments within branches.',
    'fields' => [
        'branch' => 'Branch',
        'branch_placeholder' => 'Select a branch',
        'code' => 'Code',
        'description' => 'Description',
    ],
    'actions' => [
        'new' => 'New department',
        'delete_confirm' => 'Delete ":name"?',
    ],
    'create' => [
        'title' => 'Create department',
        'description' => 'Add a department for the current organization.',
    ],
    'edit' => [
        'title' => 'Edit department',
    ],
    'toast' => [
        'created' => 'Department created.',
        'updated' => 'Department updated.',
        'deleted' => 'Department deleted.',
    ],
];

