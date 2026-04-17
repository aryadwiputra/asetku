<?php

use App\Http\Controllers\AssetAttachmentController;
use App\Http\Controllers\AssetController;
use App\Http\Controllers\AssetExportController;
use App\Http\Controllers\AssetImportController;
use App\Http\Controllers\AssetLabelController;
use App\Http\Controllers\AssetLifecycleController;
use App\Http\Controllers\AssetLifecycleEventController;
use App\Http\Controllers\AssetMovementController;
use App\Http\Controllers\AssetSavedFilterController;
use App\Http\Controllers\QrController;
use Illuminate\Support\Facades\Route;

// Public QR & scan
Route::get('q/{token}', [QrController::class, 'show'])->name('qr.show');
Route::inertia('scan', 'scan/index')->name('scan.index');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('assets', AssetController::class);

    Route::get('asset-lifecycle', [AssetLifecycleController::class, 'index'])->name('assets.lifecycle.index');
    Route::get('asset-lifecycle/by-token/{token}', [AssetLifecycleController::class, 'byToken'])->name('assets.lifecycle.by-token');
    Route::get('asset-lifecycle/{asset}', [AssetLifecycleController::class, 'show'])->name('assets.lifecycle.show');

    Route::post('assets/{asset}/attachments', [AssetAttachmentController::class, 'store'])->name('assets.attachments.store');
    Route::delete('assets/{asset}/attachments/{assetMedia}', [AssetAttachmentController::class, 'destroy'])->name('assets.attachments.destroy');

    Route::post('assets/{asset}/lifecycle-events', [AssetLifecycleEventController::class, 'store'])->name('assets.lifecycle-events.store');
    Route::post('assets/{asset}/movements', [AssetMovementController::class, 'store'])->name('assets.movements.store');

    Route::get('assets-labels/print', [AssetLabelController::class, 'print'])->name('assets.labels.print');
    Route::get('assets-export', [AssetExportController::class, 'export'])->name('assets.export');

    Route::post('assets-saved-filters', [AssetSavedFilterController::class, 'store'])->name('assets.saved-filters.store');
    Route::patch('assets-saved-filters/{savedFilter}', [AssetSavedFilterController::class, 'update'])->name('assets.saved-filters.update');
    Route::delete('assets-saved-filters/{savedFilter}', [AssetSavedFilterController::class, 'destroy'])->name('assets.saved-filters.destroy');

    Route::get('assets-import', [AssetImportController::class, 'index'])->name('assets.import.index');
    Route::post('assets-import/validate', [AssetImportController::class, 'validateFile'])->name('assets.import.validate');
    Route::post('assets-import/{importRun}/apply', [AssetImportController::class, 'apply'])->name('assets.import.apply');
    Route::post('assets-import/photos-zip', [AssetImportController::class, 'importPhotosZip'])->name('assets.import.photos-zip');
});
