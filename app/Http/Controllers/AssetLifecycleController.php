<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\AssetCondition;
use App\Models\AssetHistory;
use App\Models\AssetLocation;
use App\Models\AssetStatus;
use App\Models\AssetUser;
use App\Models\Branch;
use App\Models\Department;
use App\Queries\AssetListQuery;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Gate;
use Inertia\Response;

class AssetLifecycleController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Asset::class);

        $search = $request->string('q')->trim()->toString();

        return inertia('assets/lifecycle', [
            'search' => $search,
            'results' => $this->results($request, $search),
            'asset' => null,
            'histories' => [],
            'attachments' => [],
            'meta' => $this->meta(),
            'abilities' => [
                'canView' => true,
                'canUpdate' => false,
            ],
        ]);
    }

    public function show(Request $request, Asset $asset): Response
    {
        $this->authorize('view', $asset);

        $asset->load([
            'branch:id,name,code',
            'department:id,name,code,branch_id',
            'status:id,name,code',
            'condition:id,name,code',
            'category:id,name,code,parent_id',
            'location:id,name,code,branch_id,parent_id,type',
            'personInCharge:id,name',
            'user:id,name',
        ]);

        $histories = $asset->histories()
            ->orderByRaw('COALESCE(performed_at, created_at) DESC')
            ->limit(100)
            ->with('changedBy:id,name')
            ->get(['id', 'action', 'performed_at', 'description', 'changed_by', 'payload', 'created_at'])
            ->map(fn (AssetHistory $history): array => [
                'id' => $history->id,
                'action' => $history->action,
                'performed_at' => $history->performed_at,
                'description' => $history->description,
                'changed_by' => $history->changed_by,
                'actor' => $history->changedBy ? [
                    'id' => $history->changedBy->id,
                    'name' => $history->changedBy->name,
                ] : null,
                'payload' => $history->payload,
                'created_at' => $history->created_at,
            ]);

        $attachments = $asset->media()
            ->with(['mediaAsset'])
            ->orderBy('kind')
            ->orderBy('sort_order')
            ->get()
            ->map(function ($row) {
                $asset = $row->mediaAsset;

                return [
                    'id' => $row->id,
                    'kind' => $row->kind,
                    'stage' => $row->stage,
                    'document_type' => $row->document_type,
                    'sort_order' => $row->sort_order,
                    'is_primary' => (bool) $row->is_primary,
                    'media_asset' => $asset ? [
                        'id' => $asset->id,
                        'title' => $asset->title,
                        'url' => $asset->getFirstMediaUrl('file'),
                        'thumb_url' => $asset->getFirstMediaUrl('file', 'thumb'),
                        'mime' => $asset->getFirstMedia('file')?->mime_type,
                        'size' => $asset->getFirstMedia('file')?->size,
                    ] : null,
                ];
            });

        $search = $request->string('q')->trim()->toString();

        return inertia('assets/lifecycle', [
            'search' => $search,
            'results' => $this->results($request, $search),
            'asset' => $asset,
            'histories' => $histories,
            'attachments' => $attachments,
            'meta' => $this->meta(),
            'abilities' => [
                'canView' => true,
                'canUpdate' => $request->user() && Gate::forUser($request->user())->allows('update', $asset),
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

    /**
     * @return Collection<int, Asset>
     */
    private function results(Request $request, string $search): Collection
    {
        /** @var Builder $query */
        $query = $search !== ''
            ? AssetListQuery::build($request->user(), $search, [])
            : AssetListQuery::build($request->user(), null, []);

        return $query
            ->orderByDesc('updated_at')
            ->limit(30)
            ->get(['id', 'code', 'name', 'branch_id', 'asset_status_id', 'asset_condition_id', 'updated_at']);
    }

    /**
     * @return array<string, mixed>
     */
    private function meta(): array
    {
        return [
            'assetStatuses' => AssetStatus::query()->orderBy('name')->get(['id', 'name', 'code']),
            'assetConditions' => AssetCondition::query()->orderBy('name')->get(['id', 'name', 'code']),
            'branches' => Branch::query()->where('is_active', true)->orderBy('name')->get(['id', 'name', 'code']),
            'departments' => Department::query()->orderBy('name')->get(['id', 'name', 'code', 'branch_id']),
            'locations' => AssetLocation::query()->orderBy('name')->get(['id', 'name', 'code', 'branch_id', 'parent_id', 'type']),
            'assetUsers' => AssetUser::query()->orderBy('name')->get(['id', 'name']),
        ];
    }
}
