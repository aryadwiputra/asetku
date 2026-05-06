<?php

return [
    'title' => 'Technicians',
    'description' => 'Technician profiles and skills for work order assignment.',
    'create_description' => 'Create a technician profile.',
    'fields' => [
        'user' => 'User',
        'skills' => 'Skills',
    ],
    'labels' => [
        'available' => 'Available',
        'unavailable' => 'Unavailable',
    ],
    'placeholders' => [
        'skills' => 'Comma separated (e.g. network, printer, ac)',
    ],
    'actions' => [
        'new' => 'New technician',
        'edit' => 'Edit technician',
    ],
    'toast' => [
        'created' => 'Technician created.',
        'updated' => 'Technician updated.',
        'deleted' => 'Technician deleted.',
    ],
    'validation' => [
        'user_not_in_org' => 'Selected user is not an active member of this organization.',
    ],
];
