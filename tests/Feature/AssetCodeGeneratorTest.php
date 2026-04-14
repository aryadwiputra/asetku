<?php

use App\Models\Branch;
use App\Models\Organization;
use App\Services\AssetCodeGenerator;
use App\Services\OrganizationContext;

test('asset code generator produces sequential codes per branch per year', function () {
    $organization = Organization::factory()->create([
        'asset_code_prefix' => 'KMP',
        'asset_code_format' => '{PREFIX}-{BRANCH}-{YEAR}-{SEQ4}',
    ]);

    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $branch = Branch::query()->create([
        'name' => 'Jakarta',
        'code' => 'JKT',
    ]);

    $generator = app(AssetCodeGenerator::class);

    $code1 = $generator->generate($branch, year: 2025);
    $code2 = $generator->generate($branch, year: 2025);

    expect($code1)->toBe('KMP-JKT-2025-0001');
    expect($code2)->toBe('KMP-JKT-2025-0002');
});
