<?php

namespace App\Http\Controllers;

use App\Http\Requests\DataTableRequest;
use App\Http\Requests\StoreTechnicianProfileRequest;
use App\Http\Requests\UpdateTechnicianProfileRequest;
use App\Models\Branch;
use App\Models\TechnicianProfile;
use App\Models\User;
use App\Services\OrganizationContext;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TechnicianController extends Controller
{
    public function index(DataTableRequest $request): Response
    {
        $this->authorize('viewAny', TechnicianProfile::class);

        $search = $request->searchQuery();

        $query = TechnicianProfile::query()
            ->with(['user:id,name,email', 'branch:id,name,code'])
            ->orderByDesc('is_active')
            ->orderBy('id');

        $search = is_string($search) ? trim($search) : '';
        if ($search !== '') {
            $query->whereHas('user', fn (Builder $q) => $q->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%"));
        }

        $items = $query
            ->paginate($request->perPage(10))
            ->withQueryString();

        return Inertia::render('technicians/index', [
            'items' => $items,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', TechnicianProfile::class);

        $organizationId = app(OrganizationContext::class)->requireOrganizationId();

        $users = User::query()
            ->whereHas('organizations', fn (Builder $q) => $q->whereKey($organizationId)->where('organization_user.is_active', true))
            ->whereDoesntHave('technicianProfile', fn (Builder $q) => $q->where('organization_id', $organizationId))
            ->orderBy('name')
            ->get(['id', 'name', 'email']);

        return Inertia::render('technicians/create', [
            'meta' => [
                'users' => $users,
                'branches' => Branch::query()->orderBy('name')->get(['id', 'name', 'code']),
            ],
        ]);
    }

    public function store(StoreTechnicianProfileRequest $request): RedirectResponse
    {
        $this->authorize('create', TechnicianProfile::class);

        $organizationId = app(OrganizationContext::class)->requireOrganizationId();
        $data = $request->validated();

        $userId = (int) $data['user_id'];

        $isMember = User::query()
            ->whereKey($userId)
            ->whereHas('organizations', fn (Builder $q) => $q->whereKey($organizationId)->where('organization_user.is_active', true))
            ->exists();

        abort_unless($isMember, 422, __('technicians.validation.user_not_in_org'));

        $profile = TechnicianProfile::query()->updateOrCreate(
            [
                'organization_id' => $organizationId,
                'user_id' => $userId,
            ],
            [
                'branch_id' => $data['branch_id'] ?? null,
                'is_active' => (bool) ($data['is_active'] ?? true),
                'is_available' => (bool) ($data['is_available'] ?? true),
                'skills' => array_values(array_filter($data['skills'] ?? [])),
            ],
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => __('technicians.toast.created')]);

        return to_route('technicians.edit', $profile);
    }

    public function edit(TechnicianProfile $technician): Response
    {
        $this->authorize('update', $technician);

        $technician->load(['user:id,name,email', 'branch:id,name,code']);

        return Inertia::render('technicians/edit', [
            'technician' => $technician,
            'meta' => [
                'branches' => Branch::query()->orderBy('name')->get(['id', 'name', 'code']),
            ],
        ]);
    }

    public function update(UpdateTechnicianProfileRequest $request, TechnicianProfile $technician): RedirectResponse
    {
        $this->authorize('update', $technician);

        $data = $request->validated();

        $technician->fill([
            'branch_id' => $data['branch_id'] ?? null,
            'is_active' => (bool) ($data['is_active'] ?? true),
            'is_available' => (bool) ($data['is_available'] ?? true),
            'skills' => array_values(array_filter($data['skills'] ?? [])),
        ])->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('technicians.toast.updated')]);

        return back();
    }

    public function destroy(TechnicianProfile $technician): RedirectResponse
    {
        $this->authorize('delete', $technician);

        $technician->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('technicians.toast.deleted')]);

        return to_route('technicians.index');
    }
}
