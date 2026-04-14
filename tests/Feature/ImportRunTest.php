<?php

use App\Jobs\ProcessImportRun;
use App\Models\Branch;
use App\Models\ImportRun;
use App\Models\Organization;
use App\Models\User;
use App\Services\OrganizationContext;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

test('branch import run processes via queue job and writes a report', function () {
    $organization = Organization::factory()->create(['slug' => 'org-a']);
    app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

    $user = User::factory()->inOrganization($organization)->create();

    $spreadsheet = new Spreadsheet;
    $sheet = $spreadsheet->getActiveSheet();
    $sheet->fromArray([
        ['code', 'name', 'address'],
        ['BDG', 'Bandung', 'Jl. Asia Afrika'],
    ]);

    $sourcePath = storage_path('app/imports/branches.xlsx');
    @mkdir(dirname($sourcePath), 0777, true);
    (new Xlsx($spreadsheet))->save($sourcePath);

    $importRun = ImportRun::query()->create([
        'type' => 'branches',
        'status' => 'queued',
        'uploaded_by' => $user->id,
        'source_path' => $sourcePath,
        'meta' => ['filename' => 'branches.xlsx'],
    ]);

    ProcessImportRun::dispatchSync($importRun->id);

    $importRun->refresh();

    expect($importRun->status)->toBe('completed');
    expect($importRun->report_path)->not->toBeNull();

    expect(Branch::query()->where('code', 'BDG')->exists())->toBeTrue();
    expect(Storage::disk('local')->exists((string) $importRun->report_path))->toBeTrue();
});
