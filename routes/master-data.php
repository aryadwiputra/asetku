<?php

use App\Http\Controllers\MasterData\MasterDataHomeController;
use App\Http\Controllers\MasterData\AssetClassController;
use App\Http\Controllers\MasterData\AssetStatusController;
use App\Http\Controllers\MasterData\UnitController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])
    ->prefix('settings/master-data')
    ->name('master-data.')
    ->group(function () {
        Route::get('/', [MasterDataHomeController::class, 'index'])->name('index');

        Route::resource('asset-statuses', AssetStatusController::class)->except(['show']);
        Route::resource('asset-classes', AssetClassController::class)->except(['show']);
        Route::resource('units', UnitController::class)->except(['show']);
    });
