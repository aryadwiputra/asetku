<?php

namespace App\Http\Controllers;

use App\Http\Requests\Assets\StoreAssetAttachmentRequest;
use App\Models\Asset;
use App\Models\AssetMedia;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AssetAttachmentController extends Controller
{
    public function store(StoreAssetAttachmentRequest $request, Asset $asset): RedirectResponse
    {
        $this->authorize('update', $asset);

        $data = $request->validated();
        $kind = (string) $data['kind'];
        $isPrimary = (bool) ($data['is_primary'] ?? false);

        if ($kind === 'photo') {
            $count = $asset->media()->where('kind', 'photo')->count();
            if ($count >= 10) {
                return back()->withErrors(['kind' => __('assets.attachments.max_photos')]);
            }
        }

        DB::transaction(function () use ($asset, $data, $kind, $isPrimary): void {
            if ($isPrimary) {
                AssetMedia::query()
                    ->where('asset_id', $asset->id)
                    ->where('kind', $kind)
                    ->update(['is_primary' => false]);
            }

            $nextSort = (int) (AssetMedia::query()
                ->where('asset_id', $asset->id)
                ->where('kind', $kind)
                ->max('sort_order') ?? 0);

            AssetMedia::query()->create([
                'asset_id' => $asset->id,
                'media_asset_id' => (int) $data['media_asset_id'],
                'kind' => $kind,
                'sort_order' => $nextSort + 1,
                'is_primary' => $isPrimary,
            ]);
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('assets.attachments.toast.attached')]);

        return back();
    }

    public function destroy(Asset $asset, AssetMedia $assetMedia): RedirectResponse
    {
        $this->authorize('update', $asset);

        abort_unless((int) $assetMedia->asset_id === (int) $asset->id, 404);

        $assetMedia->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('assets.attachments.toast.detached')]);

        return back();
    }
}
