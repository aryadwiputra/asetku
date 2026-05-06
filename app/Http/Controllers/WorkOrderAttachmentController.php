<?php

namespace App\Http\Controllers;

use App\Models\AssetMaintenance;
use App\Models\AssetMaintenanceMedia;
use App\Models\MediaAsset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class WorkOrderAttachmentController extends Controller
{
    public function store(Request $request, AssetMaintenance $workOrder): RedirectResponse
    {
        $this->authorize('updateProgress', $workOrder);

        $organizationId = (int) $workOrder->organization_id;

        $data = $request->validate([
            'media_asset_id' => [
                'required',
                'integer',
                Rule::exists('media_assets', 'id')->where('organization_id', $organizationId),
            ],
            'kind' => ['required', 'string', Rule::in(['photo', 'document'])],
            'document_type' => ['nullable', 'string', 'max:100'],
        ]);

        $mediaAsset = MediaAsset::query()->findOrFail((int) $data['media_asset_id']);

        AssetMaintenanceMedia::query()->create([
            'organization_id' => $workOrder->organization_id,
            'maintenance_id' => $workOrder->id,
            'media_asset_id' => $mediaAsset->id,
            'kind' => $data['kind'],
            'document_type' => $data['kind'] === 'document' ? ($data['document_type'] ?? 'other') : null,
            'sort_order' => 0,
            'is_primary' => false,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('work_orders.toast.attachment_added')]);

        return back();
    }

    public function destroy(AssetMaintenance $workOrder, AssetMaintenanceMedia $attachment): RedirectResponse
    {
        $this->authorize('update', $workOrder);

        abort_unless($attachment->maintenance_id === $workOrder->id, 404);

        $attachment->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('work_orders.toast.deleted')]);

        return back();
    }
}
