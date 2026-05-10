<?php

namespace App\Http\Controllers;

use App\Http\Requests\Assets\StoreAssetAttachmentRequest;
use App\Models\Asset;
use App\Models\AssetMedia;
use App\Services\AssetAuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AssetAttachmentController extends Controller
{
    public function store(StoreAssetAttachmentRequest $request, Asset $asset, AssetAuditLogger $audit): RedirectResponse
    {
        $this->authorize('update', $asset);

        $data = $request->validated();
        $kind = (string) $data['kind'];
        $isPrimary = (bool) ($data['is_primary'] ?? false);
        $stage = $data['stage'] ?? null;
        $documentType = $data['document_type'] ?? null;

        if ($kind === 'photo') {
            $count = $asset->media()->where('kind', 'photo')->count();
            if ($count >= 20) {
                return back()->withErrors(['kind' => __('assets.attachments.max_photos')]);
            }
        }

        DB::transaction(function () use ($asset, $data, $kind, $isPrimary, $stage, $documentType, $request, $audit): void {
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

            $assetMedia = AssetMedia::query()->create([
                'asset_id' => $asset->id,
                'media_asset_id' => (int) $data['media_asset_id'],
                'kind' => $kind,
                'stage' => is_string($stage) && $stage !== '' ? $stage : null,
                'document_type' => is_string($documentType) && $documentType !== '' ? $documentType : null,
                'sort_order' => $nextSort + 1,
                'is_primary' => $isPrimary,
            ]);

            $user = $request->user();
            if ($user !== null) {
                $audit->logAttachmentAdded($asset, $user, [
                    'asset_media_id' => $assetMedia->id,
                    'kind' => $assetMedia->kind,
                    'media_asset_id' => $assetMedia->media_asset_id,
                    'stage' => $assetMedia->stage,
                    'document_type' => $assetMedia->document_type,
                    'is_primary' => (bool) $assetMedia->is_primary,
                ]);
            }
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('assets.attachments.toast.attached')]);

        return back();
    }

    public function destroy(Asset $asset, AssetMedia $assetMedia, AssetAuditLogger $audit): RedirectResponse
    {
        $this->authorize('update', $asset);

        abort_unless((int) $assetMedia->asset_id === (int) $asset->id, 404);

        $user = request()->user();
        if ($user !== null) {
            $audit->logAttachmentRemoved($asset, $user, [
                'asset_media_id' => $assetMedia->id,
                'kind' => $assetMedia->kind,
                'media_asset_id' => $assetMedia->media_asset_id,
                'stage' => $assetMedia->stage,
                'document_type' => $assetMedia->document_type,
                'is_primary' => (bool) $assetMedia->is_primary,
            ]);
        }

        $assetMedia->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('assets.attachments.toast.detached')]);

        return back();
    }
}
