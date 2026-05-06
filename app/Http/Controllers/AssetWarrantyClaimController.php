<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAssetWarrantyClaimRequest;
use App\Http\Requests\UpdateAssetWarrantyClaimRequest;
use App\Models\Asset;
use App\Models\AssetHistory;
use App\Models\AssetWarrantyClaim;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AssetWarrantyClaimController extends Controller
{
    public function store(StoreAssetWarrantyClaimRequest $request, Asset $asset): RedirectResponse
    {
        $this->authorize('update', $asset);

        DB::transaction(function () use ($request, $asset): void {
            $claim = $asset->warrantyClaims()->create($request->validated());

            AssetHistory::query()->create([
                'asset_id' => $asset->id,
                'action' => 'warranty_claim_created',
                'description' => __('assets.warranty.claim_created'),
                'changed_by' => $request->user()?->id,
                'payload' => [
                    'claim_id' => $claim->id,
                    'status' => $claim->status,
                ],
            ]);
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('assets.warranty.toast.claim_created')]);

        return back();
    }

    public function update(UpdateAssetWarrantyClaimRequest $request, Asset $asset, AssetWarrantyClaim $claim): RedirectResponse
    {
        $this->authorize('update', $asset);
        abort_unless((int) $claim->asset_id === (int) $asset->id, 404);

        DB::transaction(function () use ($request, $asset, $claim): void {
            $claim->update($request->validated());

            AssetHistory::query()->create([
                'asset_id' => $asset->id,
                'action' => 'warranty_claim_updated',
                'description' => __('assets.warranty.claim_updated'),
                'changed_by' => $request->user()?->id,
                'payload' => [
                    'claim_id' => $claim->id,
                    'status' => $claim->status,
                    'result' => $claim->result,
                ],
            ]);
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('assets.warranty.toast.claim_updated')]);

        return back();
    }
}
