<?php

return [
    'title' => 'Asset categories',
    'description' => 'Manage asset categories (hierarchical).',
    'sections' => [
        'depreciation' => 'Depreciation defaults',
    ],
    'fields' => [
        'code' => 'Code',
        'description' => 'Description',
        'parent' => 'Parent category',
        'parent_placeholder' => 'Select parent (optional)',
        'parent_none' => 'No parent',
        'depreciation_method' => 'Depreciation method',
        'depreciation_method_placeholder' => 'Select method',
        'useful_life_months' => 'Useful life (months)',
        'residual_value' => 'Residual value',
        'capex_opex_default' => 'Capex/Opex default',
    ],
    'depreciation_methods' => [
        'straight_line' => 'Straight line',
        'diminishing' => 'Diminishing balance',
    ],
    'actions' => [
        'new' => 'New category',
        'delete_confirm' => 'Delete ":name"?',
    ],
    'create' => [
        'title' => 'Create category',
        'description' => 'Add a new asset category.',
    ],
    'edit' => [
        'title' => 'Edit category',
    ],
    'toast' => [
        'created' => 'Category created.',
        'updated' => 'Category updated.',
        'deleted' => 'Category deleted.',
    ],
];

