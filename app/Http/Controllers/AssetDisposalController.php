<?php

namespace App\Http\Controllers;

use App\Http\Requests\DataTableRequest;
use App\Http\Requests\StoreAssetDisposalRequest;
use App\Models\Asset;
use App\Models\AssetDisposal;
use App\Models\Branch;
use App\Queries\AssetListQuery;
use App\Services\ApprovalEngine;
use App\Services\AssetDisposalService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AssetDisposalController extends Controller
{
    public function index(DataTableRequest $request): Response
    {
        $this->authorize('viewAny', AssetDisposal::class);

        $search = $request->searchQuery();
        $filters = $request->filters();

        $query = AssetDisposal::query()
            ->with([
                'asset:id,code,name,branch_id,department_id,asset_location_id,asset_status_id,asset_condition_id',
                'asset.branch:id,name,code',
                'asset.status:id,name,code',
                'asset.condition:id,name,code',
            ])
            ->when($filters['status'] ?? null, fn (Builder $q, string $status) => $q->where('status', $status))
            ->when($filters['type'] ?? null, fn (Builder $q, string $type) => $q->where('type', $type))
            ->when($filters['branch_id'] ?? null, function (Builder $q, string $branchId): void {
                if (! ctype_digit($branchId)) {
                    return;
                }

                $q->whereHas('asset', fn (Builder $assetQ) => $assetQ->where('branch_id', (int) $branchId));
            });

        $search = is_string($search) ? trim($search) : '';
        if ($search !== '') {
            $query->whereHas('asset', function (Builder $assetQ) use ($search): void {
                $assetQ->where('code', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%");
            });
        }

        $items = $query
            ->orderByDesc('created_at')
            ->paginate($request->perPage(10))
            ->withQueryString();

        return Inertia::render('disposals/index', [
            'items' => $items,
            'filtersMeta' => [
                'branches' => Branch::query()->orderBy('name')->get(['id', 'name', 'code']),
                'statuses' => ['pending', 'approved', 'rejected', 'executed', 'revoked'],
                'types' => ['sale', 'scrap', 'donation', 'writeoff'],
            ],
        ]);
    }

    public function create(DataTableRequest $request): Response
    {
        $this->authorize('create', AssetDisposal::class);

        $search = $request->searchQuery();
        $assetId = $request->query('asset_id');

        $results = AssetListQuery::buildBase($request->user(), $search, [])
            ->whereNull('archived_at')
            ->orderByDesc('updated_at')
            ->limit(20)
            ->get(['id', 'code', 'name', 'branch_id', 'asset_status_id', 'asset_condition_id', 'updated_at']);

        $results->load(['branch:id,name,code', 'status:id,name,code', 'condition:id,name,code']);

        return Inertia::render('disposals/create', [
            'search' => $search,
            'results' => $results,
            'selectedAsset' => is_numeric($assetId)
                ? Asset::query()
                    ->forUser($request->user())
                    ->whereNull('archived_at')
                    ->with(['branch:id,name,code', 'status:id,name,code', 'condition:id,name,code'])
                    ->find((int) $assetId, ['id', 'code', 'name', 'branch_id', 'asset_status_id', 'asset_condition_id', 'updated_at'])
                : null,
            'types' => ['sale', 'scrap', 'donation', 'writeoff'],
        ]);
    }

    public function byToken(Request $request, string $token): RedirectResponse
    {
        $this->authorize('create', AssetDisposal::class);

        $asset = Asset::query()
            ->forUser($request->user())
            ->where('qr_token', $token)
            ->firstOrFail(['id']);

        return to_route('disposals.create', ['asset_id' => $asset->id]);
    }

    public function store(StoreAssetDisposalRequest $request, AssetDisposalService $service): RedirectResponse
    {
        $this->authorize('create', AssetDisposal::class);

        $user = $request->user();
        if ($user === null) {
            abort(401);
        }

        $data = $request->validated();

        /** @var Asset $asset */
        $asset = Asset::query()->findOrFail((int) $data['asset_id']);
        $this->authorize('update', $asset);

        $disposal = $service->requestDisposal($asset, $data, $user);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('disposals.toast.requested')]);

        return to_route('disposals.show', $disposal);
    }

    public function show(Request $request, AssetDisposal $disposal, ApprovalEngine $approvalEngine): Response
    {
        $this->authorize('view', $disposal);

        $disposal->load([
            'asset.branch:id,name,code',
            'asset.department:id,name,code,branch_id',
            'asset.location:id,name,code,branch_id,parent_id',
            'asset.status:id,name,code',
            'asset.condition:id,name,code',
            'asset.category:id,name,code,parent_id',
            'asset.personInCharge:id,name',
            'asset.user:id,name',
            'requester:id,name',
            'approver:id,name',
            'rejector:id,name',
            'approval.steps.decider:id,name',
        ]);

        $user = $request->user();
        $canApprove = false;
        if ($user && $user->can('approve', $disposal) && $disposal->approval) {
            $canApprove = $approvalEngine->canDecideCurrentStep($disposal->approval, $user);
        }

        $canExport = $user ? $user->can('export', $disposal) : false;

        $attachments = $disposal->asset
            ? $disposal->asset->media()
                ->where('kind', 'document')
                ->where('stage', 'disposal')
                ->with('mediaAsset')
                ->orderBy('sort_order')
                ->get()
                ->map(function ($row) {
                    $asset = $row->mediaAsset;

                    return [
                        'id' => $row->id,
                        'document_type' => $row->document_type,
                        'media_asset' => $asset ? [
                            'id' => $asset->id,
                            'title' => $asset->title,
                            'url' => $asset->getFirstMediaUrl('file'),
                            'mime' => $asset->getFirstMedia('file')?->mime_type,
                            'size' => $asset->getFirstMedia('file')?->size,
                        ] : null,
                    ];
                })
            : [];

        return Inertia::render('disposals/show', [
            'disposal' => $disposal,
            'attachments' => $attachments,
            'abilities' => [
                'approve' => $canApprove,
                'export' => $canExport,
            ],
        ]);
    }
}
