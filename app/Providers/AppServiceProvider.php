<?php

namespace App\Providers;

use App\Listeners\ApplyNotificationPreferences;
use App\Listeners\RecordFailedLogin;
use App\Listeners\RecordLogout;
use App\Listeners\RecordSuccessfulLogin;
use App\Models\Branch;
use App\Models\MediaAsset;
use App\Models\Organization;
use App\Models\UserInvitation;
use App\Policies\BranchPolicy;
use App\Policies\InvitationPolicy;
use App\Policies\MediaAssetPolicy;
use App\Policies\OrganizationPolicy;
use App\Policies\RolePolicy;
use App\Services\OrganizationContext;
use Carbon\CarbonImmutable;
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
use Illuminate\Auth\Events\Failed;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Spatie\Permission\Models\Role;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(OrganizationContext::class, fn (): OrganizationContext => new OrganizationContext);
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
        Gate::policy(UserInvitation::class, InvitationPolicy::class);
        Gate::policy(MediaAsset::class, MediaAssetPolicy::class);
        Gate::policy(Role::class, RolePolicy::class);

        Gate::define('viewApiDocs', function ($user): bool {
            return $user->hasRole('admin');
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
