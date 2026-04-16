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
        // Ensure org + master data exist before assets are created.
        $this->call(DemoMasterDataSeeder::class);

        $group = OrganizationGroup::query()->where('slug', 'pt-maju-bersama')->first();
        if (! $group) {
            return;
        }

        $organizations = Organization::query()
            ->where('organization_group_id', $group->id)
            ->orderBy('name')
            ->get();

        foreach ($organizations as $organization) {
            app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

            $uploadedBy = $this->resolveDemoOwnerUserId($organization);
            if (! $uploadedBy) {
                continue;
            }

            $this->seedAssets($organization, $uploadedBy);
        }
    }

    private function resolveDemoOwnerUserId(Organization $organization): ?int
    {
        $email = Str::slug($organization->slug).'@example.com';

        $id = User::query()->where('email', $email)->value('id');
        if ($id) {
            return (int) $id;
        }

        $fallbackId = User::query()
            ->whereHas('organizations', fn ($query) => $query->whereKey($organization->id))
            ->orderBy('id')
            ->value('id');

        return $fallbackId ? (int) $fallbackId : null;
    }

    private function seedAssets(Organization $organization, int $uploadedBy): void
    {
        $branches = Branch::query()->where('organization_id', $organization->id)->get()->keyBy('code');
        $departments = Department::query()->where('organization_id', $organization->id)->get()->keyBy('code');
        $locations = AssetLocation::query()->where('organization_id', $organization->id)->get()->keyBy('code');

        $statuses = AssetStatus::query()->where('organization_id', $organization->id)->get()->keyBy('code');
        $conditions = AssetCondition::query()->where('organization_id', $organization->id)->get()->keyBy('code');
        $categories = AssetCategory::query()->where('organization_id', $organization->id)->get()->keyBy('code');
        $classes = AssetClass::query()->where('organization_id', $organization->id)->get()->keyBy('code');
        $units = Unit::query()->where('organization_id', $organization->id)->get()->keyBy('symbol');

        $pics = PersonInCharge::query()->where('organization_id', $organization->id)->get()->keyBy('email');
        $assetUsers = AssetUser::query()->where('organization_id', $organization->id)->get()->keyBy('email');

        $assets = $this->assetDefinitions($organization);

        foreach ($assets as $def) {
            /** @var Branch|null $branch */
            $branch = $branches->get($def['branch']);
            /** @var Department|null $department */
            $department = $departments->get($def['department']);
            /** @var AssetLocation|null $location */
            $location = $locations->get("RM-101-{$def['branch']}");

            /** @var AssetStatus|null $status */
            $status = $statuses->get($def['status']);
            /** @var AssetCondition|null $condition */
            $condition = $conditions->get($def['condition']);
            /** @var AssetCategory|null $category */
            $category = $categories->get($def['category']);
            /** @var AssetClass|null $class */
            $class = $classes->get($def['class']);
            /** @var Unit|null $unit */
            $unit = $units->get('pcs');

            if (! $branch || ! $status || ! $condition || ! $category || ! $class || ! $unit) {
                continue;
            }

            /** @var PersonInCharge|null $pic */
            $pic = $pics->get($def['pic_email']);
            /** @var AssetUser|null $assetUser */
            $assetUser = $assetUsers->get($def['asset_user_email']);

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

            $urls = array_slice(self::IMAGE_URLS[$def['image_kind']] ?? [], 0, 3);

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
