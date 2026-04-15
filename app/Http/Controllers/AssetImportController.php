<?php

namespace App\Http\Controllers;

use App\Jobs\ApplyAssetImportJob;
use App\Jobs\ImportAssetPhotosFromZipJob;
use App\Jobs\ValidateAssetImportJob;
use App\Models\Asset;
use App\Models\ImportRun;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Inertia\Inertia;
use Inertia\Response;

class AssetImportController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Asset::class);

        $user = $request->user();
        if ($user === null) {
            abort(401);
        }

        $this->ensureCanImport($user);

        $runs = ImportRun::query()
            ->whereIn('type', ['assets', 'assets_photos_zip'])
            ->latest()
            ->limit(25)
            ->get(['id', 'type', 'status', 'created_at', 'report_path', 'error_message', 'meta']);

        return Inertia::render('assets/imports/index', [
            'importRuns' => $runs,
        ]);
    }

    public function validateFile(Request $request): RedirectResponse
    {
        $this->authorize('viewAny', Asset::class);

        $user = $request->user();
        if ($user === null) {
            abort(401);
        }

        $this->ensureCanImport($user);

        $data = $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx', 'max:10240'],
        ]);

        /** @var UploadedFile $file */
        $file = $data['file'];

        $path = $file->store('imports/assets', ['disk' => 'local']);

        $run = ImportRun::query()->create([
            'type' => 'assets',
            'status' => 'queued',
            'uploaded_by' => $user->id,
            'source_path' => $path,
            'meta' => [
                'original_name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
            ],
        ]);

        ValidateAssetImportJob::dispatch($run->id);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('imports.toast.queued')]);

        return back();
    }

    public function apply(Request $request, ImportRun $importRun): RedirectResponse
    {
        $this->authorize('viewAny', Asset::class);

        $user = $request->user();
        if ($user === null) {
            abort(401);
        }

        $this->ensureCanImport($user);

        abort_unless($importRun->type === 'assets', 404);
        abort_unless($importRun->status === 'completed', 422, __('imports.validation.not_ready'));

        $errorsCount = (int) (($importRun->meta['errors_count'] ?? null) ?: 0);
        abort_if($errorsCount > 0, 422, __('imports.validation.has_errors'));

        $importRun->forceFill(['status' => 'queued'])->save();
        ApplyAssetImportJob::dispatch($importRun->id);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('imports.toast.apply_queued')]);

        return back();
    }

    public function importPhotosZip(Request $request): RedirectResponse
    {
        $this->authorize('viewAny', Asset::class);

        $user = $request->user();
        if ($user === null) {
            abort(401);
        }

        $this->ensureCanImport($user);

        $data = $request->validate([
            'file' => ['required', 'file', 'mimes:zip', 'max:51200'],
        ]);

        /** @var UploadedFile $file */
        $file = $data['file'];

        $path = $file->store('imports/assets-photos', ['disk' => 'local']);

        $run = ImportRun::query()->create([
            'type' => 'assets_photos_zip',
            'status' => 'queued',
            'uploaded_by' => $user->id,
            'source_path' => $path,
            'meta' => [
                'original_name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
            ],
        ]);

        ImportAssetPhotosFromZipJob::dispatch($run->id);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('imports.toast.queued')]);

        return back();
    }

    private function ensureCanImport($user): void
    {
        $organizationId = $user->current_organization_id;
        $isManager = $organizationId !== null && $user->hasOrganizationRole((int) $organizationId, ['Owner', 'Admin', 'Manager']);

        abort_unless($user->can('asset_import.create') || $user->can('asset_import.update') || $isManager, 403);
    }
}
