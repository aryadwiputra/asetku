<?php

namespace App\Http\Controllers;

use App\Http\Requests\Audit\StoreAuditScheduleRequest;
use App\Http\Requests\Audit\UpdateAuditScheduleRequest;
use App\Http\Requests\DataTableRequest;
use App\Models\Asset;
use App\Models\AssetCondition;
use App\Models\AssetLocation;
use App\Models\AuditFinding;
use App\Models\AuditSchedule;
use App\Models\Branch;
use App\Models\User;
use App\Queries\AssetListQuery;
use App\Services\OrganizationContext;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AuditScheduleController extends Controller
{
    public function index(DataTableRequest $request): Response
    {
        $this->authorize('viewAny', AuditSchedule::class);

        $search = $request->searchQuery();
        $statusFilter = $request->query('status');

        $query = AuditSchedule::query()
            ->forUser($request->user())
            ->with(['createdBy:id,name', 'auditors:id,name'])
            ->when($statusFilter, function (Builder $q, string $status): void {
                $q->where('status', $status);
            });

        $search = is_string($search) ? trim($search) : '';
        if ($search !== '') {
            $query->where(function (Builder $q) use ($search): void {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $items = $query
            ->orderByDesc('created_at')
            ->paginate($request->perPage(10))
            ->withQueryString();

        $items->getCollection()->transform(function (AuditSchedule $schedule) {
            $totalAssets = $schedule->assets()->count();
            $completedAssets = $schedule->assets()->wherePivot('status', 'completed')->count();

            return [
                'id' => $schedule->id,
                'name' => $schedule->name,
                'description' => $schedule->description,
                'start_date' => $schedule->start_date?->toDateString(),
                'end_date' => $schedule->end_date?->toDateString(),
                'status' => $schedule->status,
                'created_by' => $schedule->createdBy ? ['id' => $schedule->createdBy->id, 'name' => $schedule->createdBy->name] : null,
                'auditors' => $schedule->auditors->map(fn (User $u) => ['id' => $u->id, 'name' => $u->name]),
                'total_assets' => $totalAssets,
                'completed_assets' => $completedAssets,
                'created_at' => $schedule->created_at,
            ];
        });

        return Inertia::render('audit/schedules/index', [
            'items' => $items,
            'filtersMeta' => [
                'statusOptions' => [
                    ['value' => 'draft', 'label' => __('audit.status.draft')],
                    ['value' => 'in_progress', 'label' => __('audit.status.in_progress')],
                    ['value' => 'completed', 'label' => __('audit.status.completed')],
                    ['value' => 'cancelled', 'label' => __('audit.status.cancelled')],
                ],
            ],
        ]);
    }

    public function create(DataTableRequest $request): Response
    {
        $this->authorize('create', AuditSchedule::class);

        $organizationId = app(OrganizationContext::class)->requireOrganizationId();
        $search = $request->searchQuery();

        $results = AssetListQuery::buildBase($request->user(), $search, [])
            ->whereNull('archived_at')
            ->orderByDesc('updated_at')
            ->limit(20)
            ->get(['id', 'code', 'name', 'branch_id', 'updated_at']);

        $results->load(['branch:id,name,code']);

        return Inertia::render('audit/schedules/create', [
            'search' => $search,
            'results' => $results->map(fn (Asset $a) => [
                'id' => $a->id,
                'code' => $a->code,
                'name' => $a->name,
                'branch' => $a->branch ? ['id' => $a->branch->id, 'name' => $a->branch->name] : null,
            ]),
            'meta' => [
                'users' => User::query()
                    ->where('current_organization_id', $organizationId)
                    ->where('is_active', true)
                    ->orderBy('name')
                    ->get(['id', 'name']),
                'branches' => Branch::query()
                    ->where('organization_id', $organizationId)
                    ->where('is_active', true)
                    ->orderBy('name')
                    ->get(['id', 'name', 'code']),
            ],
        ]);
    }

    public function store(StoreAuditScheduleRequest $request): RedirectResponse
    {
        $this->authorize('create', AuditSchedule::class);

        $data = $request->validated();
        $organizationId = app(OrganizationContext::class)->requireOrganizationId();

        $schedule = DB::transaction(function () use ($data, $organizationId, $request) {
            $schedule = AuditSchedule::query()->create([
                'organization_id' => $organizationId,
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'start_date' => $data['start_date'],
                'end_date' => $data['end_date'],
                'status' => 'draft',
                'created_by' => $request->user()->id,
                'notes' => $data['notes'] ?? null,
            ]);

            $schedule->auditors()->attach($data['auditor_ids']);

            foreach ($data['asset_ids'] as $assetId) {
                $schedule->assets()->attach($assetId, ['status' => 'pending']);
            }

            return $schedule;
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('audit.toast.schedule_created')]);

        return to_route('audit.schedules.show', $schedule);
    }

    public function show(AuditSchedule $auditSchedule): Response
    {
        $this->authorize('view', $auditSchedule);

        $auditSchedule->load([
            'createdBy:id,name',
            'auditors:id,name',
            'assets:id,code,name,branch_id,department_id,asset_location_id',
            'assets.branch:id,name,code',
        ]);

        $findings = AuditFinding::query()
            ->where('audit_schedule_id', $auditSchedule->id)
            ->with(['asset:id,code,name', 'auditor:id,name', 'currentLocation:id,name', 'expectedLocation:id,name', 'currentCondition:id,name'])
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (AuditFinding $f) => [
                'id' => $f->id,
                'asset' => $f->asset ? ['id' => $f->asset->id, 'code' => $f->asset->code, 'name' => $f->asset->name] : null,
                'auditor' => $f->auditor ? ['id' => $f->auditor->id, 'name' => $f->auditor->name] : null,
                'status' => $f->status,
                'approval_status' => $f->approval_status,
                'current_location' => $f->currentLocation ? ['id' => $f->currentLocation->id, 'name' => $f->currentLocation->name] : null,
                'expected_location' => $f->expectedLocation ? ['id' => $f->expectedLocation->id, 'name' => $f->expectedLocation->name] : null,
                'current_condition' => $f->currentCondition ? ['id' => $f->currentCondition->id, 'name' => $f->currentCondition->name] : null,
                'notes' => $f->notes,
                'audited_at' => $f->audited_at?->toISOString(),
                'created_at' => $f->created_at,
            ]);

        $organizationId = app(OrganizationContext::class)->requireOrganizationId();

        return Inertia::render('audit/schedules/show', [
            'schedule' => [
                'id' => $auditSchedule->id,
                'name' => $auditSchedule->name,
                'description' => $auditSchedule->description,
                'start_date' => $auditSchedule->start_date?->toDateString(),
                'end_date' => $auditSchedule->end_date?->toDateString(),
                'status' => $auditSchedule->status,
                'notes' => $auditSchedule->notes,
                'created_by' => $auditSchedule->createdBy ? ['id' => $auditSchedule->createdBy->id, 'name' => $auditSchedule->createdBy->name] : null,
                'created_at' => $auditSchedule->created_at,
            ],
            'auditors' => $auditSchedule->auditors->map(fn (User $u) => ['id' => $u->id, 'name' => $u->name]),
            'assets' => $auditSchedule->assets->map(fn (Asset $a) => [
                'id' => $a->id,
                'code' => $a->code,
                'name' => $a->name,
                'branch' => $a->branch ? ['id' => $a->branch->id, 'name' => $a->branch->name] : null,
                'pivot' => ['status' => $a->pivot?->status],
            ]),
            'findings' => $findings,
            'meta' => [
                'canApprove' => $auditSchedule->status === 'in_progress',
                'locations' => AssetLocation::query()
                    ->where('organization_id', $organizationId)
                    ->orderBy('name')
                    ->get(['id', 'name', 'code']),
                'conditions' => AssetCondition::query()
                    ->where('organization_id', $organizationId)
                    ->orderBy('name')
                    ->get(['id', 'name', 'code']),
            ],
        ]);
    }

    public function edit(AuditSchedule $auditSchedule): Response
    {
        $this->authorize('update', $auditSchedule);

        $auditSchedule->load(['auditors:id,name', 'assets']);

        $organizationId = app(OrganizationContext::class)->requireOrganizationId();

        return Inertia::render('audit/schedules/edit', [
            'schedule' => [
                'id' => $auditSchedule->id,
                'name' => $auditSchedule->name,
                'description' => $auditSchedule->description,
                'start_date' => $auditSchedule->start_date?->toDateString(),
                'end_date' => $auditSchedule->end_date?->toDateString(),
                'status' => $auditSchedule->status,
                'notes' => $auditSchedule->notes,
                'selected_auditor_ids' => $auditSchedule->auditors->pluck('id')->toArray(),
                'selected_asset_ids' => $auditSchedule->assets->pluck('id')->toArray(),
            ],
            'meta' => [
                'users' => User::query()
                    ->where('current_organization_id', $organizationId)
                    ->where('is_active', true)
                    ->orderBy('name')
                    ->get(['id', 'name']),
                'branches' => Branch::query()
                    ->where('organization_id', $organizationId)
                    ->where('is_active', true)
                    ->orderBy('name')
                    ->get(['id', 'name', 'code']),
                'statusOptions' => [
                    ['value' => 'draft', 'label' => __('audit.status.draft')],
                    ['value' => 'in_progress', 'label' => __('audit.status.in_progress')],
                    ['value' => 'completed', 'label' => __('audit.status.completed')],
                    ['value' => 'cancelled', 'label' => __('audit.status.cancelled')],
                ],
            ],
        ]);
    }

    public function update(UpdateAuditScheduleRequest $request, AuditSchedule $auditSchedule): RedirectResponse
    {
        $this->authorize('update', $auditSchedule);

        $data = $request->validated();

        DB::transaction(function () use ($auditSchedule, $data): void {
            $updateData = [
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'notes' => $data['notes'] ?? null,
            ];

            if ($auditSchedule->status === 'draft') {
                $updateData['start_date'] = $data['start_date'];
                $updateData['end_date'] = $data['end_date'];
            }

            if (isset($data['status'])) {
                $updateData['status'] = $data['status'];
            }

            $auditSchedule->fill($updateData)->save();

            if ($auditSchedule->status === 'draft' && isset($data['auditor_ids'])) {
                $auditSchedule->auditors()->sync($data['auditor_ids']);
            }

            if ($auditSchedule->status === 'draft' && isset($data['asset_ids'])) {
                $syncData = [];
                foreach ($data['asset_ids'] as $assetId) {
                    $syncData[$assetId] = ['status' => 'pending'];
                }
                $auditSchedule->assets()->sync($syncData);
            }
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('audit.toast.schedule_updated')]);

        return back();
    }

    public function destroy(AuditSchedule $auditSchedule): RedirectResponse
    {
        $this->authorize('delete', $auditSchedule);

        $auditSchedule->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('audit.toast.schedule_deleted')]);

        return to_route('audit.schedules.index');
    }

    public function start(AuditSchedule $auditSchedule): RedirectResponse
    {
        $this->authorize('update', $auditSchedule);

        if ($auditSchedule->status !== 'draft') {
            abort(422, __('audit.validation.cannot_start'));
        }

        $auditSchedule->fill(['status' => 'in_progress'])->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('audit.toast.schedule_started')]);

        return back();
    }

    public function complete(AuditSchedule $auditSchedule): RedirectResponse
    {
        $this->authorize('update', $auditSchedule);

        if ($auditSchedule->status !== 'in_progress') {
            abort(422, __('audit.validation.cannot_complete'));
        }

        $auditSchedule->fill(['status' => 'completed'])->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('audit.toast.schedule_completed')]);

        return back();
    }
}
