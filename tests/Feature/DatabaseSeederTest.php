<?php

use App\Models\Branch;
use App\Models\Organization;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

test('database seeder creates default organization and users', function () {
    Artisan::call('db:seed', ['--class' => DatabaseSeeder::class]);

    $organization = Organization::query()->where('slug', 'default')->firstOrFail();

    expect(Branch::query()->where('code', 'MAIN')->exists())->toBeTrue();

    expect(User::query()->where('email', 'superadmin@example.com')->exists())->toBeTrue();
    expect(User::query()->where('email', 'admin@example.com')->exists())->toBeTrue();
    expect(User::query()->where('email', 'like', 'staff%@example.com')->count())->toBe(10);

    expect(User::query()->whereNull('current_organization_id')->exists())->toBeFalse();
    expect(User::query()->where('current_organization_id', $organization->id)->count())->toBe(12);

    expect(DB::table('organization_user')->where('organization_id', $organization->id)->count())->toBe(12);
});

test('database seeder is idempotent when run multiple times', function () {
    Artisan::call('db:seed', ['--class' => DatabaseSeeder::class]);
    Artisan::call('db:seed', ['--class' => DatabaseSeeder::class]);

    $organization = Organization::query()->where('slug', 'default')->firstOrFail();

    expect(User::query()->where('email', 'superadmin@example.com')->count())->toBe(1);
    expect(User::query()->where('email', 'admin@example.com')->count())->toBe(1);
    expect(User::query()->where('email', 'like', 'staff%@example.com')->count())->toBe(10);
    expect(User::query()->where('current_organization_id', $organization->id)->count())->toBe(12);
    expect(DB::table('organization_user')->where('organization_id', $organization->id)->count())->toBe(12);
});
