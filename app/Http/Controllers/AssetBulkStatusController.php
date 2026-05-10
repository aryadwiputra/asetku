<?php

namespace App\Http\Controllers;

use App\Http\Requests\Assets\BulkUpdateAssetStatusRequest;
use App\Models\Asset;
use App\Services\AssetAuditLogger;
use App\Services\AssetStatusTransitionResolver;
use Carbon\CarbonImmutable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AssetBulkStatusController extends Controller
{
    public function store(
        BulkUpdateAssetStatusRequest $request,
        AssetAuditLogger $audit,
        AssetStatusTransitionResolver $resolver,
    ): RedirectResponse {
        $user = $request->user();
        if ($user === null) {
            abort(401);
        }

        $data = $request->validated();

        $assetIds = collect($data['asset_ids'] ?? [])
            ->filter(fn ($id): bool => is_numeric($id))
            ->map(fn ($id): int => (int) $id)
            ->unique()
            ->values();

        $assets = Asset::query()
            ->with('status:id,name,code')
            ->whereIn('id', $assetIds)
            ->get();

        $assets->each(fn (Asset $asset) => $this->authorize('update', $asset));

        $toStatusId = is_numeric($data['asset_status_id'] ?? null) ? (int) $data['asset_status_id'] : null;
        $resolver->ensureAllowedForMany($assets, $toStatusId);

        $performedAt = null;
        if (is_string($data['performed_at'] ?? null) && $data['performed_at'] !== '') {
            $performedAt = CarbonImmutable::parse($data['performed_at']);
        }

        $notes = isset($data['notes']) ? (string) $data['notes'] : null;
        $updated = 0;

        DB::transaction(function () use ($assets, $audit, $notes, $performedAt, $toStatusId, $user, &$updated): void {
            foreach ($assets as $asset) {
                $fromStatusId = is_numeric($asset->asset_status_id) ? (int) $asset->asset_status_id : null;

                if ($fromStatusId === $toStatusId) {
                    continue;
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

                $updated++;
            }
        });

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('assets.toast.bulk_status_updated', ['count' => $updated]),
        ]);

        return back();
    }
}
