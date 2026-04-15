<?php

namespace App\Jobs;

use App\Imports\AssetsImport;
use App\Models\Asset;
use App\Models\AssetCategory;
use App\Models\AssetCondition;
use App\Models\AssetHistory;
use App\Models\AssetLocation;
use App\Models\AssetStatus;
use App\Models\AssetUser;
use App\Models\Branch;
use App\Models\Department;
use App\Models\ImportRun;
use App\Models\PersonInCharge;
use App\Services\AssetCodeGenerator;
use App\Services\OrganizationContext;
use Carbon\CarbonImmutable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use Throwable;

class ApplyAssetImportJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public int $importRunId) {}

    public function handle(AssetCodeGenerator $codeGenerator): void
    {
        $importRun = ImportRun::query()->withoutGlobalScopes()->findOrFail($this->importRunId);

        app(OrganizationContext::class)->setCurrentOrganizationId((int) $importRun->organization_id);

        abort_unless($importRun->type === 'assets', 404);

        $importRun->forceFill([
            'status' => 'processing',
            'error_message' => null,
        ])->save();

        try {
            $result = $this->apply($importRun, $codeGenerator);

            $reportPath = "import-reports/assets-apply-{$importRun->id}.json";
            Storage::disk('local')->put($reportPath, json_encode($result, JSON_THROW_ON_ERROR));

            $importRun->forceFill([
                'status' => 'completed',
                'report_path' => $reportPath,
                'meta' => array_merge((array) $importRun->meta, [
                    'applied_at' => now()->toISOString(),
                    'created_count' => $result['created_count'] ?? 0,
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
    private function apply(ImportRun $importRun, AssetCodeGenerator $codeGenerator): array
    {
        $absolutePath = $this->absolutePath((string) $importRun->source_path);

        $import = new AssetsImport;
        Excel::import($import, $absolutePath);

        $branches = Branch::query()->get(['id', 'code'])->keyBy(fn (Branch $b) => mb_strtolower((string) $b->code));
        $departments = Department::query()->get(['id', 'code', 'branch_id'])->keyBy(fn (Department $d) => mb_strtolower((string) $d->code));
        $categories = AssetCategory::query()->get(['id', 'code', 'depreciation_method', 'useful_life_months', 'residual_value'])
            ->keyBy(fn (AssetCategory $c) => mb_strtolower((string) $c->code));
        $locations = AssetLocation::query()->get(['id', 'code', 'branch_id'])->keyBy(fn (AssetLocation $l) => mb_strtolower((string) $l->code));
        $statuses = AssetStatus::query()->get(['id', 'code'])->keyBy(fn (AssetStatus $s) => mb_strtolower((string) $s->code));
        $conditions = AssetCondition::query()->get(['id', 'code'])->keyBy(fn (AssetCondition $c) => mb_strtolower((string) $c->code));
        $pics = PersonInCharge::query()->get(['id', 'name'])->keyBy(fn (PersonInCharge $p) => mb_strtolower((string) $p->name));
        $assetUsers = AssetUser::query()->get(['id', 'name'])->keyBy(fn (AssetUser $u) => mb_strtolower((string) $u->name));

        $createdCount = 0;
        $errors = [];

        foreach ($import->rows as $index => $row) {
            $rowNumber = $index + 2;

            try {
                $name = trim((string) ($row['name'] ?? ''));
                $branchCode = trim((string) ($row['branch_code'] ?? ''));
                $branch = $branches->get(mb_strtolower($branchCode));

                if ($name === '' || ! $branch) {
                    throw new ModelNotFoundException('Invalid row.');
                }

                $departmentId = null;
                $departmentCode = trim((string) ($row['department_code'] ?? ''));
                if ($departmentCode !== '') {
                    $department = $departments->get(mb_strtolower($departmentCode));
                    if (! $department) {
                        throw new ModelNotFoundException('Department not found.');
                    }
                    $departmentId = (int) $department->id;
                }

                $locationId = null;
                $locationCode = trim((string) ($row['location_code'] ?? ''));
                if ($locationCode !== '') {
                    $location = $locations->get(mb_strtolower($locationCode));
                    if (! $location) {
                        throw new ModelNotFoundException('Location not found.');
                    }
                    $locationId = (int) $location->id;
                }

                $category = null;
                $categoryCode = trim((string) ($row['category_code'] ?? ''));
                if ($categoryCode !== '') {
                    $category = $categories->get(mb_strtolower($categoryCode));
                }

                $status = null;
                $statusCode = trim((string) ($row['status_code'] ?? ''));
                if ($statusCode !== '') {
                    $status = $statuses->get(mb_strtolower($statusCode));
                }

                $condition = null;
                $conditionCode = trim((string) ($row['condition_code'] ?? ''));
                if ($conditionCode !== '') {
                    $condition = $conditions->get(mb_strtolower($conditionCode));
                }

                $picId = null;
                $picName = trim((string) ($row['pic_name'] ?? ''));
                if ($picName !== '') {
                    $pic = $pics->get(mb_strtolower($picName));
                    $picId = $pic ? (int) $pic->id : null;
                }

                $assetUserId = null;
                $assetUserName = trim((string) ($row['asset_user_name'] ?? ''));
                if ($assetUserName !== '') {
                    $assetUser = $assetUsers->get(mb_strtolower($assetUserName));
                    $assetUserId = $assetUser ? (int) $assetUser->id : null;
                }

                $code = trim((string) ($row['code'] ?? ''));
                if ($code === '') {
                    $code = $codeGenerator->generate(Branch::query()->findOrFail((int) $branch->id));
                }

                $purchaseDate = trim((string) ($row['purchase_date'] ?? ''));
                $purchaseDate = $purchaseDate !== '' ? CarbonImmutable::parse($purchaseDate)->format('Y-m-d') : null;

                $cost = $row['cost'] ?? null;
                $cost = $cost !== null && $cost !== '' ? (float) $cost : null;

                $data = [
                    'code' => $code,
                    'name' => $name,
                    'brand' => trim((string) ($row['brand'] ?? '')) ?: null,
                    'model' => trim((string) ($row['model'] ?? '')) ?: null,
                    'series' => trim((string) ($row['series'] ?? '')) ?: null,
                    'serial_number' => trim((string) ($row['serial_number'] ?? '')) ?: null,
                    'imei' => trim((string) ($row['imei'] ?? '')) ?: null,
                    'branch_id' => (int) $branch->id,
                    'department_id' => $departmentId,
                    'asset_location_id' => $locationId,
                    'asset_category_id' => $category ? (int) $category->id : null,
                    'asset_status_id' => $status ? (int) $status->id : null,
                    'asset_condition_id' => $condition ? (int) $condition->id : null,
                    'person_in_charge_id' => $picId,
                    'asset_user_id' => $assetUserId,
                    'purchase_date' => $purchaseDate,
                    'cost' => $cost,
                    'metadata' => [],
                    'depreciation_method' => $category?->depreciation_method,
                    'useful_life_months' => $category?->useful_life_months,
                    'residual_value' => $category?->residual_value,
                ];

                DB::transaction(function () use ($data): void {
                    $asset = Asset::query()->create($data);

                    AssetHistory::query()->create([
                        'asset_id' => $asset->id,
                        'action' => 'imported',
                        'description' => __('imports.assets.history.imported'),
                        'changed_by' => null,
                        'payload' => $data,
                    ]);
                });

                $createdCount++;
            } catch (Throwable $e) {
                $errors[] = [
                    'row' => $rowNumber,
                    'message' => $e->getMessage(),
                ];
            }
        }

        return [
            'status' => $errors === [] ? 'ok' : 'partial',
            'type' => 'assets',
            'created_count' => $createdCount,
            'errors' => $errors,
        ];
    }

    private function absolutePath(string $path): string
    {
        if (str_starts_with($path, '/')) {
            return $path;
        }

        return storage_path('app/'.$path);
    }
}
