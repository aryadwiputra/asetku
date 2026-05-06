<?php

namespace App\Http\Controllers;

use App\Models\AssetMaintenance;
use App\Models\AssetMaintenanceCostLine;
use App\Services\WorkOrderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class WorkOrderCostLineController extends Controller
{
    public function store(Request $request, AssetMaintenance $workOrder, WorkOrderService $workOrders): RedirectResponse
    {
        $this->authorize('update', $workOrder);

        $organizationId = (int) $workOrder->organization_id;

        $data = $request->validate([
            'kind' => ['required', 'string', Rule::in(['parts', 'labor'])],
            'description' => ['required', 'string', 'max:255'],
            'quantity' => ['nullable', 'numeric', 'min:0'],
            'unit_cost' => ['nullable', 'numeric', 'min:0'],
            'vendor_id' => ['nullable', 'integer', Rule::exists('vendors', 'id')->where('organization_id', $organizationId)],
        ]);

        $quantity = (float) ($data['quantity'] ?? 1);
        $unitCost = (float) ($data['unit_cost'] ?? 0);
        $total = $quantity * $unitCost;

        AssetMaintenanceCostLine::query()->create([
            'organization_id' => $workOrder->organization_id,
            'maintenance_id' => $workOrder->id,
            'kind' => $data['kind'],
            'description' => $data['description'],
            'quantity' => $quantity,
            'unit_cost' => $unitCost,
            'total_cost' => $total,
            'vendor_id' => $data['vendor_id'] ?? null,
        ]);

        $workOrders->recalculateCosts($workOrder);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('work_orders.toast.cost_added')]);

        return back();
    }

    public function update(Request $request, AssetMaintenance $workOrder, AssetMaintenanceCostLine $costLine, WorkOrderService $workOrders): RedirectResponse
    {
        $this->authorize('update', $workOrder);

        abort_unless($costLine->maintenance_id === $workOrder->id, 404);

        $organizationId = (int) $workOrder->organization_id;

        $data = $request->validate([
            'kind' => ['required', 'string', Rule::in(['parts', 'labor'])],
            'description' => ['required', 'string', 'max:255'],
            'quantity' => ['nullable', 'numeric', 'min:0'],
            'unit_cost' => ['nullable', 'numeric', 'min:0'],
            'vendor_id' => ['nullable', 'integer', Rule::exists('vendors', 'id')->where('organization_id', $organizationId)],
        ]);

        $quantity = (float) ($data['quantity'] ?? 1);
        $unitCost = (float) ($data['unit_cost'] ?? 0);
        $total = $quantity * $unitCost;

        $costLine->fill([
            'kind' => $data['kind'],
            'description' => $data['description'],
            'quantity' => $quantity,
            'unit_cost' => $unitCost,
            'total_cost' => $total,
            'vendor_id' => $data['vendor_id'] ?? null,
        ])->save();

        $workOrders->recalculateCosts($workOrder);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('work_orders.toast.updated')]);

        return back();
    }

    public function destroy(AssetMaintenance $workOrder, AssetMaintenanceCostLine $costLine, WorkOrderService $workOrders): RedirectResponse
    {
        $this->authorize('update', $workOrder);

        abort_unless($costLine->maintenance_id === $workOrder->id, 404);

        $costLine->delete();
        $workOrders->recalculateCosts($workOrder);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('work_orders.toast.deleted')]);

        return back();
    }
}
