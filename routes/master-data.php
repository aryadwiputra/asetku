<?php

use App\Http\Controllers\MasterData\AssetCategoryController;
use App\Http\Controllers\MasterData\AssetClassController;
use App\Http\Controllers\MasterData\AssetConditionController;
use App\Http\Controllers\MasterData\AssetLocationController;
use App\Http\Controllers\MasterData\AssetStatusController;
use App\Http\Controllers\MasterData\AssetUserController;
use App\Http\Controllers\MasterData\DepartmentController;
use App\Http\Controllers\MasterData\MasterDataHomeController;
use App\Http\Controllers\MasterData\PersonInChargeController;
use App\Http\Controllers\MasterData\UnitController;
use App\Http\Controllers\MasterData\VendorContractController;
use App\Http\Controllers\MasterData\WarrantyController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])
    ->prefix('settings/master-data')
    ->name('master-data.')
    ->group(function () {
        Route::get('/', [MasterDataHomeController::class, 'index'])->name('index');

        Route::resource('asset-statuses', AssetStatusController::class)->except(['show']);
        Route::resource('asset-conditions', AssetConditionController::class)->except(['show']);
        Route::resource('asset-classes', AssetClassController::class)->except(['show']);
        Route::resource('units', UnitController::class)->except(['show']);
        Route::resource('departments', DepartmentController::class)->except(['show']);
        Route::resource('person-in-charges', PersonInChargeController::class)->except(['show']);
        Route::resource('asset-users', AssetUserController::class)->except(['show']);
        Route::resource('asset-categories', AssetCategoryController::class)->except(['show']);
        Route::resource('asset-locations', AssetLocationController::class)->except(['show']);
        Route::resource('warranties', WarrantyController::class)->except(['show']);
        Route::resource('vendor-contracts', VendorContractController::class)->except(['show']);
    });
