<?php

namespace App\Http\Controllers;

use App\Http\Requests\Audit\StoreAuditFindingRequest;
use App\Http\Requests\Audit\UpdateAuditFindingRequest;
use App\Models\Asset;
use App\Models\AssetCondition;
use App\Models\AssetHistory;
use App\Models\AssetLocation;
use App\Models\AuditFinding;
use App\Models\AuditSchedule;
use App\Models\AuditScheduleAsset;
use App\Models\User;
use App\Notifications\AuditFindingSubmittedNotification;
use App\Services\AssetAuditLogger;
use App\Services\OrganizationContext;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AuditFindingController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', AuditFinding::class);

        $organizationId = app(OrganizationContext::class)->requireOrganizationId();

        $findings = AuditFinding::query()
            ->where('organization_id', $organizationId)
            ->with(['asset:id,code,name', 'auditor:id,name', 'auditSchedule:id,name', 'currentLocation:id,name', 'expectedLocation:id,name', 'currentCondition:id,name'])
            ->when($request->query('status'), fn ($q, $s) => $q->where('status', $s))
            ->when($request->query('approval_status'), fn ($q, $s) => $q->where('approval_status', $s))
            ->orderByDesc('created_at')
            ->limit(50)
            ->get()
            ->map(fn (AuditFinding $f) => [
                'id' => $f->id,
                'asset' => $f->asset ? ['id' => $f->asset->id, 'code' => $f->asset->code, 'name' => $f->asset->name] : null,
                'auditor' => $f->auditor ? ['id' => $f->auditor->id, 'name' => $f->auditor->name] : null,
                'schedule' => $f->auditSchedule ? ['id' => $f->auditSchedule->id, 'name' => $f->auditSchedule->name] : null,
                'status' => $f->status,
                'approval_status' => $f->approval_status,
                'current_location' => $f->currentLocation ? ['id' => $f->currentLocation->id, 'name' => $f->currentLocation->name] : null,
                'expected_location' => $f->expectedLocation ? ['id' => $f->expectedLocation->id, 'name' => $f->expectedLocation->name] : null,
                'current_condition' => $f->currentCondition ? ['id' => $f->currentCondition->id, 'name' => $f->currentCondition->name] : null,
                'notes' => $f->notes,
                'audited_at' => $f->audited_at?->toISOString(),
                'created_at' => $f->created_at,
            ]);

        return Inertia::render('audit/findings/index', [
            'items' => $findings,
        ]);
    }

    public function createForAsset(Request $request, Asset $asset): Response
    {
        $this->authorize('create', AuditFinding::class);

        $organizationId = app(OrganizationContext::class)->requireOrganizationId();

        $asset->load(['branch:id,name,code', 'location:id,name,code', 'condition:id,name,code']);

        return Inertia::render('audit/findings/create', [
            'asset' => [
                'id' => $asset->id,
                'code' => $asset->code,
                'name' => $asset->name,
                'branch' => $asset->branch ? ['id' => $asset->branch->id, 'name' => $asset->branch->name] : null,
                'location' => $asset->location ? ['id' => $asset->location->id, 'name' => $asset->location->name] : null,
                'condition' => $asset->condition ? ['id' => $asset->condition->id, 'name' => $asset->condition->name] : null,
            ],
            'meta' => [
                'locations' => AssetLocation::query()
                    ->where('organization_id', $organizationId)
                    ->where('branch_id', $asset->branch_id)
                    ->orderBy('name')
                    ->get(['id', 'name', 'code', 'branch_id']),
                'conditions' => AssetCondition::query()
                    ->where('organization_id', $organizationId)
                    ->orderBy('name')
                    ->get(['id', 'name', 'code']),
            ],
        ]);
    }

    public function store(StoreAuditFindingRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $user = $request->user();
        $organizationId = app(OrganizationContext::class)->requireOrganizationId();

        $finding = DB::transaction(function () use ($data, $user, $organizationId): AuditFinding {
            $finding = AuditFinding::query()->create([
                'organization_id' => $organizationId,
                'audit_schedule_id' => $data['audit_schedule_id'] ?? null,
                'asset_id' => (int) $data['asset_id'],
                'auditor_id' => $user->id,
                'current_location_id' => $data['current_location_id'] ?? null,
                'expected_location_id' => $data['expected_location_id'] ?? null,
                'current_condition_id' => $data['current_condition_id'] ?? null,
                'status' => $data['status'],
                'notes' => $data['notes'] ?? null,
                'signature_data' => $data['signature_data'] ?? null,
                'audited_at' => $data['audited_at'] ? now() : now(),
                'approval_status' => 'pending',
            ]);

            if (! empty($data['photo_ids'])) {
                foreach ($data['photo_ids'] as $sortOrder => $mediaAssetId) {
                    $finding->photos()->create([
                        'media_asset_id' => $mediaAssetId,
                        'sort_order' => $sortOrder,
                    ]);
                }
            }

            if ($data['audit_schedule_id']) {
                $scheduleAsset = AuditScheduleAsset::query()
                    ->where('audit_schedule_id', $data['audit_schedule_id'])
                    ->where('asset_id', $data['asset_id'])
                    ->first();

                if ($scheduleAsset) {
                    $scheduleAsset->fill([
                        'status' => 'completed',
                        'completed_at' => now(),
                        'completed_by' => $user->id,
                    ])->save();
                }

                $schedule = AuditSchedule::find($data['audit_schedule_id']);
                if ($schedule && $schedule->created_by) {
                    $creator = User::find($schedule->created_by);
                    if ($creator) {
                        $creator->notify(new AuditFindingSubmittedNotification($finding));
                    }
                }
            }

            return $finding;
        });

        $this->logFindingToHistory($finding, $user);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('audit.toast.finding_created')]);

        if ($data['audit_schedule_id']) {
            return to_route('audit.schedules.show', $data['audit_schedule_id']);
        }

        return to_route('audit.findings.index');
    }

    public function edit(AuditFinding $auditFinding): Response
    {
        $this->authorize('update', $auditFinding);

        $auditFinding->load(['photos.mediaAsset', 'currentLocation', 'expectedLocation', 'currentCondition']);

        $organizationId = app(OrganizationContext::class)->requireOrganizationId();

        return Inertia::render('audit/findings/edit', [
            'finding' => [
                'id' => $auditFinding->id,
                'asset_id' => $auditFinding->asset_id,
                'status' => $auditFinding->status,
                'approval_status' => $auditFinding->approval_status,
                'current_location_id' => $auditFinding->current_location_id,
                'expected_location_id' => $auditFinding->expected_location_id,
                'current_condition_id' => $auditFinding->current_condition_id,
                'notes' => $auditFinding->notes,
                'signature_data' => $auditFinding->signature_data,
                'audited_at' => $auditFinding->audited_at?->toISOString(),
                'photos' => $auditFinding->photos->map(fn ($p) => [
                    'id' => $p->id,
                    'media_asset_id' => $p->media_asset_id,
                    'media_asset' => $p->mediaAsset ? [
                        'id' => $p->mediaAsset->id,
                        'url' => $p->mediaAsset->getFirstMediaUrl('file'),
                        'thumb_url' => $p->mediaAsset->getFirstMediaUrl('file', 'thumb'),
                        'title' => $p->mediaAsset->title,
                    ] : null,
                ]),
            ],
            'meta' => [
                'locations' => AssetLocation::query()
                    ->where('organization_id', $organizationId)
                    ->orderBy('name')
                    ->get(['id', 'name', 'code']),
                'conditions' => AssetCondition::query()
                    ->where('organization_id', $organizationId)
                    ->orderBy('name')
                    ->get(['id', 'name', 'code']),
            ],
        ]);
    }

    public function update(UpdateAuditFindingRequest $request, AuditFinding $auditFinding): RedirectResponse
    {
        $this->authorize('update', $auditFinding);

        $data = $request->validated();

        $auditFinding->fill([
            'status' => $data['status'] ?? $auditFinding->status,
            'current_location_id' => $data['current_location_id'] ?? null,
            'expected_location_id' => $data['expected_location_id'] ?? null,
            'current_condition_id' => $data['current_condition_id'] ?? null,
            'notes' => $data['notes'] ?? null,
            'signature_data' => $data['signature_data'] ?? null,
            'audited_at' => $data['audited_at'] ? now() : $auditFinding->audited_at,
        ]);

        if (isset($data['photo_ids'])) {
            $auditFinding->photos()->delete();
            foreach ($data['photo_ids'] as $sortOrder => $mediaAssetId) {
                $auditFinding->photos()->create([
                    'media_asset_id' => $mediaAssetId,
                    'sort_order' => $sortOrder,
                ]);
            }
        }

        $auditFinding->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('audit.toast.finding_updated')]);

        return back();
    }

    public function approve(Request $request, AuditFinding $auditFinding): RedirectResponse
    {
        $this->authorize('approve', $auditFinding);

        $auditFinding->fill([
            'approval_status' => 'approved',
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
            'approval_notes' => $request->input('notes'),
        ])->save();

        $this->applyFindingToAsset($auditFinding);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('audit.toast.finding_approved')]);

        return back();
    }

    public function reject(Request $request, AuditFinding $auditFinding): RedirectResponse
    {
        $this->authorize('approve', $auditFinding);

        $auditFinding->fill([
            'approval_status' => 'rejected',
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
            'approval_notes' => $request->input('notes'),
        ])->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('audit.toast.finding_rejected')]);

        return back();
    }

    public function destroy(AuditFinding $auditFinding): RedirectResponse
    {
        $this->authorize('delete', $auditFinding);

        $auditFinding->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('audit.toast.finding_deleted')]);

        return back();
    }

    private function logFindingToHistory(AuditFinding $finding, User $user): void
    {
        $auditLogger = app(AssetAuditLogger::class);

        $description = __('audit.history.finding_recorded', [
            'status' => __("audit.status_values.{$finding->status}"),
            'auditor' => $user->name,
        ]);

        AssetHistory::query()->create([
            'asset_id' => $finding->asset_id,
            'action' => 'audit_finding_recorded',
            'performed_at' => $finding->audited_at ?? now(),
            'description' => $description,
            'changed_by' => $user->id,
            'payload' => [
                'finding_id' => $finding->id,
                'status' => $finding->status,
                'current_location_id' => $finding->current_location_id,
                'expected_location_id' => $finding->expected_location_id,
                'current_condition_id' => $finding->current_condition_id,
                'notes' => $finding->notes,
            ],
        ]);
    }

    private function applyFindingToAsset(AuditFinding $finding): void
    {
        $asset = Asset::query()->find($finding->asset_id);
        if (! $asset) {
            return;
        }

        $changes = [];

        if ($finding->current_location_id) {
            $oldLocationId = $asset->asset_location_id;
            $asset->fill(['asset_location_id' => $finding->current_location_id]);
            $changes['asset_location_id'] = [
                'from' => $oldLocationId,
                'to' => $finding->current_location_id,
            ];
        }

        if ($finding->current_condition_id) {
            $oldConditionId = $asset->asset_condition_id;
            $asset->fill(['asset_condition_id' => $finding->current_condition_id]);
            $changes['asset_condition_id'] = [
                'from' => $oldConditionId,
                'to' => $finding->current_condition_id,
            ];
        }

        if (! empty($changes)) {
            $asset->save();

            $auditLogger = app(AssetAuditLogger::class);
            $auditLogger->logUpdated($asset, User::query()->find($finding->approved_by), [], $changes);
        }
    }
}
