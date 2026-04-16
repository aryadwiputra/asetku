<?php

namespace Database\Seeders;

use App\Models\AssetCategory;
use App\Models\AssetClass;
use App\Models\AssetCondition;
use App\Models\AssetLocation;
use App\Models\AssetStatus;
use App\Models\AssetUser;
use App\Models\Branch;
use App\Models\Department;
use App\Models\Organization;
use App\Models\OrganizationGroup;
use App\Models\PersonInCharge;
use App\Models\Unit;
use App\Models\User;
use App\Services\OrganizationContext;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class DemoMasterDataSeeder extends Seeder
{
    public const ASSET_CODE_FORMAT = '{PREFIX}-{BRANCH}-{YEAR}-{SEQ4}';

    /**
     * @var list<array{name:string,slug:string,prefix:string}>
     */
    private const ORGANIZATIONS = [
        ['name' => 'PT Maju Logistik', 'slug' => 'maju-logistik', 'prefix' => 'MLG'],
        ['name' => 'PT Maju Properti', 'slug' => 'maju-properti', 'prefix' => 'MPR'],
        ['name' => 'PT Maju Teknologi', 'slug' => 'maju-teknologi', 'prefix' => 'MTK'],
    ];

    /**
     * @var array<string, array{name:string,address:string,lat:float,lng:float}>
     */
    private const BRANCHES = [
        'JKT' => ['name' => 'Jakarta', 'address' => 'Jl. Sudirman No. 1, Jakarta', 'lat' => -6.21462, 'lng' => 106.84513],
        'SBY' => ['name' => 'Surabaya', 'address' => 'Jl. Basuki Rahmat No. 10, Surabaya', 'lat' => -7.25747, 'lng' => 112.75209],
        'BDG' => ['name' => 'Bandung', 'address' => 'Jl. Asia Afrika No. 20, Bandung', 'lat' => -6.91746, 'lng' => 107.61912],
    ];

    /**
     * @var list<array{code:string,name:string}>
     */
    private const DEPARTMENTS = [
        ['code' => 'IT', 'name' => 'IT'],
        ['code' => 'GA', 'name' => 'General Affairs'],
        ['code' => 'FIN', 'name' => 'Finance'],
    ];

    /**
     * @var array<string, array{name:string,description:?string}>
     */
    private const ASSET_STATUSES = [
        'ACTIVE' => ['name' => 'Active', 'description' => 'Asset aktif digunakan.'],
        'BORROWED' => ['name' => 'Borrowed', 'description' => 'Sedang dipinjam.'],
        'REPAIR' => ['name' => 'Repair', 'description' => 'Dalam perbaikan.'],
        'DISPOSED' => ['name' => 'Disposed', 'description' => 'Sudah tidak digunakan.'],
    ];

    /**
     * @var array<string, array{name:string,description:?string}>
     */
    private const ASSET_CONDITIONS = [
        'GOOD' => ['name' => 'Good', 'description' => 'Kondisi baik.'],
        'ATTN' => ['name' => 'Needs attention', 'description' => 'Perlu perhatian.'],
        'BROKEN' => ['name' => 'Broken', 'description' => 'Rusak.'],
        'INACTIVE' => ['name' => 'Inactive', 'description' => 'Tidak aktif.'],
        'DISPOSAL' => ['name' => 'Disposal', 'description' => 'Untuk disposal.'],
    ];

    /**
     * @var array<string, array{name:string,description:?string}>
     */
    private const ASSET_CLASSES = [
        'IT' => ['name' => 'IT', 'description' => null],
        'VEH' => ['name' => 'Vehicle', 'description' => null],
        'FURN' => ['name' => 'Furniture', 'description' => null],
    ];

    /**
     * @var list<array{name:string,email:string,phone:string}>
     */
    private const PICS = [
        ['name' => 'Budi Santoso', 'email' => 'budi.santoso@example.com', 'phone' => '081234567890'],
        ['name' => 'Siti Aisyah', 'email' => 'siti.aisyah@example.com', 'phone' => '081298765432'],
        ['name' => 'Andi Wijaya', 'email' => 'andi.wijaya@example.com', 'phone' => '081277788899'],
    ];

    /**
     * @var list<array{name:string,email:string,phone:string,department_code:string}>
     */
    private const ASSET_USERS = [
        ['name' => 'Dewi Lestari', 'email' => 'dewi.lestari@example.com', 'phone' => '081211122233', 'department_code' => 'IT-JKT'],
        ['name' => 'Rizky Pratama', 'email' => 'rizky.pratama@example.com', 'phone' => '081233344455', 'department_code' => 'GA-SBY'],
        ['name' => 'Nadia Putri', 'email' => 'nadia.putri@example.com', 'phone' => '081255566677', 'department_code' => 'FIN-BDG'],
    ];

    public function run(): void
    {
        $group = OrganizationGroup::query()->firstOrCreate(
            ['slug' => 'pt-maju-bersama'],
            ['name' => 'PT Maju Bersama', 'description' => 'Holding perusahaan demo untuk platform aset.'],
        );

        $platformUsers = [
            'superadmin@example.com' => 'Owner',
            'admin@example.com' => 'Admin',
        ];

        /** @var array<string, User> $resolvedPlatformUsers */
        $resolvedPlatformUsers = User::query()
            ->whereIn('email', array_keys($platformUsers))
            ->get()
            ->keyBy('email')
            ->all();

        foreach (self::ORGANIZATIONS as $row) {
            $organization = Organization::query()->firstOrCreate(
                ['slug' => $row['slug']],
                [
                    'name' => $row['name'],
                    'organization_group_id' => $group->id,
                    'asset_code_prefix' => $row['prefix'],
                    'asset_code_format' => self::ASSET_CODE_FORMAT,
                    'currency_code' => 'IDR',
                    'timezone' => 'Asia/Jakarta',
                    'is_active' => true,
                ],
            );

            $organization->forceFill([
                'organization_group_id' => $organization->organization_group_id ?: $group->id,
                'asset_code_prefix' => $organization->asset_code_prefix ?: $row['prefix'],
                'asset_code_format' => $organization->asset_code_format ?: self::ASSET_CODE_FORMAT,
                'currency_code' => $organization->currency_code ?: 'IDR',
                'timezone' => $organization->timezone ?: 'Asia/Jakarta',
                'is_active' => $organization->is_active ?? true,
            ])->saveQuietly();

            app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

            $owner = $this->ensureOwnerUser($organization);

            foreach ($platformUsers as $email => $role) {
                $platformUser = $resolvedPlatformUsers[$email] ?? null;
                if (! $platformUser) {
                    continue;
                }

                $platformUser->organizations()->syncWithoutDetaching([
                    $organization->id => ['role' => $role, 'is_active' => true],
                ]);
            }

            $branches = $this->seedBranches($organization);
            $departments = $this->seedDepartments($organization, $branches);

            $this->seedMasterData($organization);
            $this->seedLocations($organization, $branches);
            $this->seedPeopleInCharge($organization);
            $this->seedAssetUsers($organization, $departments);

            // Keep a realistic "demo owner" in the current org by default.
            if ($owner->current_organization_id !== $organization->id) {
                $owner->forceFill(['current_organization_id' => $organization->id])->saveQuietly();
            }
        }

        $this->command?->info('Demo master data seeded: PT Maju Bersama (3 organizations).');
        $this->command?->info('Demo org owners: maju-logistik@example.com, maju-properti@example.com, maju-teknologi@example.com (password: password).');
        $this->command?->info('If present, platform users were attached to demo orgs: superadmin@example.com (Owner), admin@example.com (Admin).');

        Log::info('DemoMasterDataSeeder completed', [
            'group_slug' => 'pt-maju-bersama',
            'organizations' => array_column(self::ORGANIZATIONS, 'slug'),
            'attached_platform_users' => array_keys($resolvedPlatformUsers),
        ]);
    }

    private function ensureOwnerUser(Organization $organization): User
    {
        $email = Str::slug($organization->slug).'@example.com';

        /** @var User $user */
        $user = User::query()->firstOrCreate(
            ['email' => $email],
            [
                'name' => 'Owner '.$organization->name,
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'organization_id' => $organization->id,
                'current_organization_id' => $organization->id,
                'is_active' => true,
            ],
        );

        $user->organizations()->syncWithoutDetaching([
            $organization->id => ['role' => 'Owner', 'is_active' => true],
        ]);

        if ($user->organization_id === null) {
            $user->forceFill(['organization_id' => $organization->id])->saveQuietly();
        }

        if ($user->current_organization_id === null) {
            $user->forceFill(['current_organization_id' => $organization->id])->saveQuietly();
        }

        return $user;
    }

    /**
     * @return array<string, Branch>
     */
    private function seedBranches(Organization $organization): array
    {
        $branches = [];

        foreach (self::BRANCHES as $code => $meta) {
            $branches[$code] = Branch::query()->firstOrCreate(
                ['organization_id' => $organization->id, 'code' => $code],
                [
                    'name' => $meta['name'],
                    'is_active' => true,
                    'address' => $meta['address'],
                    'latitude' => $meta['lat'],
                    'longitude' => $meta['lng'],
                ],
            );
        }

        return $branches;
    }

    /**
     * @param  array<string, Branch>  $branches
     * @return array<string, Department>
     */
    private function seedDepartments(Organization $organization, array $branches): array
    {
        $departments = [];

        foreach ($branches as $branchCode => $branch) {
            foreach (self::DEPARTMENTS as $def) {
                $code = $def['code'].'-'.$branchCode;

                $departments[$code] = Department::query()->firstOrCreate(
                    ['organization_id' => $organization->id, 'code' => $code],
                    [
                        'branch_id' => $branch->id,
                        'name' => $def['name'].' ('.$branchCode.')',
                        'description' => null,
                    ],
                );
            }
        }

        return $departments;
    }

    private function seedMasterData(Organization $organization): void
    {
        foreach (self::ASSET_STATUSES as $code => $data) {
            AssetStatus::query()->firstOrCreate(
                ['organization_id' => $organization->id, 'code' => $code],
                ['name' => $data['name'], 'description' => $data['description']],
            );
        }

        foreach (self::ASSET_CONDITIONS as $code => $data) {
            AssetCondition::query()->firstOrCreate(
                ['organization_id' => $organization->id, 'code' => $code],
                ['name' => $data['name'], 'description' => $data['description']],
            );
        }

        Unit::query()->firstOrCreate(
            ['organization_id' => $organization->id, 'symbol' => 'pcs'],
            ['name' => 'Piece', 'description' => null],
        );

        foreach (self::ASSET_CLASSES as $code => $data) {
            AssetClass::query()->firstOrCreate(
                ['organization_id' => $organization->id, 'code' => $code],
                ['name' => $data['name'], 'description' => $data['description']],
            );
        }

        $it = AssetCategory::query()->firstOrCreate(
            ['organization_id' => $organization->id, 'code' => 'IT'],
            ['name' => 'IT', 'description' => null, 'parent_id' => null, 'depreciation_method' => 'straight_line', 'useful_life_months' => 36, 'residual_value' => 0],
        );
        $vehicle = AssetCategory::query()->firstOrCreate(
            ['organization_id' => $organization->id, 'code' => 'VEH'],
            ['name' => 'Vehicle', 'description' => null, 'parent_id' => null, 'depreciation_method' => 'diminishing', 'useful_life_months' => 60, 'residual_value' => 0],
        );
        $furniture = AssetCategory::query()->firstOrCreate(
            ['organization_id' => $organization->id, 'code' => 'FURN'],
            ['name' => 'Furniture', 'description' => null, 'parent_id' => null, 'depreciation_method' => 'straight_line', 'useful_life_months' => 48, 'residual_value' => 0],
        );

        AssetCategory::query()->firstOrCreate(
            ['organization_id' => $organization->id, 'code' => 'IT-LAP'],
            ['name' => 'Laptop', 'description' => null, 'parent_id' => $it->id, 'depreciation_method' => 'straight_line', 'useful_life_months' => 36, 'residual_value' => 0],
        );
        AssetCategory::query()->firstOrCreate(
            ['organization_id' => $organization->id, 'code' => 'IT-PRN'],
            ['name' => 'Printer', 'description' => null, 'parent_id' => $it->id, 'depreciation_method' => 'straight_line', 'useful_life_months' => 48, 'residual_value' => 0],
        );
        AssetCategory::query()->firstOrCreate(
            ['organization_id' => $organization->id, 'code' => 'IT-NET'],
            ['name' => 'Network', 'description' => null, 'parent_id' => $it->id, 'depreciation_method' => 'syd', 'useful_life_months' => 48, 'residual_value' => 0],
        );
        AssetCategory::query()->firstOrCreate(
            ['organization_id' => $organization->id, 'code' => 'VEH-VAN'],
            ['name' => 'Van', 'description' => null, 'parent_id' => $vehicle->id, 'depreciation_method' => 'diminishing', 'useful_life_months' => 60, 'residual_value' => 0],
        );
        AssetCategory::query()->firstOrCreate(
            ['organization_id' => $organization->id, 'code' => 'VEH-FLT'],
            ['name' => 'Forklift', 'description' => null, 'parent_id' => $vehicle->id, 'depreciation_method' => 'diminishing', 'useful_life_months' => 60, 'residual_value' => 0],
        );
        AssetCategory::query()->firstOrCreate(
            ['organization_id' => $organization->id, 'code' => 'FURN-CHR'],
            ['name' => 'Office chair', 'description' => null, 'parent_id' => $furniture->id, 'depreciation_method' => 'straight_line', 'useful_life_months' => 48, 'residual_value' => 0],
        );
    }

    /**
     * @param  array<string, Branch>  $branches
     */
    private function seedLocations(Organization $organization, array $branches): void
    {
        foreach ($branches as $branchCode => $branch) {
            $building = AssetLocation::query()->firstOrCreate(
                ['organization_id' => $organization->id, 'code' => "BLD-A-{$branchCode}"],
                [
                    'branch_id' => $branch->id,
                    'type' => 'building',
                    'name' => "Building A ({$branchCode})",
                    'description' => null,
                    'parent_id' => null,
                ],
            );

            $floor = AssetLocation::query()->firstOrCreate(
                ['organization_id' => $organization->id, 'code' => "FL-01-{$branchCode}"],
                [
                    'branch_id' => $branch->id,
                    'type' => 'floor',
                    'name' => "Floor 1 ({$branchCode})",
                    'description' => null,
                    'parent_id' => $building->id,
                ],
            );

            AssetLocation::query()->firstOrCreate(
                ['organization_id' => $organization->id, 'code' => "RM-101-{$branchCode}"],
                [
                    'branch_id' => $branch->id,
                    'type' => 'room',
                    'name' => "Room 101 ({$branchCode})",
                    'description' => null,
                    'parent_id' => $floor->id,
                ],
            );
        }
    }

    private function seedPeopleInCharge(Organization $organization): void
    {
        foreach (self::PICS as $def) {
            PersonInCharge::query()->firstOrCreate(
                ['organization_id' => $organization->id, 'email' => $def['email']],
                ['name' => $def['name'], 'phone' => $def['phone'], 'notes' => null],
            );
        }
    }

    /**
     * @param  array<string, Department>  $departments
     */
    private function seedAssetUsers(Organization $organization, array $departments): void
    {
        foreach (self::ASSET_USERS as $def) {
            $department = $departments[$def['department_code']] ?? null;

            AssetUser::query()->firstOrCreate(
                ['organization_id' => $organization->id, 'email' => $def['email']],
                [
                    'name' => $def['name'],
                    'phone' => $def['phone'],
                    'department_id' => $department?->id,
                    'notes' => null,
                ],
            );
        }
    }
}
