<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\User;
use App\Services\AssetAuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AssetQrTokenController extends Controller
{
    public function update(Asset $asset, AssetAuditLogger $audit): RedirectResponse
    {
        $this->authorize('update', $asset);

        /** @var User $user */
        $user = request()->user();
        $previousToken = $asset->qr_token;

        do {
            $nextToken = Str::lower(Str::random(40));
        } while (Asset::query()->where('qr_token', $nextToken)->exists());

        $asset->forceFill(['qr_token' => $nextToken])->save();

        $audit->logUpdated($asset, $user, ['qr_token' => $previousToken], ['qr_token' => $nextToken]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('assets.toast.qr_token_regenerated')]);

        return to_route('assets.show', $asset);
    }
}
