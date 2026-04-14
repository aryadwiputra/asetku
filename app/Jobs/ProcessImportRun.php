<?php

namespace App\Jobs;

use App\Imports\BranchesImport;
use App\Models\ImportRun;
use App\Services\OrganizationContext;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use Throwable;

class ProcessImportRun implements ShouldQueue
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
            $report = $this->process($importRun);

            $reportPath = 'import-reports/import-run-'.$importRun->id.'.json';
            Storage::disk('local')->put($reportPath, json_encode($report, JSON_THROW_ON_ERROR));

            $importRun->forceFill([
                'status' => 'completed',
                'report_path' => $reportPath,
                'meta' => array_merge((array) $importRun->meta, [
                    'report_written_at' => now()->toISOString(),
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
        return match ($importRun->type) {
            'branches' => $this->processBranches($importRun),
            default => [
                'status' => 'skipped',
                'message' => 'Unknown import type.',
                'type' => $importRun->type,
            ],
        };
    }

    /**
     * @return array<string, mixed>
     */
    private function processBranches(ImportRun $importRun): array
    {
        $path = (string) $importRun->source_path;

        if (! str_starts_with($path, '/')) {
            $path = storage_path('app/'.$path);
        }

        Excel::import(new BranchesImport, $path);

        return [
            'status' => 'ok',
            'type' => 'branches',
        ];
    }
}
