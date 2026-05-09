<?php

use App\Http\Controllers\AssetAttachmentController;
use App\Http\Controllers\AssetController;
use App\Http\Controllers\AssetDisposalApprovalController;
use App\Http\Controllers\AssetDisposalBaController;
use App\Http\Controllers\AssetDisposalController;
use App\Http\Controllers\AssetExportController;
use App\Http\Controllers\AssetImportController;
use App\Http\Controllers\AssetLabelController;
use App\Http\Controllers\AssetLifecycleConditionController;
use App\Http\Controllers\AssetLifecycleController;
use App\Http\Controllers\AssetLifecycleEventController;
use App\Http\Controllers\AssetLifecycleStatusController;
use App\Http\Controllers\AssetMovementController;
use App\Http\Controllers\AssetSavedFilterController;
use App\Http\Controllers\AssetUsageLogController;
use App\Http\Controllers\AssetWarrantyClaimController;
use App\Http\Controllers\AuditFindingController;
use App\Http\Controllers\AuditScheduleController;
use App\Http\Controllers\DepreciationAssetController;
use App\Http\Controllers\DepreciationController;
use App\Http\Controllers\DepreciationExportController;
use App\Http\Controllers\DepreciationRunController;
use App\Http\Controllers\MaintenanceCalendarController;
use App\Http\Controllers\MaintenanceCalendarEventsController;
use App\Http\Controllers\MaintenanceCalendarFeedController;
use App\Http\Controllers\MaintenanceCalendarFeedTokenController;
use App\Http\Controllers\MaintenanceChecklistController;
use App\Http\Controllers\MaintenanceScheduleController;
use App\Http\Controllers\MaintenanceScheduleRescheduleController;
use App\Http\Controllers\QrController;
use App\Http\Controllers\TechnicianController;
use App\Http\Controllers\VendorContractController;
use App\Http\Controllers\WorkOrderAttachmentController;
use App\Http\Controllers\WorkOrderController;
use App\Http\Controllers\WorkOrderCostLineController;
use App\Http\Controllers\WorkOrderTaskController;
use App\Models\Asset;
use App\Models\MaintenanceSchedule;
use Illuminate\Support\Facades\Route;

// Public QR & scan
Route::get('q/{token}', [QrController::class, 'show'])->name('qr.show');
Route::inertia('scan', 'scan/index')->name('scan.index');
Route::get('calendars/maintenance/{token}.ics', [MaintenanceCalendarFeedController::class, 'show'])->name('maintenance-calendar.feed');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('maintenance-calendar', [MaintenanceCalendarController::class, 'index'])->name('maintenance-calendar.index');
    Route::get('maintenance-calendar/events', [MaintenanceCalendarEventsController::class, 'index'])
        ->can('viewAny', MaintenanceSchedule::class)
        ->name('maintenance-calendar.events');
    Route::post('maintenance-calendar/feed-token', [MaintenanceCalendarFeedTokenController::class, 'store'])
        ->can('viewAny', MaintenanceSchedule::class)
        ->name('maintenance-calendar.feed-token');

    Route::resource('assets', AssetController::class);
    Route::resource('vendor-contracts', VendorContractController::class);
    Route::post('vendor-contracts/{vendorContract}/renew', [VendorContractController::class, 'renew'])->name('vendor-contracts.renew');
    Route::post('vendor-contracts/{vendorContract}/documents', [VendorContractController::class, 'storeDocument'])->name('vendor-contracts.documents.store');

    // Disposal module
    Route::get('disposals', [AssetDisposalController::class, 'index'])->name('disposals.index');
    Route::get('disposals/create', [AssetDisposalController::class, 'create'])->name('disposals.create');
    Route::get('disposals/by-token/{token}', [AssetDisposalController::class, 'byToken'])->name('disposals.by-token');
    Route::post('disposals', [AssetDisposalController::class, 'store'])->name('disposals.store');
    Route::get('disposals/{disposal}', [AssetDisposalController::class, 'show'])->name('disposals.show');
    Route::post('disposals/{disposal}/approve', [AssetDisposalApprovalController::class, 'approve'])->name('disposals.approve');
    Route::post('disposals/{disposal}/reject', [AssetDisposalApprovalController::class, 'reject'])->name('disposals.reject');
    Route::get('disposals/{disposal}/ba', [AssetDisposalBaController::class, 'show'])->name('disposals.ba');

    // Depreciation module
    Route::get('depreciation', [DepreciationController::class, 'index'])->name('depreciation.index');
    Route::post('depreciation/runs', [DepreciationRunController::class, 'store'])->name('depreciation.runs.store');
    Route::get('depreciation/assets/{asset}', [DepreciationAssetController::class, 'show'])->name('depreciation.assets.show');
    Route::get('assets/{asset}/depreciation/export', [DepreciationExportController::class, 'asset'])->name('depreciation.assets.export');
    Route::get('depreciation/export', [DepreciationExportController::class, 'organization'])->name('depreciation.export');
    Route::post('depreciation/assets/{asset}/usage-logs', [AssetUsageLogController::class, 'store'])->name('depreciation.assets.usage-logs.store');

    Route::get('asset-lifecycle', [AssetLifecycleController::class, 'index'])->name('assets.lifecycle.index');
    Route::get('asset-lifecycle/by-token/{token}', [AssetLifecycleController::class, 'byToken'])->name('assets.lifecycle.by-token');
    Route::get('asset-lifecycle/{asset}', [AssetLifecycleController::class, 'show'])->name('assets.lifecycle.show');
    Route::post('asset-lifecycle/{asset}/status', [AssetLifecycleStatusController::class, 'store'])->name('assets.lifecycle.status');
    Route::post('asset-lifecycle/{asset}/condition', [AssetLifecycleConditionController::class, 'store'])->name('assets.lifecycle.condition');

    Route::post('assets/{asset}/attachments', [AssetAttachmentController::class, 'store'])->name('assets.attachments.store');
    Route::delete('assets/{asset}/attachments/{assetMedia}', [AssetAttachmentController::class, 'destroy'])->name('assets.attachments.destroy');

    Route::post('assets/{asset}/lifecycle-events', [AssetLifecycleEventController::class, 'store'])->name('assets.lifecycle-events.store');
    Route::post('assets/{asset}/movements', [AssetMovementController::class, 'store'])->name('assets.movements.store');
    Route::post('assets/{asset}/warranty-claims', [AssetWarrantyClaimController::class, 'store'])->name('assets.warranty-claims.store');
    Route::patch('assets/{asset}/warranty-claims/{claim}', [AssetWarrantyClaimController::class, 'update'])->name('assets.warranty-claims.update');

    Route::get('assets-labels/print', [AssetLabelController::class, 'print'])->name('assets.labels.print');
    Route::get('assets-export', [AssetExportController::class, 'export'])
        ->can('export', Asset::class)
        ->name('assets.export');

    Route::post('assets-saved-filters', [AssetSavedFilterController::class, 'store'])->name('assets.saved-filters.store');
    Route::patch('assets-saved-filters/{savedFilter}', [AssetSavedFilterController::class, 'update'])->name('assets.saved-filters.update');
    Route::delete('assets-saved-filters/{savedFilter}', [AssetSavedFilterController::class, 'destroy'])->name('assets.saved-filters.destroy');

    Route::get('assets-import', [AssetImportController::class, 'index'])
        ->can('import', Asset::class)
        ->name('assets.import.index');
    Route::post('assets-import/validate', [AssetImportController::class, 'validateFile'])
        ->can('import', Asset::class)
        ->name('assets.import.validate');
    Route::post('assets-import/{importRun}/apply', [AssetImportController::class, 'apply'])
        ->can('import', Asset::class)
        ->name('assets.import.apply');
    Route::post('assets-import/photos-zip', [AssetImportController::class, 'importPhotosZip'])
        ->can('import', Asset::class)
        ->name('assets.import.photos-zip');

    // Work orders (asset maintenance)
    Route::get('work-orders/my', [WorkOrderController::class, 'my'])->name('work-orders.my');
    Route::get('work-orders/by-token/{token}', [WorkOrderController::class, 'byToken'])->name('work-orders.by-token');
    Route::resource('work-orders', WorkOrderController::class)
        ->parameters(['work-orders' => 'workOrder'])
        ->except(['destroy']);
    Route::post('work-orders/{workOrder}/tasks', [WorkOrderTaskController::class, 'store'])->name('work-orders.tasks.store');
    Route::patch('work-orders/{workOrder}/tasks/{task}', [WorkOrderTaskController::class, 'update'])->name('work-orders.tasks.update');
    Route::post('work-orders/{workOrder}/cost-lines', [WorkOrderCostLineController::class, 'store'])->name('work-orders.cost-lines.store');
    Route::patch('work-orders/{workOrder}/cost-lines/{costLine}', [WorkOrderCostLineController::class, 'update'])->name('work-orders.cost-lines.update');
    Route::delete('work-orders/{workOrder}/cost-lines/{costLine}', [WorkOrderCostLineController::class, 'destroy'])->name('work-orders.cost-lines.destroy');
    Route::post('work-orders/{workOrder}/attachments', [WorkOrderAttachmentController::class, 'store'])->name('work-orders.attachments.store');
    Route::delete('work-orders/{workOrder}/attachments/{attachment}', [WorkOrderAttachmentController::class, 'destroy'])->name('work-orders.attachments.destroy');

    // Preventive maintenance schedules
    Route::patch('maintenance-schedules/{schedule}/reschedule', [MaintenanceScheduleRescheduleController::class, 'update'])
        ->name('maintenance-schedules.reschedule');
    Route::resource('maintenance-schedules', MaintenanceScheduleController::class)
        ->parameters(['maintenance-schedules' => 'schedule'])
        ->except(['show']);

    // Checklist templates
    Route::resource('maintenance-checklists', MaintenanceChecklistController::class)
        ->parameters(['maintenance-checklists' => 'template'])
        ->except(['show']);

    // Technicians
    Route::resource('technicians', TechnicianController::class)
        ->parameters(['technicians' => 'technician'])
        ->except(['show']);

    // Audit module
    Route::prefix('audit')->name('audit.')->group(function () {
        Route::get('schedules', [AuditScheduleController::class, 'index'])->name('schedules.index');
        Route::get('schedules/create', [AuditScheduleController::class, 'create'])->name('schedules.create');
        Route::post('schedules', [AuditScheduleController::class, 'store'])->name('schedules.store');
        Route::get('schedules/{auditSchedule}', [AuditScheduleController::class, 'show'])->name('schedules.show');
        Route::get('schedules/{auditSchedule}/edit', [AuditScheduleController::class, 'edit'])->name('schedules.edit');
        Route::patch('schedules/{auditSchedule}', [AuditScheduleController::class, 'update'])->name('schedules.update');
        Route::delete('schedules/{auditSchedule}', [AuditScheduleController::class, 'destroy'])->name('schedules.destroy');
        Route::post('schedules/{auditSchedule}/start', [AuditScheduleController::class, 'start'])->name('schedules.start');
        Route::post('schedules/{auditSchedule}/complete', [AuditScheduleController::class, 'complete'])->name('schedules.complete');

        Route::get('findings', [AuditFindingController::class, 'index'])->name('findings.index');
        Route::get('findings/create/{asset}', [AuditFindingController::class, 'createForAsset'])->name('findings.create');
        Route::post('findings', [AuditFindingController::class, 'store'])->name('findings.store');
        Route::get('findings/{auditFinding}/edit', [AuditFindingController::class, 'edit'])->name('findings.edit');
        Route::patch('findings/{auditFinding}', [AuditFindingController::class, 'update'])->name('findings.update');
        Route::post('findings/{auditFinding}/approve', [AuditFindingController::class, 'approve'])->name('findings.approve');
        Route::post('findings/{auditFinding}/reject', [AuditFindingController::class, 'reject'])->name('findings.reject');
        Route::delete('findings/{auditFinding}', [AuditFindingController::class, 'destroy'])->name('findings.destroy');
    });
});
