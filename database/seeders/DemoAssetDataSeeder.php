<?php

namespace Database\Seeders;

use App\Models\Asset;
use App\Models\AssetCategory;
use App\Models\AssetClass;
use App\Models\AssetCondition;
use App\Models\AssetLocation;
use App\Models\AssetMedia;
use App\Models\AssetStatus;
use App\Models\AssetUser;
use App\Models\Branch;
use App\Models\Department;
use App\Models\MediaAsset;
use App\Models\Organization;
use App\Models\OrganizationGroup;
use App\Models\PersonInCharge;
use App\Models\Unit;
use App\Models\User;
use App\Services\OrganizationContext;
use Illuminate\Database\Seeder;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class DemoAssetDataSeeder extends Seeder
{
    private const ASSET_CODE_FORMAT = '{PREFIX}-{BRANCH}-{YEAR}-{SEQ4}';

    /**
     * Wikimedia Commons stable URLs (Special:FilePath).
     *
     * @var array<string, list<string>>
     */
    private const IMAGE_URLS = [
        'laptop' => [
            'https://commons.wikimedia.org/wiki/Special:FilePath/IBM_ThinkPad_Laptop.JPG',
            'https://commons.wikimedia.org/wiki/Special:FilePath/Laptop_computer.jpg',
        ],
        'printer' => [
            'https://commons.wikimedia.org/wiki/Special:FilePath/Toshiba_e-STUDIO6529A_Printer.jpg',
        ],
        'network' => [
            'https://commons.wikimedia.org/wiki/Special:FilePath/Cisco_2800_series_router_(1).jpg',
            'https://commons.wikimedia.org/wiki/Special:FilePath/Servers_in_a_Rack.jpg',
            'https://commons.wikimedia.org/wiki/Special:FilePath/Computer_server_rack.jpg',
            'https://commons.wikimedia.org/wiki/Special:FilePath/WifiAccessPoint.jpg',
        ],
        'vehicle' => [
            'https://commons.wikimedia.org/wiki/Special:FilePath/A_forklift.jpg',
            'https://commons.wikimedia.org/wiki/Special:FilePath/2020_Toyota_HiAce_(front).jpg',
        ],
        'furniture' => [
            'https://commons.wikimedia.org/wiki/Special:FilePath/Office_Chair.jpg',
        ],
    ];

    public function run(): void
    {
        $group = OrganizationGroup::query()->firstOrCreate(
            ['slug' => 'pt-maju-bersama'],
            ['name' => 'PT Maju Bersama', 'description' => 'Holding perusahaan demo untuk platform aset.'],
        );

        $organizations = [
            ['name' => 'PT Maju Logistik', 'slug' => 'maju-logistik', 'prefix' => 'MLG'],
            ['name' => 'PT Maju Properti', 'slug' => 'maju-properti', 'prefix' => 'MPR'],
            ['name' => 'PT Maju Teknologi', 'slug' => 'maju-teknologi', 'prefix' => 'MTK'],
        ];

        foreach ($organizations as $row) {
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

            if ((int) $organization->organization_group_id !== (int) $group->id) {
                $organization->forceFill(['organization_group_id' => $group->id])->saveQuietly();
            }
            $organization->forceFill([
                'asset_code_prefix' => $organization->asset_code_prefix ?: $row['prefix'],
                'asset_code_format' => $organization->asset_code_format ?: self::ASSET_CODE_FORMAT,
                'currency_code' => $organization->currency_code ?: 'IDR',
                'timezone' => $organization->timezone ?: 'Asia/Jakarta',
            ])->saveQuietly();

            app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

            $owner = User::factory()->inOrganization($organization, role: 'Owner')->create([
                'name' => 'Owner '.$organization->name,
                'email' => Str::slug($row['slug']).'@example.com',
                'email_verified_at' => now(),
            ]);

            $branches = $this->seedBranches($organization);
            $departments = $this->seedDepartments($organization, $branches);
            $masters = $this->seedMasterData($organization);
            $locations = $this->seedLocations($organization, $branches);

            $pics = $this->seedPeopleInCharge();
            $assetUsers = $this->seedAssetUsers($departments);

            $this->seedAssets(
                organization: $organization,
                branches: $branches,
                departments: $departments,
                locations: $locations,
                masters: $masters,
                pics: $pics,
                assetUsers: $assetUsers,
                uploadedBy: $owner->id,
            );
        }
    }

    /**
     * @return array<string, Branch>
     */
    private function seedBranches(Organization $organization): array
    {
        $defs = [
            'JKT' => ['name' => 'Jakarta', 'address' => 'Jl. Sudirman No. 1, Jakarta', 'lat' => -6.21462, 'lng' => 106.84513],
            'SBY' => ['name' => 'Surabaya', 'address' => 'Jl. Basuki Rahmat No. 10, Surabaya', 'lat' => -7.25747, 'lng' => 112.75209],
            'BDG' => ['name' => 'Bandung', 'address' => 'Jl. Asia Afrika No. 20, Bandung', 'lat' => -6.91746, 'lng' => 107.61912],
        ];

        $branches = [];

        foreach ($defs as $code => $meta) {
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
        $definitions = [
            ['code' => 'IT', 'name' => 'IT'],
            ['code' => 'GA', 'name' => 'General Affairs'],
            ['code' => 'FIN', 'name' => 'Finance'],
        ];

        $departments = [];

        foreach ($branches as $branchCode => $branch) {
            foreach ($definitions as $def) {
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

    /**
     * @return array<string, mixed>
     */
    private function seedMasterData(Organization $organization): array
    {
        $statuses = [
            'ACTIVE' => ['name' => 'Active', 'description' => 'Asset aktif digunakan.'],
            'BORROWED' => ['name' => 'Borrowed', 'description' => 'Sedang dipinjam.'],
            'REPAIR' => ['name' => 'Repair', 'description' => 'Dalam perbaikan.'],
            'DISPOSED' => ['name' => 'Disposed', 'description' => 'Sudah tidak digunakan.'],
        ];

        $conditions = [
            'GOOD' => ['name' => 'Good', 'description' => 'Kondisi baik.'],
            'ATTN' => ['name' => 'Needs attention', 'description' => 'Perlu perhatian.'],
            'BROKEN' => ['name' => 'Broken', 'description' => 'Rusak.'],
            'INACTIVE' => ['name' => 'Inactive', 'description' => 'Tidak aktif.'],
            'DISPOSAL' => ['name' => 'Disposal', 'description' => 'Untuk disposal.'],
        ];

        $units = [
            'PCS' => ['name' => 'Piece', 'symbol' => 'pcs', 'description' => null],
        ];

        $classes = [
            'IT' => ['name' => 'IT', 'description' => null],
            'VEH' => ['name' => 'Vehicle', 'description' => null],
            'FURN' => ['name' => 'Furniture', 'description' => null],
        ];

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

        $categories = [
            'IT-LAP' => AssetCategory::query()->firstOrCreate(
                ['organization_id' => $organization->id, 'code' => 'IT-LAP'],
                ['name' => 'Laptop', 'description' => null, 'parent_id' => $it->id, 'depreciation_method' => 'straight_line', 'useful_life_months' => 36, 'residual_value' => 0],
            ),
            'IT-PRN' => AssetCategory::query()->firstOrCreate(
                ['organization_id' => $organization->id, 'code' => 'IT-PRN'],
                ['name' => 'Printer', 'description' => null, 'parent_id' => $it->id, 'depreciation_method' => 'straight_line', 'useful_life_months' => 48, 'residual_value' => 0],
            ),
            'IT-NET' => AssetCategory::query()->firstOrCreate(
                ['organization_id' => $organization->id, 'code' => 'IT-NET'],
                ['name' => 'Network', 'description' => null, 'parent_id' => $it->id, 'depreciation_method' => 'syd', 'useful_life_months' => 48, 'residual_value' => 0],
            ),
            'VEH-VAN' => AssetCategory::query()->firstOrCreate(
                ['organization_id' => $organization->id, 'code' => 'VEH-VAN'],
                ['name' => 'Van', 'description' => null, 'parent_id' => $vehicle->id, 'depreciation_method' => 'diminishing', 'useful_life_months' => 60, 'residual_value' => 0],
            ),
            'VEH-FLT' => AssetCategory::query()->firstOrCreate(
                ['organization_id' => $organization->id, 'code' => 'VEH-FLT'],
                ['name' => 'Forklift', 'description' => null, 'parent_id' => $vehicle->id, 'depreciation_method' => 'diminishing', 'useful_life_months' => 60, 'residual_value' => 0],
            ),
            'FURN-CHR' => AssetCategory::query()->firstOrCreate(
                ['organization_id' => $organization->id, 'code' => 'FURN-CHR'],
                ['name' => 'Office chair', 'description' => null, 'parent_id' => $furniture->id, 'depreciation_method' => 'straight_line', 'useful_life_months' => 48, 'residual_value' => 0],
            ),
        ];

        $statusModels = [];
        foreach ($statuses as $code => $data) {
            $statusModels[$code] = AssetStatus::query()->firstOrCreate(
                ['organization_id' => $organization->id, 'code' => $code],
                ['name' => $data['name'], 'description' => $data['description']],
            );
        }

        $conditionModels = [];
        foreach ($conditions as $code => $data) {
            $conditionModels[$code] = AssetCondition::query()->firstOrCreate(
                ['organization_id' => $organization->id, 'code' => $code],
                ['name' => $data['name'], 'description' => $data['description']],
            );
        }

        $unitModels = [];
        foreach ($units as $code => $data) {
            $unitModels[$code] = Unit::query()->firstOrCreate(
                ['organization_id' => $organization->id, 'symbol' => $data['symbol']],
                ['name' => $data['name'], 'description' => $data['description']],
            );
        }

        $classModels = [];
        foreach ($classes as $code => $data) {
            $classModels[$code] = AssetClass::query()->firstOrCreate(
                ['organization_id' => $organization->id, 'code' => $code],
                ['name' => $data['name'], 'description' => $data['description']],
            );
        }

        return [
            'status' => $statusModels,
            'condition' => $conditionModels,
            'unit' => $unitModels,
            'class' => $classModels,
            'category' => $categories,
        ];
    }

    /**
     * @param  array<string, Branch>  $branches
     * @return array<string, AssetLocation>
     */
    private function seedLocations(Organization $organization, array $branches): array
    {
        $locations = [];

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

            $room = AssetLocation::query()->firstOrCreate(
                ['organization_id' => $organization->id, 'code' => "RM-101-{$branchCode}"],
                [
                    'branch_id' => $branch->id,
                    'type' => 'room',
                    'name' => "Room 101 ({$branchCode})",
                    'description' => null,
                    'parent_id' => $floor->id,
                ],
            );

            $locations[$branchCode] = $room;
        }

        return $locations;
    }

    /**
     * @return array<string, PersonInCharge>
     */
    private function seedPeopleInCharge(): array
    {
        $defs = [
            ['name' => 'Budi Santoso', 'email' => 'budi.santoso@example.com', 'phone' => '081234567890'],
            ['name' => 'Siti Aisyah', 'email' => 'siti.aisyah@example.com', 'phone' => '081298765432'],
            ['name' => 'Andi Wijaya', 'email' => 'andi.wijaya@example.com', 'phone' => '081277788899'],
        ];

        $pics = [];

        foreach ($defs as $def) {
            $pics[$def['email']] = PersonInCharge::query()->firstOrCreate(
                ['email' => $def['email']],
                ['name' => $def['name'], 'phone' => $def['phone'], 'notes' => null],
            );
        }

        return $pics;
    }

    /**
     * @param  array<string, Department>  $departments
     * @return array<string, AssetUser>
     */
    private function seedAssetUsers(array $departments): array
    {
        $defs = [
            ['name' => 'Dewi Lestari', 'email' => 'dewi.lestari@example.com', 'phone' => '081211122233', 'dept' => 'IT-JKT'],
            ['name' => 'Rizky Pratama', 'email' => 'rizky.pratama@example.com', 'phone' => '081233344455', 'dept' => 'GA-SBY'],
            ['name' => 'Nadia Putri', 'email' => 'nadia.putri@example.com', 'phone' => '081255566677', 'dept' => 'FIN-BDG'],
        ];

        $users = [];

        foreach ($defs as $def) {
            $department = $departments[$def['dept']] ?? null;

            $users[$def['email']] = AssetUser::query()->firstOrCreate(
                ['email' => $def['email']],
                [
                    'name' => $def['name'],
                    'phone' => $def['phone'],
                    'department_id' => $department?->id,
                    'notes' => null,
                ],
            );
        }

        return $users;
    }

    /**
     * @param  array<string, Branch>  $branches
     * @param  array<string, Department>  $departments
     * @param  array<string, AssetLocation>  $locations
     * @param  array<string, mixed>  $masters
     * @param  array<string, PersonInCharge>  $pics
     * @param  array<string, AssetUser>  $assetUsers
     */
    private function seedAssets(
        Organization $organization,
        array $branches,
        array $departments,
        array $locations,
        array $masters,
        array $pics,
        array $assetUsers,
        int $uploadedBy,
    ): void {
        $assets = $this->assetDefinitions($organization);

        foreach ($assets as $def) {
            /** @var Branch|null $branch */
            $branch = $branches[$def['branch']] ?? null;
            $department = $departments[$def['department']] ?? null;
            $location = $locations[$def['branch']] ?? null;

            if (! $branch) {
                continue;
            }

            /** @var AssetStatus $status */
            $status = $masters['status'][$def['status']];
            /** @var AssetCondition $condition */
            $condition = $masters['condition'][$def['condition']];
            /** @var AssetCategory $category */
            $category = $masters['category'][$def['category']];
            /** @var AssetClass $class */
            $class = $masters['class'][$def['class']];
            /** @var Unit $unit */
            $unit = $masters['unit']['PCS'];

            $pic = $pics[$def['pic_email']] ?? null;
            $assetUser = $assetUsers[$def['asset_user_email']] ?? null;

            /** @var Asset $asset */
            $asset = Asset::query()->updateOrCreate(
                ['organization_id' => $organization->id, 'code' => $def['code']],
                [
                    'name' => $def['name'],
                    'brand' => $def['brand'],
                    'model' => $def['model'],
                    'series' => $def['series'],
                    'serial_number' => $def['serial_number'],
                    'imei' => $def['imei'],
                    'purchase_date' => $def['purchase_date'],
                    'cost' => $def['cost'],
                    'depreciation_method' => $def['depreciation_method'],
                    'useful_life_months' => $def['useful_life_months'],
                    'residual_value' => $def['residual_value'],
                    'branch_id' => $branch->id,
                    'department_id' => $department?->id,
                    'asset_location_id' => $location?->id,
                    'asset_category_id' => $category->id,
                    'asset_class_id' => $class->id,
                    'unit_id' => $unit->id,
                    'asset_status_id' => $status->id,
                    'asset_condition_id' => $condition->id,
                    'person_in_charge_id' => $pic?->id,
                    'asset_user_id' => $assetUser?->id,
                    'latitude' => $def['latitude'],
                    'longitude' => $def['longitude'],
                    'metadata' => $def['metadata'],
                ],
            );

            $hasPhoto = $asset->media()->where('kind', 'photo')->exists();
            if ($hasPhoto) {
                continue;
            }

            $urls = self::IMAGE_URLS[$def['image_kind']] ?? [];
            $urls = array_slice($urls, 0, 3);

            foreach ($urls as $index => $url) {
                $downloaded = $this->downloadImage($url);
                if (! $downloaded) {
                    continue;
                }

                $title = "{$asset->code} Photo ".($index + 1);
                $fileName = Str::slug($asset->code.'-photo-'.($index + 1)).'.'.$downloaded['ext'];

                $mediaAsset = $this->createMediaAssetFromBytes(
                    title: $title,
                    uploadedBy: $uploadedBy,
                    bytes: $downloaded['bytes'],
                    fileName: $fileName,
                );

                if (! $mediaAsset) {
                    continue;
                }

                AssetMedia::query()->create([
                    'asset_id' => $asset->id,
                    'media_asset_id' => $mediaAsset->id,
                    'kind' => 'photo',
                    'sort_order' => $index,
                    'is_primary' => $index === 0,
                ]);
            }
        }
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function assetDefinitions(Organization $organization): array
    {
        $prefix = $organization->asset_code_prefix ?: 'AST';
        $year = (string) now()->year;

        return [
            // IT - Jakarta
            [
                'code' => "{$prefix}-JKT-{$year}-0001",
                'name' => 'Laptop Operasional IT - ThinkPad',
                'brand' => 'Lenovo',
                'model' => 'ThinkPad T14',
                'series' => 'Gen 2',
                'serial_number' => strtoupper($prefix).'-LAP-0001',
                'imei' => null,
                'purchase_date' => "{$year}-02-10",
                'cost' => 18500000,
                'depreciation_method' => 'straight_line',
                'useful_life_months' => 36,
                'residual_value' => 1000000,
                'branch' => 'JKT',
                'department' => 'IT-JKT',
                'status' => 'ACTIVE',
                'condition' => 'GOOD',
                'class' => 'IT',
                'category' => 'IT-LAP',
                'pic_email' => 'budi.santoso@example.com',
                'asset_user_email' => 'dewi.lestari@example.com',
                'latitude' => -6.21462,
                'longitude' => 106.84513,
                'metadata' => ['cpu' => 'Intel i5', 'ram_gb' => 16, 'storage_gb' => 512],
                'image_kind' => 'laptop',
            ],
            [
                'code' => "{$prefix}-JKT-{$year}-0002",
                'name' => 'Printer Kantor - e-STUDIO',
                'brand' => 'Toshiba',
                'model' => 'e-STUDIO',
                'series' => '6529A',
                'serial_number' => strtoupper($prefix).'-PRN-0002',
                'imei' => null,
                'purchase_date' => "{$year}-01-20",
                'cost' => 42000000,
                'depreciation_method' => 'straight_line',
                'useful_life_months' => 48,
                'residual_value' => 2000000,
                'branch' => 'JKT',
                'department' => 'GA-JKT',
                'status' => 'ACTIVE',
                'condition' => 'ATTN',
                'class' => 'IT',
                'category' => 'IT-PRN',
                'pic_email' => 'siti.aisyah@example.com',
                'asset_user_email' => 'rizky.pratama@example.com',
                'latitude' => -6.21462,
                'longitude' => 106.84513,
                'metadata' => ['ppm' => 65, 'type' => 'laser'],
                'image_kind' => 'printer',
            ],
            [
                'code' => "{$prefix}-JKT-{$year}-0003",
                'name' => 'Core Router - Cisco',
                'brand' => 'Cisco',
                'model' => '2800',
                'series' => 'Series',
                'serial_number' => strtoupper($prefix).'-NET-0003',
                'imei' => null,
                'purchase_date' => "{$year}-03-05",
                'cost' => 65000000,
                'depreciation_method' => 'syd',
                'useful_life_months' => 48,
                'residual_value' => 5000000,
                'branch' => 'JKT',
                'department' => 'IT-JKT',
                'status' => 'ACTIVE',
                'condition' => 'GOOD',
                'class' => 'IT',
                'category' => 'IT-NET',
                'pic_email' => 'andi.wijaya@example.com',
                'asset_user_email' => 'dewi.lestari@example.com',
                'latitude' => -6.21462,
                'longitude' => 106.84513,
                'metadata' => ['ports' => 8, 'throughput_gbps' => 1],
                'image_kind' => 'network',
            ],

            // Vehicle / Logistics - Surabaya
            [
                'code' => "{$prefix}-SBY-{$year}-0001",
                'name' => 'Forklift Warehouse',
                'brand' => 'Toyota',
                'model' => '8FG',
                'series' => '25',
                'serial_number' => strtoupper($prefix).'-FLT-0001',
                'imei' => null,
                'purchase_date' => "{$year}-02-28",
                'cost' => 285000000,
                'depreciation_method' => 'diminishing',
                'useful_life_months' => 60,
                'residual_value' => 20000000,
                'branch' => 'SBY',
                'department' => 'GA-SBY',
                'status' => 'ACTIVE',
                'condition' => 'GOOD',
                'class' => 'VEH',
                'category' => 'VEH-FLT',
                'pic_email' => 'budi.santoso@example.com',
                'asset_user_email' => 'rizky.pratama@example.com',
                'latitude' => -7.25747,
                'longitude' => 112.75209,
                'metadata' => ['capacity_tons' => 2.5],
                'image_kind' => 'vehicle',
            ],
            [
                'code' => "{$prefix}-SBY-{$year}-0002",
                'name' => 'Van Operasional',
                'brand' => 'Toyota',
                'model' => 'Hiace',
                'series' => 'Commuter',
                'serial_number' => strtoupper($prefix).'-VAN-0002',
                'imei' => null,
                'purchase_date' => "{$year}-01-12",
                'cost' => 575000000,
                'depreciation_method' => 'diminishing',
                'useful_life_months' => 60,
                'residual_value' => 50000000,
                'branch' => 'SBY',
                'department' => 'FIN-SBY',
                'status' => 'BORROWED',
                'condition' => 'ATTN',
                'class' => 'VEH',
                'category' => 'VEH-VAN',
                'pic_email' => 'siti.aisyah@example.com',
                'asset_user_email' => 'rizky.pratama@example.com',
                'latitude' => -7.25747,
                'longitude' => 112.75209,
                'metadata' => ['plate' => 'L 1234 XX'],
                'image_kind' => 'vehicle',
            ],

            // Furniture - Bandung
            [
                'code' => "{$prefix}-BDG-{$year}-0001",
                'name' => 'Kursi Kerja Ergonomis',
                'brand' => 'IKEA',
                'model' => 'MARKUS',
                'series' => null,
                'serial_number' => strtoupper($prefix).'-CHR-0001',
                'imei' => null,
                'purchase_date' => "{$year}-03-18",
                'cost' => 3499000,
                'depreciation_method' => 'straight_line',
                'useful_life_months' => 48,
                'residual_value' => 0,
                'branch' => 'BDG',
                'department' => 'GA-BDG',
                'status' => 'ACTIVE',
                'condition' => 'GOOD',
                'class' => 'FURN',
                'category' => 'FURN-CHR',
                'pic_email' => 'andi.wijaya@example.com',
                'asset_user_email' => 'nadia.putri@example.com',
                'latitude' => -6.91746,
                'longitude' => 107.61912,
                'metadata' => ['color' => 'black'],
                'image_kind' => 'furniture',
            ],
        ];
    }

    /**
     * @return array{bytes:string,mime:string,ext:string}|null
     */
    private function downloadImage(string $url): ?array
    {
        try {
            // Wikimedia requires a User-Agent (and asks to respect robot policy).
            // Use a stable, descriptive UA so requests are not blocked.
            $userAgent = trim(sprintf(
                '%s DemoAssetDataSeeder (+%s)',
                (string) config('app.name', 'asetku'),
                (string) config('app.url', 'http://localhost'),
            ));

            $response = Http::timeout(20)
                ->withUserAgent($userAgent)
                ->accept('image/*')
                // Avoid throwing on 4xx/5xx here; we want best-effort logging.
                ->retry(2, 200, throw: false)
                ->get($url);
        } catch (ConnectionException $e) {
            Log::warning('DemoAssetDataSeeder image download failed', ['url' => $url, 'error' => $e->getMessage()]);

            return null;
        } catch (RequestException $e) {
            Log::warning('DemoAssetDataSeeder image download request exception', [
                'url' => $url,
                'status' => $e->response?->status(),
                'error' => $e->getMessage(),
            ]);

            return null;
        }

        if (! $response->successful()) {
            Log::warning('DemoAssetDataSeeder image download non-200', ['url' => $url, 'status' => $response->status()]);

            return null;
        }

        $mime = (string) $response->header('Content-Type');
        if (! str_starts_with($mime, 'image/')) {
            Log::warning('DemoAssetDataSeeder image download not image/*', ['url' => $url, 'mime' => $mime]);

            return null;
        }

        $bytes = (string) $response->body();
        if ($bytes === '') {
            Log::warning('DemoAssetDataSeeder image download empty body', ['url' => $url]);

            return null;
        }

        $max = min((int) config('media-library.max_file_size', 1024 * 1024 * 200), 10 * 1024 * 1024);
        if (strlen($bytes) > $max) {
            Log::warning('DemoAssetDataSeeder image download too large', ['url' => $url, 'size' => strlen($bytes), 'max' => $max]);

            return null;
        }

        $ext = match (true) {
            str_starts_with($mime, 'image/jpeg') => 'jpg',
            str_starts_with($mime, 'image/png') => 'png',
            str_starts_with($mime, 'image/webp') => 'webp',
            default => 'jpg',
        };

        return ['bytes' => $bytes, 'mime' => $mime, 'ext' => $ext];
    }

    private function createMediaAssetFromBytes(string $title, int $uploadedBy, string $bytes, string $fileName): ?MediaAsset
    {
        $mediaAsset = MediaAsset::query()->firstOrCreate(
            ['title' => $title, 'uploaded_by' => $uploadedBy],
            [],
        );

        if ($mediaAsset->getFirstMedia('file')) {
            return $mediaAsset;
        }

        try {
            $mediaAsset
                ->addMediaFromString($bytes)
                ->usingFileName($fileName)
                ->toMediaCollection('file');
        } catch (\Throwable $e) {
            Log::warning('DemoAssetDataSeeder failed to attach media bytes', ['title' => $title, 'error' => $e->getMessage()]);

            return null;
        }

        return $mediaAsset;
    }
}
