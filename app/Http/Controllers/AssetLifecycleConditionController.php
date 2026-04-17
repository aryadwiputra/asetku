<?php

namespace App\Http\Controllers;

use App\Http\Requests\Assets\StoreAssetLifecycleConditionRequest;
use App\Models\Asset;
use App\Services\AssetAuditLogger;
use Carbon\CarbonImmutable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AssetLifecycleConditionController extends Controller
{
    public function store(StoreAssetLifecycleConditionRequest $request, Asset $asset, AssetAuditLogger $audit): RedirectResponse
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
        $toConditionId = is_numeric($data['asset_condition_id'] ?? null) ? (int) $data['asset_condition_id'] : null;

        DB::transaction(function () use ($asset, $audit, $notes, $performedAt, $toConditionId, $user): void {
            $fromConditionId = is_numeric($asset->asset_condition_id) ? (int) $asset->asset_condition_id : null;

            $asset->forceFill(['asset_condition_id' => $toConditionId])->save();

            $audit->logConditionChanged(
                asset: $asset,
                actor: $user,
                fromConditionId: $fromConditionId,
                toConditionId: $toConditionId,
                performedAt: $performedAt,
                notes: $notes,
            );
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('assets.toast.updated')]);

        return back();
    }
}

