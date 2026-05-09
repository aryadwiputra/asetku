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
     * @var array<string, array{photos:list<string>, document:string}>
     */
    private const REMOTE_MEDIA = [
        'laptop' => [
            'photos' => [
                'https://commons.wikimedia.org/wiki/Special:FilePath/IBM_ThinkPad_Laptop.JPG',
                'https://commons.wikimedia.org/wiki/Special:FilePath/Acer_Aspire_8920_Gemstone.jpg',
                'https://commons.wikimedia.org/wiki/Special:FilePath/IBM_ThinkPad_Laptop.JPG',
            ],
            'document' => 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        ],
        'printer' => [
            'photos' => [
                'https://commons.wikimedia.org/wiki/Special:FilePath/Toshiba_e-STUDIO6529A_Printer.jpg',
                'https://commons.wikimedia.org/wiki/Special:FilePath/Toshiba_e-STUDIO6529A_Printer.jpg',
                'https://commons.wikimedia.org/wiki/Special:FilePath/Toshiba_e-STUDIO6529A_Printer.jpg',
            ],
            'document' => 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        ],
        'network' => [
            'photos' => [
                'https://commons.wikimedia.org/wiki/Special:FilePath/Cisco_2800_series_router_(1).jpg',
                'https://commons.wikimedia.org/wiki/Special:FilePath/Servers_in_a_Rack.jpg',
                'https://commons.wikimedia.org/wiki/Special:FilePath/WifiAccessPoint.jpg',
            ],
            'document' => 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        ],
        'vehicle' => [
            'photos' => [
                'https://commons.wikimedia.org/wiki/Special:FilePath/A_forklift.jpg',
                'https://commons.wikimedia.org/wiki/Special:FilePath/2020_Toyota_HiAce_(front).jpg',
                'https://commons.wikimedia.org/wiki/Special:FilePath/A_forklift.jpg',
            ],
            'document' => 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        ],
        'furniture' => [
            'photos' => [
                'https://commons.wikimedia.org/wiki/Special:FilePath/Office_Chair.jpg',
                'https://commons.wikimedia.org/wiki/Special:FilePath/Office_Chair.jpg',
                'https://commons.wikimedia.org/wiki/Special:FilePath/Office_Chair.jpg',
            ],
            'document' => 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
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

            $this->ensureAcquisitionDocument($asset, $def['image_kind'], $uploadedBy);

            if (! (bool) env('SEED_DEMO_MEDIA', true)) {
                continue;
            }

            foreach ($this->photoUrlsForKind($def['image_kind']) as $index => $url) {
                $alreadyAttached = $asset->media()
                    ->where('kind', 'photo')
                    ->where('sort_order', $index)
                    ->exists();

                if ($alreadyAttached) {
                    continue;
                }

                $downloaded = $this->downloadRemoteFile($url, ['image/jpeg', 'image/png', 'image/webp']);
                if (! $downloaded) {
                    continue;
                }

                $title = "{$asset->code} Photo ".($index + 1);

                $mediaAsset = $this->createMediaAssetFromBytes(
                    title: $title,
                    uploadedBy: $uploadedBy,
                    bytes: $downloaded['bytes'],
                    fileName: Str::slug($asset->code.'-photo-'.($index + 1)).'.'.$downloaded['ext'],
                );

                if ($mediaAsset) {
                    AssetMedia::query()->firstOrCreate(
                        [
                            'asset_id' => $asset->id,
                            'media_asset_id' => $mediaAsset->id,
                            'kind' => 'photo',
                        ],
                        [
                            'sort_order' => $index,
                            'is_primary' => $index === 0,
                        ],
                    );
                }
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
                'status' => 'active',
                'condition' => 'good',
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
                'status' => 'active',
                'condition' => 'needs_attention',
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
                'status' => 'active',
                'condition' => 'good',
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
                'status' => 'active',
                'condition' => 'good',
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
                'status' => 'borrowed',
                'condition' => 'needs_attention',
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
                'status' => 'active',
                'condition' => 'good',
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

    private function photoUrlsForKind(string $kind): array
    {
        return self::REMOTE_MEDIA[$kind]['photos'] ?? [];
    }

    private function documentUrlForKind(string $kind): ?string
    {
        return self::REMOTE_MEDIA[$kind]['document'] ?? null;
    }

    /**
     * @param  list<string>  $acceptedMimeTypes
     * @return array{bytes:string,mime:string,ext:string}|null
     */
    private function downloadRemoteFile(string $url, array $acceptedMimeTypes): ?array
    {
        try {
            $userAgent = trim(sprintf(
                '%s DemoAssetDataSeeder (+%s)',
                (string) config('app.name', 'asetku'),
                (string) config('app.url', 'http://localhost'),
            ));

            $response = Http::timeout(30)
                ->connectTimeout(10)
                ->withUserAgent($userAgent)
                ->accept(implode(',', $acceptedMimeTypes))
                ->retry(2, 250, throw: false)
                ->get($url);
        } catch (ConnectionException $e) {
            Log::warning('DemoAssetDataSeeder media download connection failed', [
                'url' => $url,
                'error' => $e->getMessage(),
            ]);

            return null;
        } catch (RequestException $e) {
            Log::warning('DemoAssetDataSeeder media download request exception', [
                'url' => $url,
                'status' => $e->response?->status(),
                'error' => $e->getMessage(),
            ]);

            return null;
        }

        if (! $response->successful()) {
            Log::warning('DemoAssetDataSeeder media download non-200', [
                'url' => $url,
                'status' => $response->status(),
            ]);

            return null;
        }

        $mime = trim(strtolower(Str::before((string) $response->header('Content-Type'), ';')));
        if ($mime === '' || ! in_array($mime, $acceptedMimeTypes, true)) {
            Log::warning('DemoAssetDataSeeder media download mime rejected', [
                'url' => $url,
                'mime' => $mime,
            ]);

            return null;
        }

        $bytes = (string) $response->body();
        if ($bytes === '') {
            Log::warning('DemoAssetDataSeeder media download empty body', ['url' => $url]);

            return null;
        }

        $max = min((int) config('media-library.max_file_size', 1024 * 1024 * 200), 10 * 1024 * 1024);
        if (strlen($bytes) > $max) {
            Log::warning('DemoAssetDataSeeder media download too large', [
                'url' => $url,
                'size' => strlen($bytes),
                'max' => $max,
            ]);

            return null;
        }

        $ext = $this->extensionFromMimeType($mime) ?? $this->extensionFromUrl($url) ?? 'bin';

        return [
            'bytes' => $bytes,
            'mime' => $mime,
            'ext' => $ext,
        ];
    }

    private function extensionFromMimeType(string $mime): ?string
    {
        return match ($mime) {
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            'application/pdf' => 'pdf',
            default => null,
        };
    }

    private function extensionFromUrl(string $url): ?string
    {
        $path = parse_url($url, PHP_URL_PATH);
        if (! is_string($path) || $path === '') {
            return null;
        }

        $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));

        return $ext !== '' ? $ext : null;
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

    private function ensureAcquisitionDocument(Asset $asset, string $kind, int $uploadedBy): void
    {
        $hasDoc = $asset->media()
            ->where('kind', 'document')
            ->where('stage', 'acquisition')
            ->where('document_type', 'invoice')
            ->exists();

        if ($hasDoc) {
            return;
        }

        $url = $this->documentUrlForKind($kind);
        if (! is_string($url) || $url === '') {
            return;
        }

        $downloaded = $this->downloadRemoteFile($url, ['application/pdf']);
        if (! $downloaded) {
            return;
        }

        $title = "{$asset->code} Invoice";
        $fileName = Str::slug($asset->code.'-invoice').'.'.$downloaded['ext'];

        $mediaAsset = $this->createMediaAssetFromBytes(
            title: $title,
            uploadedBy: $uploadedBy,
            bytes: $downloaded['bytes'],
            fileName: $fileName,
        );

        if (! $mediaAsset) {
            return;
        }

        AssetMedia::query()->firstOrCreate(
            [
                'asset_id' => $asset->id,
                'media_asset_id' => $mediaAsset->id,
                'kind' => 'document',
                'stage' => 'acquisition',
                'document_type' => 'invoice',
            ],
            [
                'sort_order' => 0,
                'is_primary' => true,
            ],
        );
    }
}
