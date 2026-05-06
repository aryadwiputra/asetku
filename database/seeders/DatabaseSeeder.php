<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Department;
use App\Models\Organization;
use App\Models\OrganizationGroup;
use App\Models\User;
use App\Services\OrganizationContext;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RolePermissionSeeder::class);

        $group = OrganizationGroup::query()->updateOrCreate(
            ['slug' => 'default-group'],
            ['name' => 'Default Group', 'description' => null],
        );

        $organization = Organization::query()->updateOrCreate(
            ['slug' => 'default'],
            [
                'name' => 'Default Organization',
                'organization_group_id' => $group->id,
            ],
        );

        if ($organization->organization_group_id === null) {
            $organization->forceFill(['organization_group_id' => $group->id])->saveQuietly();
        }

        app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

        $branch = Branch::query()->updateOrCreate(
            ['organization_id' => $organization->id, 'code' => 'MAIN'],
            ['name' => 'Main Branch'],
        );

        Department::query()->updateOrCreate(
            ['organization_id' => $organization->id, 'code' => 'GENERAL'],
            ['branch_id' => $branch->id, 'name' => 'General', 'description' => null],
        );

        $superAdmin = $this->upsertSeedUser(
            organization: $organization,
            name: 'Super Admin',
            email: 'superadmin@example.com',
            organizationRole: 'Owner',
            appRole: 'super-admin',
        );

        $admin = $this->upsertSeedUser(
            organization: $organization,
            name: 'Admin User',
            email: 'admin@example.com',
            organizationRole: 'Admin',
            appRole: 'admin',
        );

        foreach (range(1, 10) as $index) {
            $this->upsertSeedUser(
                organization: $organization,
                name: sprintf('Staff User %02d', $index),
                email: sprintf('staff%02d@example.com', $index),
                organizationRole: 'Member',
                appRole: 'user',
            );
        }

        try {
            Cache::store('redis')->flush();
        } catch (\Throwable) {
            // Ignore cache failures.
        }

        if (env('SEED_DEMO_ASSETS', false)) {
            $this->call(DemoMasterDataSeeder::class);
            $this->call(DemoAssetDataSeeder::class);
            $this->call(DemoOperationsSeeder::class);
        }
    }

    private function upsertSeedUser(
        Organization $organization,
        string $name,
        string $email,
        string $organizationRole,
        string $appRole,
    ): User {
        /** @var User $user */
        $user = User::query()->updateOrCreate(
            ['email' => $email],
            [
                'organization_id' => $organization->id,
                'current_organization_id' => $organization->id,
                'name' => $name,
                'email_verified_at' => now(),
                'locale' => null,
                'password' => Hash::make('password'),
                'remember_token' => Str::random(10),
                'two_factor_secret' => null,
                'two_factor_recovery_codes' => null,
                'two_factor_confirmed_at' => null,
                'avatar_path' => null,
                'is_active' => true,
            ],
        );

        $user->organizations()->syncWithoutDetaching([
            $organization->id => [
                'role' => $organizationRole,
                'is_active' => true,
            ],
        ]);

        $user->syncRoles([$appRole]);

        return $user;
    }
}
