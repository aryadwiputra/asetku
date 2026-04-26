<?php

namespace App\Http\Controllers;

use App\Http\Requests\DataTableRequest;
use App\Http\Requests\StoreMaintenanceScheduleRequest;
use App\Http\Requests\UpdateMaintenanceScheduleRequest;
use App\Models\Asset;
use App\Models\MaintenanceChecklistTemplate;
use App\Models\MaintenanceSchedule;
use App\Queries\AssetListQuery;
use App\Services\OrganizationContext;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MaintenanceScheduleController extends Controller
{
    public function index(DataTableRequest $request): Response
    {
        $this->authorize('viewAny', MaintenanceSchedule::class);

        $search = $request->searchQuery();
        $filters = $request->filters();

        $query = MaintenanceSchedule::query()
            ->with(['asset:id,code,name,branch_id', 'asset.branch:id,name,code', 'checklistTemplate:id,name'])
            ->when($filters['active'] ?? null, function (Builder $q, string $active): void {
                if (! in_array($active, ['0', '1'], true)) {
                    return;
                }

                $q->where('is_active', $active === '1');
            });

        $search = is_string($search) ? trim($search) : '';
        if ($search !== '') {
            $query->where(function (Builder $q) use ($search): void {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhereHas('asset', fn (Builder $assetQ) => $assetQ->where('code', 'like', "%{$search}%")->orWhere('name', 'like', "%{$search}%"));
            });
        }

        $items = $query
            ->orderBy('next_due_at')
            ->paginate($request->perPage(10))
            ->withQueryString();

        return Inertia::render('maintenance-schedules/index', [
            'items' => $items,
            'filtersMeta' => [
                'activeOptions' => [
                    ['value' => '1', 'label' => __('common.active')],
                    ['value' => '0', 'label' => __('common.inactive')],
                ],
            ],
        ]);
    }

    public function create(DataTableRequest $request): Response
    {
        $this->authorize('create', MaintenanceSchedule::class);

        $search = $request->searchQuery();
        $assetId = $request->query('asset_id');

        $results = AssetListQuery::buildBase($request->user(), $search, [])
            ->whereNull('archived_at')
            ->orderByDesc('updated_at')
            ->limit(20)
            ->get(['id', 'code', 'name', 'branch_id', 'updated_at']);

        $results->load(['branch:id,name,code']);

        return Inertia::render('maintenance-schedules/create', [
            'search' => $search,
            'results' => $results,
            'selectedAsset' => is_numeric($assetId)
                ? Asset::query()
                    ->forUser($request->user())
                    ->whereNull('archived_at')
                    ->with(['branch:id,name,code'])
                    ->find((int) $assetId, ['id', 'code', 'name', 'branch_id', 'updated_at'])
                : null,
            'meta' => [
                'priorities' => ['low', 'normal', 'high', 'critical'],
                'checklistTemplates' => MaintenanceChecklistTemplate::query()
                    ->where('is_active', true)
                    ->orderBy('name')
                    ->get(['id', 'name', 'asset_category_id', 'required_skill']),
            ],
        ]);
    }

    public function store(StoreMaintenanceScheduleRequest $request): RedirectResponse
    {
        $this->authorize('create', MaintenanceSchedule::class);

        $data = $request->validated();

        $schedule = MaintenanceSchedule::query()->create([
            'organization_id' => app(OrganizationContext::class)->requireOrganizationId(),
            'asset_id' => (int) $data['asset_id'],
            'name' => $data['name'],
            'interval_days' => (int) $data['interval_days'],
            'next_due_at' => $data['next_due_at'],
            'default_priority' => $data['default_priority'] ?? null,
            'default_sla_response_hours' => $data['default_sla_response_hours'] ?? null,
            'default_sla_resolution_hours' => $data['default_sla_resolution_hours'] ?? null,
            'checklist_template_id' => $data['checklist_template_id'] ?? null,
            'required_skill' => $data['required_skill'] ?? null,
            'is_active' => (bool) ($data['is_active'] ?? true),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('maintenance_schedules.toast.created')]);

        return to_route('maintenance-schedules.edit', $schedule);
    }

    public function edit(MaintenanceSchedule $schedule): Response
    {
        $this->authorize('update', $schedule);

        $schedule->load(['asset:id,code,name,branch_id', 'asset.branch:id,name,code', 'checklistTemplate:id,name']);

        return Inertia::render('maintenance-schedules/edit', [
            'schedule' => $schedule,
            'meta' => [
                'priorities' => ['low', 'normal', 'high', 'critical'],
                'checklistTemplates' => MaintenanceChecklistTemplate::query()
                    ->where('is_active', true)
                    ->orderBy('name')
                    ->get(['id', 'name', 'asset_category_id', 'required_skill']),
            ],
        ]);
    }

    public function update(UpdateMaintenanceScheduleRequest $request, MaintenanceSchedule $schedule): RedirectResponse
    {
        $this->authorize('update', $schedule);

        $data = $request->validated();

        $schedule->fill([
            'name' => $data['name'],
            'interval_days' => (int) $data['interval_days'],
            'next_due_at' => $data['next_due_at'],
            'default_priority' => $data['default_priority'] ?? null,
            'default_sla_response_hours' => $data['default_sla_response_hours'] ?? null,
            'default_sla_resolution_hours' => $data['default_sla_resolution_hours'] ?? null,
            'checklist_template_id' => $data['checklist_template_id'] ?? null,
            'required_skill' => $data['required_skill'] ?? null,
            'is_active' => (bool) ($data['is_active'] ?? true),
        ])->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('maintenance_schedules.toast.updated')]);

        return back();
    }

    public function destroy(MaintenanceSchedule $schedule): RedirectResponse
    {
        $this->authorize('delete', $schedule);

        $schedule->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('maintenance_schedules.toast.deleted')]);

        return to_route('maintenance-schedules.index');
    }
}
