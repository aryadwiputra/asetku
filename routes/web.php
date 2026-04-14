<?php

use App\Http\Controllers\BranchController;
use App\Http\Controllers\ColumnPreferenceController;
use App\Http\Controllers\ImpersonationController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\OrganizationImportTemplateController;
use App\Http\Controllers\OrganizationOnboardingController;
use App\Http\Controllers\OrganizationSwitchController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::post('locale', LocaleController::class)->name('locale.update');

Route::get('api/docs', fn () => redirect()->route('scramble.docs.ui'))->name('api.docs');
Route::get('api/docs.json', fn () => redirect()->route('scramble.docs.document'))->name('api.docs.document');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Organization
    Route::get('organizations', [OrganizationController::class, 'index'])->name('organizations.index');
    Route::post('organizations/{organization}/switch', OrganizationSwitchController::class)->name('organizations.switch');
    Route::get('organizations/import-template/{type}', OrganizationImportTemplateController::class)->name('organizations.import-template');

    Route::prefix('organizations/onboarding')->name('organizations.onboarding.')->group(function () {
        Route::get('profile', [OrganizationOnboardingController::class, 'profile'])->name('profile');
        Route::post('profile', [OrganizationOnboardingController::class, 'storeProfile'])->name('profile.store');

        Route::get('plan', [OrganizationOnboardingController::class, 'plan'])->name('plan');
        Route::post('plan', [OrganizationOnboardingController::class, 'updatePlan'])->name('plan.update');

        Route::get('locale', [OrganizationOnboardingController::class, 'locale'])->name('locale');
        Route::post('locale', [OrganizationOnboardingController::class, 'updateLocale'])->name('locale.update');

        Route::get('asset-code', [OrganizationOnboardingController::class, 'assetCode'])->name('asset-code');
        Route::post('asset-code', [OrganizationOnboardingController::class, 'updateAssetCode'])->name('asset-code.update');

        Route::get('import', [OrganizationOnboardingController::class, 'import'])->name('import');
        Route::post('import', [OrganizationOnboardingController::class, 'storeImport'])->name('import.store');
    });

    // Branches
    Route::resource('branches', BranchController::class);

    // User Management
    Route::resource('users', UserController::class);
    Route::resource('roles', RoleController::class)->except(['show']);
    Route::post('users/bulk-action', [UserController::class, 'bulkAction'])->name('users.bulk-action');
    Route::get('users-export', [UserController::class, 'export'])->name('users.export');

    // Impersonation
    Route::post('impersonate/{user}', [ImpersonationController::class, 'start'])->name('impersonate.start');
    Route::post('impersonate-stop', [ImpersonationController::class, 'stop'])->name('impersonate.stop');

    // Column Preferences
    Route::post('column-preferences', [ColumnPreferenceController::class, 'store'])->name('column-preferences.store');
});

require __DIR__.'/settings.php';
require __DIR__.'/notifications.php';
require __DIR__.'/media.php';
