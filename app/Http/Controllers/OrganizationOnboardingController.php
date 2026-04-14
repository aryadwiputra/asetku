<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrganizationImportRequest;
use App\Http\Requests\StoreOrganizationProfileRequest;
use App\Http\Requests\UpdateOrganizationAssetCodeRequest;
use App\Http\Requests\UpdateOrganizationLocaleRequest;
use App\Http\Requests\UpdateOrganizationPlanRequest;
use App\Jobs\ProcessImportRun;
use App\Models\ImportRun;
use App\Models\Organization;
use App\Models\OrganizationGroup;
use App\Services\OrganizationContext;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class OrganizationOnboardingController extends Controller
{
    public function profile(): Response
    {
        $this->authorize('create', Organization::class);

        return Inertia::render('organizations/onboarding/profile');
    }

    public function storeProfile(StoreOrganizationProfileRequest $request): RedirectResponse
    {
        $this->authorize('create', Organization::class);

        $user = $request->user();

        if ($user === null) {
            abort(401);
        }

        $groupId = $request->validated('organization_group_id');
        $groupName = $request->validated('organization_group_name');

        $group = null;

        if ($groupId !== null) {
            $group = OrganizationGroup::query()->whereKey($groupId)->first();
        }

        if ($group === null && is_string($groupName) && trim($groupName) !== '') {
            $name = trim($groupName);
            $slug = Str::slug($name);

            $group = OrganizationGroup::query()->firstOrCreate(
                ['slug' => $slug],
                ['name' => $name],
            );
        }

        $name = (string) $request->validated('name');
        $slug = $request->validated('slug');

        if (! is_string($slug) || trim($slug) === '') {
            $base = Str::slug($name);
            $slug = $base;

            for ($i = 0; $i < 50; $i++) {
                $exists = Organization::query()->where('slug', $slug)->exists();

                if (! $exists) {
                    break;
                }

                $slug = $base.'-'.Str::lower(Str::random(6));
            }
        }

        $organization = Organization::query()->create([
            'organization_group_id' => $group?->id,
            'name' => $name,
            'slug' => $slug,
            'address' => $request->validated('address'),
            'npwp' => $request->validated('npwp'),
            'industry' => $request->validated('industry'),
        ]);

        $user->organizations()->syncWithoutDetaching([
            $organization->id => [
                'role' => 'Owner',
                'is_active' => true,
            ],
        ]);

        $user->forceFill(['current_organization_id' => $organization->id])->save();

        app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Organization created.']);

        return to_route('organizations.onboarding.plan');
    }

    public function plan(): Response
    {
        $organizationId = app(OrganizationContext::class)->requireOrganizationId();
        $organization = Organization::query()->findOrFail($organizationId);

        $this->authorize('update', $organization);

        return Inertia::render('organizations/onboarding/plan', [
            'organization' => $organization,
        ]);
    }

    public function updatePlan(UpdateOrganizationPlanRequest $request): RedirectResponse
    {
        $organizationId = app(OrganizationContext::class)->requireOrganizationId();
        $organization = Organization::query()->findOrFail($organizationId);

        $this->authorize('update', $organization);

        $organization->forceFill([
            'plan' => $request->validated('plan'),
            'plan_started_at' => $organization->plan !== $request->validated('plan') ? now() : $organization->plan_started_at,
        ])->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Plan updated.']);

        return to_route('organizations.onboarding.locale');
    }

    public function locale(): Response
    {
        $organizationId = app(OrganizationContext::class)->requireOrganizationId();
        $organization = Organization::query()->findOrFail($organizationId);

        $this->authorize('update', $organization);

        return Inertia::render('organizations/onboarding/locale', [
            'organization' => $organization,
            'timezones' => \DateTimeZone::listIdentifiers(),
        ]);
    }

    public function updateLocale(UpdateOrganizationLocaleRequest $request): RedirectResponse
    {
        $organizationId = app(OrganizationContext::class)->requireOrganizationId();
        $organization = Organization::query()->findOrFail($organizationId);

        $this->authorize('update', $organization);

        $organization->forceFill([
            'currency_code' => $request->validated('currency_code'),
            'timezone' => $request->validated('timezone'),
        ])->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Locale updated.']);

        return to_route('organizations.onboarding.asset-code');
    }

    public function assetCode(): Response
    {
        $organizationId = app(OrganizationContext::class)->requireOrganizationId();
        $organization = Organization::query()->findOrFail($organizationId);

        $this->authorize('update', $organization);

        return Inertia::render('organizations/onboarding/asset-code', [
            'organization' => $organization,
        ]);
    }

    public function updateAssetCode(UpdateOrganizationAssetCodeRequest $request): RedirectResponse
    {
        $organizationId = app(OrganizationContext::class)->requireOrganizationId();
        $organization = Organization::query()->findOrFail($organizationId);

        $this->authorize('update', $organization);

        $organization->forceFill([
            'asset_code_prefix' => $request->validated('asset_code_prefix'),
            'asset_code_format' => $request->validated('asset_code_format'),
        ])->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Asset code settings updated.']);

        return to_route('organizations.onboarding.import');
    }

    public function import(): Response
    {
        $organizationId = app(OrganizationContext::class)->requireOrganizationId();
        $organization = Organization::query()->findOrFail($organizationId);

        $this->authorize('update', $organization);

        return Inertia::render('organizations/onboarding/import', [
            'importRuns' => ImportRun::query()->latest()->limit(10)->get(['id', 'type', 'status', 'created_at', 'report_path', 'error_message']),
        ]);
    }

    public function storeImport(StoreOrganizationImportRequest $request): RedirectResponse
    {
        $user = $request->user();

        if ($user === null) {
            abort(401);
        }

        $organizationId = app(OrganizationContext::class)->requireOrganizationId();
        $organization = Organization::query()->findOrFail($organizationId);

        $this->authorize('update', $organization);

        $type = (string) $request->validated('type');
        $file = $request->file('file');

        if ($file === null) {
            abort(422, 'File is required.');
        }

        $path = $file->store('imports', ['disk' => 'local']);

        $importRun = ImportRun::query()->create([
            'type' => $type,
            'status' => 'queued',
            'uploaded_by' => $user->id,
            'source_path' => $path,
            'meta' => [
                'original_name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
            ],
        ]);

        ProcessImportRun::dispatch($importRun->id);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Import queued.']);

        return back();
    }
}
