<?php

use App\Models\Branch;
use App\Models\Organization;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Support\Facades\Artisan;

test('database seeder creates default organization and users', function () {
    Artisan::call('db:seed', ['--class' => DatabaseSeeder::class]);

    $organization = Organization::query()->where('slug', 'default')->firstOrFail();

    expect(Branch::query()->where('code', 'MAIN')->exists())->toBeTrue();

    expect(User::query()->where('email', 'superadmin@example.com')->exists())->toBeTrue();
    expect(User::query()->where('email', 'admin@example.com')->exists())->toBeTrue();

    expect(User::query()->whereNull('organization_id')->exists())->toBeFalse();
    expect(User::query()->where('organization_id', $organization->id)->count())->toBe(12);
});
