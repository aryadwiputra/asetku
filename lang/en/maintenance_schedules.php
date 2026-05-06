<?php

return [
    'title' => 'Maintenance schedules',
    'description' => 'Preventive maintenance schedules per asset.',
    'create_description' => 'Create a preventive maintenance schedule.',
    'fields' => [
        'asset' => 'Asset',
        'asset_search' => 'Find asset',
        'name' => 'Name',
        'interval_days' => 'Interval (days)',
        'next_due_at' => 'Next due date',
        'required_skill' => 'Required skill',
    ],
    'actions' => [
        'new' => 'New schedule',
        'edit' => 'Edit schedule',
    ],
    'toast' => [
        'created' => 'Schedule created.',
        'updated' => 'Schedule updated.',
        'deleted' => 'Schedule deleted.',
    ],
];
