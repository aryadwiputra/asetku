<?php

use App\Http\Controllers\MasterData\MasterDataHomeController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])
    ->prefix('settings/master-data')
    ->name('master-data.')
    ->group(function () {
        Route::get('/', [MasterDataHomeController::class, 'index'])->name('index');
    });

