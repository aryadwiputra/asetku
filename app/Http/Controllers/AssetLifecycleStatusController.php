<?php

namespace App\Http\Controllers;

use App\Http\Requests\Assets\StoreAssetLifecycleStatusRequest;
use App\Models\Asset;
use App\Services\AssetAuditLogger;
use Carbon\CarbonImmutable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AssetLifecycleStatusController extends Controller
{
    public function store(StoreAssetLifecycleStatusRequest $request, Asset $asset, AssetAuditLogger $audit): RedirectResponse
    {
        $this->authorize('update', $asset);

        $user = $request->user();
        if ($user === null) {
            abort(401);
        }

        $data = $request->validated();

        $performedAt = null;
        if (is_string($data['performed_at'] ?? null) && $data['performed_at'] !== '') {
            $performedAt = CarbonImmutable::parse($data['performed_at']);
        }

        $notes = isset($data['notes']) ? (string) $data['notes'] : null;
        $toStatusId = is_numeric($data['asset_status_id'] ?? null) ? (int) $data['asset_status_id'] : null;

        DB::transaction(function () use ($asset, $audit, $notes, $performedAt, $toStatusId, $user): void {
            $fromStatusId = is_numeric($asset->asset_status_id) ? (int) $asset->asset_status_id : null;

            if ($fromStatusId === $toStatusId) {
                return;
            }

            $asset->forceFill(['asset_status_id' => $toStatusId])->save();

            $audit->logStatusChanged(
                asset: $asset,
                actor: $user,
                fromStatusId: $fromStatusId,
                toStatusId: $toStatusId,
                performedAt: $performedAt,
                notes: $notes,
            );
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('assets.toast.updated')]);

        return back();
    }
}
