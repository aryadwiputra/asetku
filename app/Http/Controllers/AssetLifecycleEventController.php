<?php

namespace App\Http\Controllers;

use App\Http\Requests\Assets\StoreAssetLifecycleEventRequest;
use App\Models\Asset;
use App\Services\AssetAuditLogger;
use Carbon\CarbonImmutable;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class AssetLifecycleEventController extends Controller
{
    public function store(StoreAssetLifecycleEventRequest $request, Asset $asset, AssetAuditLogger $audit): RedirectResponse
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

        $audit->logLifecycleStage(
            asset: $asset,
            actor: $user,
            stage: (string) $data['stage'],
            performedAt: $performedAt,
            notes: isset($data['notes']) ? (string) $data['notes'] : null,
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => __('assets.lifecycle.toast.recorded')]);

        return back();
    }
}
