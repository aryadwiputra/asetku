<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Queries\AssetListQuery;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class AssetLifecycleController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Asset::class);

        $search = $request->string('q')->trim()->toString();

        $results = collect();
        if ($search !== '') {
            $results = AssetListQuery::build($request->user(), $search, [])
                ->orderByDesc('updated_at')
                ->limit(30)
                ->get(['id', 'code', 'name', 'branch_id', 'asset_status_id', 'asset_condition_id', 'updated_at']);
        }

        return inertia('assets/lifecycle', [
            'search' => $search,
            'results' => $results,
            'asset' => null,
            'histories' => [],
            'attachments' => [],
            'meta' => (object) [],
            'abilities' => [
                'canView' => true,
                'canUpdate' => false,
            ],
        ]);
    }

    public function show(Request $request, Asset $asset): Response
    {
        $this->authorize('view', $asset);

        return inertia('assets/lifecycle', [
            'search' => $request->string('q')->trim()->toString(),
            'results' => [],
            'asset' => $asset,
            'histories' => [],
            'attachments' => [],
            'meta' => (object) [],
            'abilities' => [
                'canView' => true,
                'canUpdate' => $request->user() ? $request->user()->can('update', $asset) : false,
            ],
        ]);
    }

    public function byToken(Request $request, string $token): RedirectResponse
    {
        $this->authorize('viewAny', Asset::class);

        $asset = Asset::query()->where('qr_token', $token)->firstOrFail(['id']);
        $this->authorize('view', $asset);

        return to_route('assets.lifecycle.show', $asset);
    }
}

