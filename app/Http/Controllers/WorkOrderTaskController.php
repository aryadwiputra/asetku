<?php

namespace App\Http\Controllers;

use App\Models\AssetMaintenance;
use App\Models\AssetMaintenanceTask;
use App\Services\WorkOrderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkOrderTaskController extends Controller
{
    public function store(Request $request, AssetMaintenance $workOrder): RedirectResponse
    {
        $this->authorize('update', $workOrder);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'is_required' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:1000'],
        ]);

        AssetMaintenanceTask::query()->create([
            'organization_id' => $workOrder->organization_id,
            'maintenance_id' => $workOrder->id,
            'title' => $data['title'],
            'is_required' => (bool) ($data['is_required'] ?? true),
            'sort_order' => (int) ($data['sort_order'] ?? 0),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('work_orders.toast.task_added')]);

        return back();
    }

    public function update(Request $request, AssetMaintenance $workOrder, AssetMaintenanceTask $task, WorkOrderService $workOrders): RedirectResponse
    {
        $this->authorize('updateProgress', $workOrder);

        abort_unless($task->maintenance_id === $workOrder->id, 404);

        $user = $request->user();
        if ($user === null) {
            abort(401);
        }

        $data = $request->validate([
            'completed' => ['required', 'boolean'],
            'notes' => ['nullable', 'string'],
        ]);

        if ((bool) $data['completed']) {
            $task->completed_at = $task->completed_at ?? now();
            $task->completed_by = $user->id;
        } else {
            $task->completed_at = null;
            $task->completed_by = null;
        }

        $task->notes = $data['notes'] ?? null;
        $task->save();
        $workOrders->recalculateTaskProgress($workOrder);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('work_orders.toast.updated')]);

        return back();
    }
}
