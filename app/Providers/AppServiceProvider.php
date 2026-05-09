<?php

namespace App\Providers;

use App\Contracts\SmsSender;
use App\Enums\OrganizationMemberRole;
use App\Listeners\ApplyNotificationPreferences;
use App\Listeners\RecordFailedLogin;
use App\Listeners\RecordLogout;
use App\Listeners\RecordSuccessfulLogin;
use App\Models\Asset;
use App\Models\AssetCategory;
use App\Models\AssetClass;
use App\Models\AssetCondition;
use App\Models\AssetDepreciationRun;
use App\Models\AssetDisposal;
use App\Models\AssetLocation;
use App\Models\AssetMaintenance;
use App\Models\AssetStatus;
use App\Models\AssetUser;
use App\Models\AssetWarrantyClaim;
use App\Models\AuditFinding;
use App\Models\AuditSchedule;
use App\Models\Branch;
use App\Models\Department;
use App\Models\MaintenanceChecklistTemplate;
use App\Models\MaintenanceSchedule;
use App\Models\MediaAsset;
use App\Models\Organization;
use App\Models\PersonInCharge;
use App\Models\SavedFilter;
use App\Models\TechnicianProfile;
use App\Models\Unit;
use App\Models\User;
use App\Models\UserDelegation;
use App\Models\UserInvitation;
use App\Models\Vendor;
use App\Models\VendorContract;
use App\Models\Warranty;
use App\Policies\AssetCategoryPolicy;
use App\Policies\AssetClassPolicy;
use App\Policies\AssetConditionPolicy;
use App\Policies\AssetDepreciationPolicy;
use App\Policies\AssetDisposalPolicy;
use App\Policies\AssetLocationPolicy;
use App\Policies\AssetPolicy;
use App\Policies\AssetStatusPolicy;
use App\Policies\AssetUserPolicy;
use App\Policies\AssetWarrantyClaimPolicy;
use App\Policies\AuditFindingPolicy;
use App\Policies\AuditSchedulePolicy;
use App\Policies\BranchPolicy;
use App\Policies\DepartmentPolicy;
use App\Policies\InvitationPolicy;
use App\Policies\MaintenanceChecklistTemplatePolicy;
use App\Policies\MaintenanceSchedulePolicy;
use App\Policies\MediaAssetPolicy;
use App\Policies\OrganizationPolicy;
use App\Policies\PersonInChargePolicy;
use App\Policies\RolePolicy;
use App\Policies\SavedFilterPolicy;
use App\Policies\TechnicianProfilePolicy;
use App\Policies\UnitPolicy;
use App\Policies\UserDelegationPolicy;
use App\Policies\VendorContractPolicy;
use App\Policies\VendorPolicy;
use App\Policies\WarrantyPolicy;
use App\Policies\WorkOrderPolicy;
use App\Services\OrganizationContext;
use App\Services\Sms\LogSmsSender;
use Carbon\CarbonImmutable;
use Illuminate\Auth\Events\Failed;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Notifications\Events\NotificationSending;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use SocialiteProviders\Manager\SocialiteWasCalled;
use SocialiteProviders\Microsoft\MicrosoftExtendSocialite;
use Spatie\Activitylog\Facades\CauserResolver as ActivityCauserResolver;
use Spatie\Activitylog\Models\Activity;
use Spatie\Permission\Models\Role;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(OrganizationContext::class, fn (): OrganizationContext => new OrganizationContext);

        $this->app->singleton(SmsSender::class, function () {
            $driver = (string) config('sms.driver', 'log');

            return match ($driver) {
                'log' => new LogSmsSender,
                default => new LogSmsSender,
            };
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configureAuthorization();
        $this->configureNotifications();
        $this->configureAuthEvents();
        $this->configureActivityLogging();
        $this->configureSocialite();
        $this->configureRateLimiting();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Model::preventLazyLoading(! app()->isProduction());

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }

    /**
     * Configure authorization gates.
     */
    protected function configureAuthorization(): void
    {
        Gate::policy(Organization::class, OrganizationPolicy::class);
        Gate::policy(Branch::class, BranchPolicy::class);
        Gate::policy(Asset::class, AssetPolicy::class);
        Gate::policy(AssetDepreciationRun::class, AssetDepreciationPolicy::class);
        Gate::policy(AssetDisposal::class, AssetDisposalPolicy::class);
        Gate::policy(AssetStatus::class, AssetStatusPolicy::class);
        Gate::policy(AssetCondition::class, AssetConditionPolicy::class);
        Gate::policy(AssetClass::class, AssetClassPolicy::class);
        Gate::policy(Unit::class, UnitPolicy::class);
        Gate::policy(Department::class, DepartmentPolicy::class);
        Gate::policy(PersonInCharge::class, PersonInChargePolicy::class);
        Gate::policy(AssetUser::class, AssetUserPolicy::class);
        Gate::policy(AssetCategory::class, AssetCategoryPolicy::class);
        Gate::policy(AssetLocation::class, AssetLocationPolicy::class);
        Gate::policy(Vendor::class, VendorPolicy::class);
        Gate::policy(Warranty::class, WarrantyPolicy::class);
        Gate::policy(VendorContract::class, VendorContractPolicy::class);
        Gate::policy(AssetWarrantyClaim::class, AssetWarrantyClaimPolicy::class);
        Gate::policy(UserInvitation::class, InvitationPolicy::class);
        Gate::policy(UserDelegation::class, UserDelegationPolicy::class);
        Gate::policy(MediaAsset::class, MediaAssetPolicy::class);
        Gate::policy(SavedFilter::class, SavedFilterPolicy::class);
        Gate::policy(Role::class, RolePolicy::class);
        Gate::policy(AssetMaintenance::class, WorkOrderPolicy::class);
        Gate::policy(MaintenanceSchedule::class, MaintenanceSchedulePolicy::class);
        Gate::policy(MaintenanceChecklistTemplate::class, MaintenanceChecklistTemplatePolicy::class);
        Gate::policy(TechnicianProfile::class, TechnicianProfilePolicy::class);
        Gate::policy(AuditSchedule::class, AuditSchedulePolicy::class);
        Gate::policy(AuditFinding::class, AuditFindingPolicy::class);

        Gate::define('viewApiDocs', function ($user): bool {
            return $user->hasRole('admin');
        });

        Gate::define('viewInventoryReport', function (User $user): bool {
            if ($user->can('report_inventory.view')) {
                return true;
            }

            $organizationId = $user->current_organization_id;

            if ($organizationId === null) {
                return false;
            }

            return $user->hasOrganizationRole((int) $organizationId, [
                OrganizationMemberRole::Owner,
                OrganizationMemberRole::Admin,
                OrganizationMemberRole::Manager,
                OrganizationMemberRole::Member,
            ]);
        });

        Gate::define('exportInventoryReport', function (User $user): bool {
            if ($user->can('report_inventory.export') || $user->can('asset.export')) {
                return true;
            }

            $organizationId = $user->current_organization_id;

            if ($organizationId === null) {
                return false;
            }

            return $user->hasOrganizationRole((int) $organizationId, [
                OrganizationMemberRole::Owner,
                OrganizationMemberRole::Admin,
                OrganizationMemberRole::Manager,
            ]);
        });

        Gate::before(function ($user, $ability) {
            return $user->hasRole('super-admin') ? true : null;
        });
    }

    protected function configureNotifications(): void
    {
        Event::listen(NotificationSending::class, ApplyNotificationPreferences::class);
    }

    protected function configureAuthEvents(): void
    {
        Event::listen(Login::class, RecordSuccessfulLogin::class);
        Event::listen(Failed::class, RecordFailedLogin::class);
        Event::listen(Logout::class, RecordLogout::class);
    }

    protected function configureActivityLogging(): void
    {
        ActivityCauserResolver::resolveUsing(function () {
            $request = request();

            if (! $request?->hasSession()) {
                return auth()->user();
            }

            $originalId = $request->session()->get('acting.original_id')
                ?? $request->session()->get('impersonate.original_id');

            if (! is_numeric($originalId)) {
                return auth()->user();
            }

            return User::query()->find((int) $originalId);
        });

        Activity::creating(function (Activity $activity): void {
            $request = request();

            if (! $request?->hasSession()) {
                return;
            }

            $mode = $request->session()->get('acting.mode');
            $asId = $request->session()->get('acting.as_id');

            if ($asId === null) {
                $mode = $request->session()->get('impersonate.mode');
                $asId = $request->session()->get('impersonate.as_id');
            }

            if (! is_numeric($asId)) {
                return;
            }

            $properties = $activity->properties?->toArray() ?? [];
            $properties['acting_as'] = [
                'mode' => is_string($mode) ? $mode : null,
                'user_id' => (int) $asId,
            ];

            $activity->properties = $properties;
        });
    }

    protected function configureSocialite(): void
    {
        Event::listen(SocialiteWasCalled::class, MicrosoftExtendSocialite::class.'@handle');
    }

    protected function configureRateLimiting(): void
    {
        RateLimiter::for('api', function (Request $request) {
            $isAuthenticated = $request->user() !== null;

            $maxAttempts = $isAuthenticated
                ? (int) config('api.rate_limits.api.user_per_minute', 120)
                : (int) config('api.rate_limits.api.guest_per_minute', 60);

            $key = $request->user()?->getAuthIdentifier() ?? $request->ip();

            return Limit::perMinute($maxAttempts)->by($key);
        });

        RateLimiter::for('api-auth', function (Request $request) {
            $isAuthenticated = $request->user() !== null;

            $maxAttempts = $isAuthenticated
                ? (int) config('api.rate_limits.auth.user_per_minute', 20)
                : (int) config('api.rate_limits.auth.guest_per_minute', 10);

            $key = $request->user()?->getAuthIdentifier() ?? $request->ip();

            return Limit::perMinute($maxAttempts)->by($key);
        });
    }
}
