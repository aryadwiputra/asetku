<?php

namespace App\Http\Controllers;

use App\Http\Requests\DataTableRequest;
use App\Http\Requests\StoreWorkOrderRequest;
use App\Http\Requests\UpdateWorkOrderRequest;
use App\Models\Asset;
use App\Models\AssetMaintenance;
use App\Models\Branch;
use App\Models\MaintenanceChecklistTemplate;
use App\Models\TechnicianProfile;
use App\Models\User;
use App\Notifications\WorkOrderAssignedNotification;
use App\Queries\AssetListQuery;
use App\Services\WorkOrderService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WorkOrderController extends Controller
{
    public function index(DataTableRequest $request): Response
    {
        $this->authorize('viewAny', AssetMaintenance::class);

        $search = $request->searchQuery();
        $filters = $request->filters();

        $query = AssetMaintenance::query()
            ->with([
                'asset:id,code,name,branch_id,asset_category_id,asset_status_id,asset_condition_id,person_in_charge_id,asset_user_id',
                'asset.branch:id,name,code',
                'asset.category:id,name,code,parent_id',
                'asset.status:id,name,code',
                'asset.condition:id,name,code',
                'technician:id,name,email',
                'branch:id,name,code',
            ])
            ->when($filters['status'] ?? null, fn (Builder $q, string $status) => $q->where('status', $status))
            ->when($filters['type'] ?? null, fn (Builder $q, string $type) => $q->where('type', $type))
            ->when($filters['priority'] ?? null, fn (Builder $q, string $priority) => $q->where('priority', $priority))
            ->when($filters['branch_id'] ?? null, fn (Builder $q, string $branchId) => ctype_digit($branchId) ? $q->where('branch_id', (int) $branchId) : $q)
            ->when($filters['assigned_to'] ?? null, fn (Builder $q, string $userId) => ctype_digit($userId) ? $q->where('assigned_to', (int) $userId) : $q)
            ->when($filters['overdue'] ?? null, function (Builder $q, string $overdue): void {
                if ($overdue !== '1') {
                    return;
                }

                $now = now();

                $q->where(function (Builder $inner) use ($now): void {
                    $inner
                        ->where(function (Builder $response) use ($now): void {
                            $response
                                ->whereNull('acknowledged_at')
                                ->whereNotNull('response_due_at')
                                ->where('response_due_at', '<', $now);
                        })
                        ->orWhere(function (Builder $resolution) use ($now): void {
                            $resolution
                                ->whereNull('completed_at')
                                ->whereNotNull('resolution_due_at')
                                ->where('resolution_due_at', '<', $now);
                        });
                });
            });

        $search = is_string($search) ? trim($search) : '';
        if ($search !== '') {
            $query->where(function (Builder $q) use ($search): void {
                $q->where('description', 'like', "%{$search}%")
                    ->orWhereHas('asset', function (Builder $assetQ) use ($search): void {
                        $assetQ->where('code', 'like', "%{$search}%")
                            ->orWhere('name', 'like', "%{$search}%");
                    });
            });
        }

        $items = $query
            ->orderByDesc('created_at')
            ->paginate($request->perPage(10))
            ->withQueryString();

        return Inertia::render('work-orders/index', [
            'items' => $items,
            'filtersMeta' => [
                'branches' => Branch::query()->orderBy('name')->get(['id', 'name', 'code']),
                'statuses' => ['open', 'acknowledged', 'in_progress', 'completed', 'cancelled'],
                'types' => ['preventive', 'corrective'],
                'priorities' => ['low', 'normal', 'high', 'critical'],
                'technicians' => TechnicianProfile::query()
                    ->where('is_active', true)
                    ->with('user:id,name')
                    ->orderBy('id')
                    ->get()
                    ->map(fn (TechnicianProfile $profile) => [
                        'user_id' => $profile->user_id,
                        'name' => $profile->user?->name,
                        'branch_id' => $profile->branch_id,
                        'is_available' => $profile->is_available,
                        'skills' => $profile->skills ?? [],
                    ]),
            ],
        ]);
    }

    public function my(DataTableRequest $request): Response
    {
        $user = $request->user();
        if ($user === null) {
            abort(401);
        }

        $this->authorize('viewAny', AssetMaintenance::class);

        $items = AssetMaintenance::query()
            ->where('assigned_to', $user->id)
            ->with([
                'asset:id,code,name,branch_id,asset_status_id,asset_condition_id',
                'asset.branch:id,name,code',
                'asset.status:id,name,code',
                'asset.condition:id,name,code',
                'technician:id,name,email',
            ])
            ->orderBy('resolution_due_at')
            ->paginate($request->perPage(10))
            ->withQueryString();

        return Inertia::render('work-orders/my', [
            'items' => $items,
        ]);
    }

    public function create(DataTableRequest $request): Response
    {
        $this->authorize('create', AssetMaintenance::class);

        $search = $request->searchQuery();
        $assetId = $request->query('asset_id');

        $results = AssetListQuery::buildBase($request->user(), $search, [])
            ->whereNull('archived_at')
            ->orderByDesc('updated_at')
            ->limit(20)
            ->get(['id', 'code', 'name', 'branch_id', 'asset_status_id', 'asset_condition_id', 'updated_at']);

        $results->load(['branch:id,name,code', 'status:id,name,code', 'condition:id,name,code']);

        return Inertia::render('work-orders/create', [
            'search' => $search,
            'results' => $results,
            'selectedAsset' => is_numeric($assetId)
                ? Asset::query()
                    ->forUser($request->user())
                    ->whereNull('archived_at')
                    ->with(['branch:id,name,code', 'status:id,name,code', 'condition:id,name,code', 'category:id,name,code,parent_id'])
                    ->find((int) $assetId, ['id', 'code', 'name', 'branch_id', 'asset_status_id', 'asset_condition_id', 'asset_category_id', 'updated_at'])
                : null,
            'meta' => [
                'priorities' => ['low', 'normal', 'high', 'critical'],
                'types' => ['preventive', 'corrective'],
                'sources' => ['manual', 'damage_report'],
                'checklistTemplates' => MaintenanceChecklistTemplate::query()
                    ->where('is_active', true)
                    ->orderBy('name')
                    ->get(['id', 'name', 'asset_category_id', 'required_skill']),
            ],
        ]);
    }

    public function store(StoreWorkOrderRequest $request, WorkOrderService $workOrders): RedirectResponse
    {
        $this->authorize('create', AssetMaintenance::class);

        $user = $request->user();
        if ($user === null) {
            abort(401);
        }

        $data = $request->validated();

        /** @var Asset $asset */
        $asset = Asset::query()->forUser($user)->findOrFail((int) $data['asset_id']);
        $this->authorize('update', $asset);

        $workOrder = ($data['source'] ?? 'manual') === 'damage_report'
            ? $workOrders->createFromDamageReport($asset, $data, $user)
            : $workOrders->createFromManual($asset, $data, $user);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('work_orders.toast.created')]);

        return to_route('work-orders.show', $workOrder);
    }

    public function byToken(Request $request, string $token): RedirectResponse
    {
        $this->authorize('create', AssetMaintenance::class);

        $asset = Asset::query()
            ->forUser($request->user())
            ->where('qr_token', $token)
            ->firstOrFail(['id']);

        return to_route('work-orders.create', ['asset_id' => $asset->id]);
    }

    public function show(DataTableRequest $request, AssetMaintenance $workOrder): Response
    {
        $this->authorize('view', $workOrder);

        $workOrder->load([
            'asset.branch:id,name,code',
            'asset.category:id,name,code,parent_id',
            'asset.status:id,name,code',
            'asset.condition:id,name,code',
            'asset.personInCharge:id,name,email',
            'asset.user:id,name,email',
            'technician:id,name,email',
            'tasks.completedByUser:id,name',
            'costLines.vendor:id,name',
            'media.mediaAsset',
            'schedule:id,name,required_skill',
            'checklistTemplate:id,name,required_skill',
        ]);

        $user = $request->user();

        return Inertia::render('work-orders/show', [
            'workOrder' => $workOrder,
            'abilities' => [
                'update' => $user ? $user->can('update', $workOrder) : false,
                'updateProgress' => $user ? $user->can('updateProgress', $workOrder) : false,
            ],
            'meta' => [
                'statuses' => ['open', 'acknowledged', 'in_progress', 'completed', 'cancelled'],
                'priorities' => ['low', 'normal', 'high', 'critical'],
                'technicians' => TechnicianProfile::query()
                    ->where('is_active', true)
                    ->with('user:id,name')
                    ->orderBy('id')
                    ->get()
                    ->map(fn (TechnicianProfile $profile) => [
                        'user_id' => $profile->user_id,
                        'name' => $profile->user?->name,
                        'branch_id' => $profile->branch_id,
                        'is_available' => $profile->is_available,
                        'skills' => $profile->skills ?? [],
                    ]),
            ],
        ]);
    }

    public function update(UpdateWorkOrderRequest $request, AssetMaintenance $workOrder, WorkOrderService $workOrders): RedirectResponse
    {
        $this->authorize('updateProgress', $workOrder);

        $user = $request->user();
        if ($user === null) {
            abort(401);
        }

        $data = $request->validated();

        if (array_key_exists('assigned_to', $data)) {
            $this->authorize('update', $workOrder);

            $technician = User::query()->findOrFail((int) $data['assigned_to']);
            $workOrders->assignTechnician($workOrder, $technician, $user);
            $technician->notify(new WorkOrderAssignedNotification($workOrder));
        }

        if (array_key_exists('status', $data) || array_key_exists('progress_percent', $data) || array_key_exists('internal_notes', $data)) {
            $workOrders->updateProgress($workOrder, $user, $data);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('work_orders.toast.updated')]);

        return back();
    }
}
