<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateOrganizationRequest;
use App\Models\Organization;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class OrganizationManagementController extends Controller
{
    public function edit(Organization $organization): Response
    {
        $this->authorize('update', $organization);

        return Inertia::render('organizations/edit', [
            'organization' => $organization->only([
                'id',
                'name',
                'slug',
                'address',
                'npwp',
                'industry',
                'currency_code',
                'timezone',
                'access_ip_allowlist',
                'access_working_hours',
                'access_timezone',
                'asset_code_prefix',
                'asset_code_format',
                'maintenance_warning_percent',
                'fiscal_year_start_month',
                'fiscal_year_start_day',
                'is_active',
            ]),
        ]);
    }

    public function update(UpdateOrganizationRequest $request, Organization $organization): RedirectResponse
    {
        $this->authorize('update', $organization);

        $organization->forceFill($request->validated())->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Organization updated.']);

        return to_route('organizations.edit', $organization);
    }

    public function deactivate(Organization $organization): RedirectResponse
    {
        $this->authorize('deactivate', $organization);

        $organization->forceFill([
            'is_active' => false,
            'deactivated_at' => now(),
        ])->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Organization deactivated.']);

        return to_route('organizations.index');
    }
}
