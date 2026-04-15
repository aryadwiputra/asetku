<?php

return [
    'title' => 'Person in charge',
    'description' => 'Manage internal PIC contacts for assets.',
    'fields' => [
        'email' => 'Email',
        'phone' => 'Phone',
        'notes' => 'Notes',
    ],
    'actions' => [
        'new' => 'New PIC',
        'delete_confirm' => 'Delete ":name"?',
    ],
    'create' => [
        'title' => 'Create PIC',
        'description' => 'Add a new PIC contact.',
    ],
    'edit' => [
        'title' => 'Edit PIC',
    ],
    'toast' => [
        'created' => 'PIC created.',
        'updated' => 'PIC updated.',
        'deleted' => 'PIC deleted.',
    ],
];

