<?php

use App\Http\Controllers\Reports\InventoryReportController;
use App\Http\Controllers\Reports\InventoryStocktakePrintController;
use App\Http\Controllers\Reports\MaintenanceCostReportController;
use App\Http\Controllers\Reports\WorkOrderReportController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])
    ->prefix('reports')
    ->name('reports.')
    ->group(function () {
        Route::get('inventory', [InventoryReportController::class, 'index'])
            ->can('viewInventoryReport')
            ->name('inventory.index');
        Route::get('inventory/stocktake/print', [InventoryStocktakePrintController::class, 'show'])
            ->can('viewInventoryReport')
            ->name('inventory.stocktake.print');
        Route::get('work-orders', [WorkOrderReportController::class, 'index'])
            ->can('viewMaintenanceReport')
            ->name('work-orders.index');
        Route::get('maintenance-costs', [MaintenanceCostReportController::class, 'index'])
            ->can('viewMaintenanceReport')
            ->name('maintenance-costs.index');
    });
