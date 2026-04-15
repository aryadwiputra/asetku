<?php

namespace App\Jobs;

use App\Models\Asset;
use App\Models\AssetMedia;
use App\Models\ImportRun;
use App\Models\MediaAsset;
use App\Services\OrganizationContext;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;
use ZipArchive;

class ImportAssetPhotosFromZipJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public int $importRunId) {}

    public function handle(): void
    {
        $importRun = ImportRun::query()->withoutGlobalScopes()->findOrFail($this->importRunId);

        app(OrganizationContext::class)->setCurrentOrganizationId((int) $importRun->organization_id);

        abort_unless($importRun->type === 'assets_photos_zip', 404);

        $importRun->forceFill([
            'status' => 'processing',
            'error_message' => null,
        ])->save();

        try {
            $report = $this->process($importRun);

            $reportPath = "import-reports/assets-photos-{$importRun->id}.json";
            Storage::disk('local')->put($reportPath, json_encode($report, JSON_THROW_ON_ERROR));

            $importRun->forceFill([
                'status' => 'completed',
                'report_path' => $reportPath,
                'meta' => array_merge((array) $importRun->meta, [
                    'processed_files' => $report['processed_files'] ?? 0,
                    'attached_files' => $report['attached_files'] ?? 0,
                    'failed_files' => count($report['errors'] ?? []),
                ]),
            ])->save();
        } catch (Throwable $e) {
            $importRun->forceFill([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ])->save();

            throw $e;
        }
    }

    /**
     * @return array<string, mixed>
     */
    private function process(ImportRun $importRun): array
    {
        $absoluteZip = $this->absolutePath((string) $importRun->source_path);
        $tmpDir = storage_path('app/tmp/assets-zip-'.$importRun->id.'-'.Str::lower(Str::random(8)));

        if (! is_dir($tmpDir)) {
            mkdir($tmpDir, 0755, true);
        }

        $zip = new ZipArchive;
        $opened = $zip->open($absoluteZip);
        if ($opened !== true) {
            throw new \RuntimeException('Unable to open ZIP.');
        }

        try {
            $zip->extractTo($tmpDir);
        } finally {
            $zip->close();
        }

        $errors = [];
        $processed = 0;
        $attached = 0;

        $files = $this->listFiles($tmpDir);
        foreach ($files as $file) {
            $processed++;

            $base = pathinfo($file, PATHINFO_FILENAME);
            $prefix = Str::of($base)->before('_')->toString();
            $assetCode = trim($prefix);

            if ($assetCode === '') {
                $errors[] = ['file' => basename($file), 'message' => 'Missing asset code prefix.'];

                continue;
            }

            $asset = Asset::query()
                ->whereRaw('LOWER(code) = ?', [mb_strtolower($assetCode)])
                ->first();

            if ($asset === null) {
                $errors[] = ['file' => basename($file), 'message' => "Asset not found for code {$assetCode}."];

                continue;
            }

            $photoCount = AssetMedia::query()->where('asset_id', $asset->id)->where('kind', 'photo')->count();
            if ($photoCount >= 10) {
                $errors[] = ['file' => basename($file), 'message' => "Asset {$asset->code} already has 10 photos."];

                continue;
            }

            $isPrimary = ! AssetMedia::query()->where('asset_id', $asset->id)->where('kind', 'photo')->where('is_primary', true)->exists();

            $mediaAsset = MediaAsset::query()->create([
                'title' => basename($file),
                'uploaded_by' => $importRun->uploaded_by,
            ]);

            $mediaAsset->addMedia($file)->toMediaCollection('file');

            DB::transaction(function () use ($asset, $mediaAsset, $isPrimary): void {
                $nextSort = (int) (AssetMedia::query()
                    ->where('asset_id', $asset->id)
                    ->where('kind', 'photo')
                    ->max('sort_order') ?? 0);

                AssetMedia::query()->create([
                    'asset_id' => $asset->id,
                    'media_asset_id' => $mediaAsset->id,
                    'kind' => 'photo',
                    'sort_order' => $nextSort + 1,
                    'is_primary' => $isPrimary,
                ]);
            });

            $attached++;
        }

        $this->cleanupDir($tmpDir);

        return [
            'status' => $errors === [] ? 'ok' : 'partial',
            'type' => 'assets_photos_zip',
            'processed_files' => $processed,
            'attached_files' => $attached,
            'errors' => $errors,
        ];
    }

    /**
     * @return list<string>
     */
    private function listFiles(string $dir): array
    {
        $results = [];
        $iterator = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($dir));

        foreach ($iterator as $info) {
            if (! $info instanceof \SplFileInfo) {
                continue;
            }
            if ($info->isDir()) {
                continue;
            }
            $path = $info->getPathname();
            $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
            if (! in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'gif'], true)) {
                continue;
            }
            $results[] = $path;
        }

        return $results;
    }

    private function cleanupDir(string $dir): void
    {
        if (! is_dir($dir)) {
            return;
        }

        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($dir, \FilesystemIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::CHILD_FIRST,
        );

        foreach ($iterator as $fileInfo) {
            if ($fileInfo->isDir()) {
                @rmdir($fileInfo->getPathname());
            } else {
                @unlink($fileInfo->getPathname());
            }
        }

        @rmdir($dir);
    }

    private function absolutePath(string $path): string
    {
        if (str_starts_with($path, '/')) {
            return $path;
        }

        return storage_path('app/'.$path);
    }
}
