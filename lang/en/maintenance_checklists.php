<?php

return [
    'title' => 'Maintenance checklists',
    'description' => 'Checklist templates for work orders.',
    'create_description' => 'Create a checklist template.',
    'fields' => [
        'name' => 'Name',
        'category' => 'Category',
        'required_skill' => 'Required skill',
        'items' => 'Items',
        'item_title' => 'Task title',
    ],
    'actions' => [
        'new' => 'New checklist',
        'edit' => 'Edit checklist',
    ],
    'toast' => [
        'created' => 'Checklist created.',
        'updated' => 'Checklist updated.',
        'deleted' => 'Checklist deleted.',
    ],
];
