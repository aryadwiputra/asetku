<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAssetUsageLogRequest;
use App\Models\Asset;
use App\Models\AssetUsageLog;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class AssetUsageLogController extends Controller
{
    public function store(StoreAssetUsageLogRequest $request, Asset $asset): RedirectResponse
    {
        $this->authorize('update', $asset);
        $this->authorize('create', \App\Models\AssetDepreciationRun::class);

        $user = $request->user();
        if ($user === null) {
            abort(401);
        }

        $data = $request->validated();

        AssetUsageLog::query()->create([
            'asset_id' => $asset->id,
            'recorded_at' => $data['recorded_at'],
            'units' => $data['units'],
            'unit' => $data['unit'] ?? null,
            'notes' => $data['notes'] ?? null,
            'created_by' => $user->id,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('common.updated')]);

        return back();
    }
}
