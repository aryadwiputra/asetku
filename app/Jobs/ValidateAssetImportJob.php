<?php

namespace App\Jobs;

use App\Imports\AssetsImport;
use App\Models\AssetCategory;
use App\Models\AssetCondition;
use App\Models\AssetLocation;
use App\Models\AssetStatus;
use App\Models\AssetUser;
use App\Models\Branch;
use App\Models\Department;
use App\Models\ImportRun;
use App\Models\PersonInCharge;
use App\Services\OrganizationContext;
use Carbon\CarbonImmutable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use Throwable;

class ValidateAssetImportJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public int $importRunId) {}

    public function handle(): void
    {
        $importRun = ImportRun::query()->withoutGlobalScopes()->findOrFail($this->importRunId);

        app(OrganizationContext::class)->setCurrentOrganizationId((int) $importRun->organization_id);

        $importRun->forceFill([
            'status' => 'processing',
            'error_message' => null,
        ])->save();

        try {
            $report = $this->validateFile($importRun);

            $reportPath = "import-reports/assets-{$importRun->id}.json";
            Storage::disk('local')->put($reportPath, json_encode($report, JSON_THROW_ON_ERROR));

            $importRun->forceFill([
                'status' => 'completed',
                'report_path' => $reportPath,
                'meta' => array_merge((array) $importRun->meta, [
                    'rows_total' => $report['rows_total'] ?? 0,
                    'rows_valid' => $report['rows_valid'] ?? 0,
                    'errors_count' => count($report['errors'] ?? []),
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
    private function validateFile(ImportRun $importRun): array
    {
        $absolutePath = $this->absolutePath((string) $importRun->source_path);

        $import = new AssetsImport;
        Excel::import($import, $absolutePath);

        $branches = Branch::query()->get(['id', 'code'])->keyBy(fn (Branch $b) => mb_strtolower((string) $b->code));
        $departments = Department::query()->get(['id', 'code', 'branch_id'])->keyBy(fn (Department $d) => mb_strtolower((string) $d->code));
        $categories = AssetCategory::query()->get(['id', 'code'])->keyBy(fn (AssetCategory $c) => mb_strtolower((string) $c->code));
        $locations = AssetLocation::query()->get(['id', 'code', 'branch_id'])->keyBy(fn (AssetLocation $l) => mb_strtolower((string) $l->code));
        $statuses = AssetStatus::query()->get(['id', 'code'])->keyBy(fn (AssetStatus $s) => mb_strtolower((string) $s->code));
        $conditions = AssetCondition::query()->get(['id', 'code'])->keyBy(fn (AssetCondition $c) => mb_strtolower((string) $c->code));
        $pics = PersonInCharge::query()->get(['id', 'name'])->keyBy(fn (PersonInCharge $p) => mb_strtolower((string) $p->name));
        $assetUsers = AssetUser::query()->get(['id', 'name'])->keyBy(fn (AssetUser $u) => mb_strtolower((string) $u->name));

        $errors = [];
        $valid = 0;
        $total = 0;

        foreach ($import->rows as $index => $row) {
            $total++;
            $rowNumber = $index + 2; // heading row is 1

            $name = trim((string) ($row['name'] ?? ''));
            $branchCode = trim((string) ($row['branch_code'] ?? ''));

            if ($name === '') {
                $errors[] = ['row' => $rowNumber, 'field' => 'name', 'message' => __('imports.assets.errors.name_required')];

                continue;
            }

            if ($branchCode === '') {
                $errors[] = ['row' => $rowNumber, 'field' => 'branch_code', 'message' => __('imports.assets.errors.branch_required')];

                continue;
            }

            $branch = $branches->get(mb_strtolower($branchCode));
            if (! $branch) {
                $errors[] = ['row' => $rowNumber, 'field' => 'branch_code', 'message' => __('imports.assets.errors.branch_not_found', ['code' => $branchCode])];

                continue;
            }

            $departmentCode = trim((string) ($row['department_code'] ?? ''));
            if ($departmentCode !== '') {
                $department = $departments->get(mb_strtolower($departmentCode));
                if (! $department) {
                    $errors[] = ['row' => $rowNumber, 'field' => 'department_code', 'message' => __('imports.assets.errors.department_not_found', ['code' => $departmentCode])];

                    continue;
                }
                if ((int) $department->branch_id !== (int) $branch->id) {
                    $errors[] = ['row' => $rowNumber, 'field' => 'department_code', 'message' => __('imports.assets.errors.department_branch_mismatch', ['code' => $departmentCode])];

                    continue;
                }
            }

            $locationCode = trim((string) ($row['location_code'] ?? ''));
            if ($locationCode !== '') {
                $location = $locations->get(mb_strtolower($locationCode));
                if (! $location) {
                    $errors[] = ['row' => $rowNumber, 'field' => 'location_code', 'message' => __('imports.assets.errors.location_not_found', ['code' => $locationCode])];

                    continue;
                }
                if ((int) $location->branch_id !== (int) $branch->id) {
                    $errors[] = ['row' => $rowNumber, 'field' => 'location_code', 'message' => __('imports.assets.errors.location_branch_mismatch', ['code' => $locationCode])];

                    continue;
                }
            }

            $categoryCode = trim((string) ($row['category_code'] ?? ''));
            if ($categoryCode !== '' && ! $categories->has(mb_strtolower($categoryCode))) {
                $errors[] = ['row' => $rowNumber, 'field' => 'category_code', 'message' => __('imports.assets.errors.category_not_found', ['code' => $categoryCode])];

                continue;
            }

            $statusCode = trim((string) ($row['status_code'] ?? ''));
            if ($statusCode !== '' && ! $statuses->has(mb_strtolower($statusCode))) {
                $errors[] = ['row' => $rowNumber, 'field' => 'status_code', 'message' => __('imports.assets.errors.status_not_found', ['code' => $statusCode])];

                continue;
            }

            $conditionCode = trim((string) ($row['condition_code'] ?? ''));
            if ($conditionCode !== '' && ! $conditions->has(mb_strtolower($conditionCode))) {
                $errors[] = ['row' => $rowNumber, 'field' => 'condition_code', 'message' => __('imports.assets.errors.condition_not_found', ['code' => $conditionCode])];

                continue;
            }

            $picName = trim((string) ($row['pic_name'] ?? ''));
            if ($picName !== '' && ! $pics->has(mb_strtolower($picName))) {
                $errors[] = ['row' => $rowNumber, 'field' => 'pic_name', 'message' => __('imports.assets.errors.pic_not_found', ['name' => $picName])];

                continue;
            }

            $assetUserName = trim((string) ($row['asset_user_name'] ?? ''));
            if ($assetUserName !== '' && ! $assetUsers->has(mb_strtolower($assetUserName))) {
                $errors[] = ['row' => $rowNumber, 'field' => 'asset_user_name', 'message' => __('imports.assets.errors.asset_user_not_found', ['name' => $assetUserName])];

                continue;
            }

            $purchaseDate = trim((string) ($row['purchase_date'] ?? ''));
            if ($purchaseDate !== '' && ! $this->isValidDate($purchaseDate)) {
                $errors[] = ['row' => $rowNumber, 'field' => 'purchase_date', 'message' => __('imports.assets.errors.purchase_date_invalid')];

                continue;
            }

            $cost = $row['cost'] ?? null;
            if ($cost !== null && $cost !== '' && ! is_numeric($cost)) {
                $errors[] = ['row' => $rowNumber, 'field' => 'cost', 'message' => __('imports.assets.errors.cost_invalid')];

                continue;
            }

            $valid++;
        }

        return [
            'status' => 'ok',
            'type' => 'assets',
            'rows_total' => $total,
            'rows_valid' => $valid,
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

    private function isValidDate(string $value): bool
    {
        try {
            $dt = CarbonImmutable::parse($value);

            return $dt->format('Y-m-d') !== '';
        } catch (Throwable) {
            return false;
        }
    }
}
