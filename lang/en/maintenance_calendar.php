<?php

return [
    'title' => 'Maintenance calendar',
    'description' => 'Plan and monitor preventive maintenance schedules.',
    'filters' => [
        'branch' => 'Branch',
        'category' => 'Asset category',
        'technician' => 'Technician',
        'search' => 'Search',
    ],
    'actions' => [
        'new_schedule' => 'New schedule',
        'edit_schedule' => 'Edit schedule',
        'copy_feed_link' => 'Copy subscription link',
    ],
    'fields' => [
        'date' => 'Date',
        'asset' => 'Asset',
        'branch' => 'Branch',
        'technician' => 'Technician',
    ],
    'toast' => [
        'rescheduled' => 'Schedule rescheduled.',
        'reschedule_failed' => 'Failed to reschedule. Please try again.',
        'feed_link_ready' => 'Subscription link ready.',
        'feed_link_copied' => 'Subscription link copied.',
        'feed_link_failed' => 'Failed to generate subscription link.',
    ],
    'history' => [
        'schedule_rescheduled' => 'Maintenance schedule rescheduled.',
    ],
    'notifications' => [
        'due_soon_subject' => 'Maintenance due in :days day(s)',
        'due_soon_body' => 'A maintenance schedule is due in :days day(s) (due date: :date).',
    ],
];

