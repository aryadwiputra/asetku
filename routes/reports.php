<?php

use App\Http\Controllers\Reports\InventoryReportController;
use App\Http\Controllers\Reports\InventoryStocktakePrintController;
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
    });
