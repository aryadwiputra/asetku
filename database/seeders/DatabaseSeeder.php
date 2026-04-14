<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Department;
use App\Models\Organization;
use App\Models\User;
use App\Services\OrganizationContext;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Cache;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RolePermissionSeeder::class);

        $organization = Organization::query()->firstOrCreate(
            ['slug' => 'default'],
            ['name' => 'Default Organization'],
        );

        app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

        $branch = Branch::query()->firstOrCreate(
            ['organization_id' => $organization->id, 'code' => 'MAIN'],
            ['name' => 'Main Branch'],
        );

        Department::query()->firstOrCreate(
            ['organization_id' => $organization->id, 'code' => 'GENERAL'],
            ['branch_id' => $branch->id, 'name' => 'General', 'description' => null],
        );

        $superAdmin = User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'superadmin@example.com',
            'organization_id' => $organization->id,
        ]);
        $superAdmin->assignRole('super-admin');

        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'organization_id' => $organization->id,
        ]);
        $admin->assignRole('admin');

        $users = User::factory(10)->create([
            'organization_id' => $organization->id,
        ]);
        $users->each(fn (User $user) => $user->assignRole('user'));

        try {
            Cache::store('redis')->flush();
        } catch (\Throwable) {
            // Ignore cache failures.
        }
    }
}
