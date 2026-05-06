<?php

namespace App\Services;

use App\Models\Asset;
use App\Models\AssetDisposal;
use App\Models\AssetStatus;
use App\Models\Organization;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AssetDisposalService
{
    public function __construct(
        private readonly ApprovalEngine $approvalEngine,
        private readonly AssetAuditLogger $audit,
    ) {}

    /**
     * @param  array<string, mixed>  $payload
     */
    public function requestDisposal(Asset $asset, array $payload, User $actor): AssetDisposal
    {
        if ($asset->trashed()) {
            throw ValidationException::withMessages([
                'asset_id' => [__('disposals.errors.asset_deleted')],
            ]);
        }

        if ($asset->archived_at !== null) {
            throw ValidationException::withMessages([
                'asset_id' => [__('disposals.errors.asset_archived')],
            ]);
        }

        $type = (string) ($payload['type'] ?? '');
        if (! in_array($type, ['sale', 'scrap', 'donation', 'writeoff'], true)) {
            throw ValidationException::withMessages([
                'type' => [__('disposals.errors.type_invalid')],
            ]);
        }

        $disposedAt = null;
        if (is_string($payload['disposed_at'] ?? null) && $payload['disposed_at'] !== '') {
            $disposedAt = CarbonImmutable::parse((string) $payload['disposed_at']);
        }

        $proceeds = is_numeric($payload['proceeds_amount'] ?? null) ? (float) $payload['proceeds_amount'] : null;
        $fees = is_numeric($payload['fees_amount'] ?? null) ? (float) $payload['fees_amount'] : null;
        $fairValue = is_numeric($payload['fair_value_amount'] ?? null) ? (float) $payload['fair_value_amount'] : null;

        $proceeds = is_float($proceeds) ? max(0, $proceeds) : null;
        $fees = is_float($fees) ? max(0, $fees) : null;
        $fairValue = is_float($fairValue) ? max(0, $fairValue) : null;

        $bookValue = (float) $asset->bookValue($disposedAt?->toMutable());

        $netProceeds = match ($type) {
            'sale', 'scrap' => max(0, (float) ($proceeds ?? 0) - (float) ($fees ?? 0)),
            'donation' => (float) ($fairValue ?? 0),
            default => 0.0,
        };

        $gainLoss = $netProceeds - $bookValue;

        $organization = Organization::query()->findOrFail((int) $asset->organization_id, ['id', 'currency_code', 'slug']);

        return DB::transaction(function () use ($asset, $actor, $payload, $type, $disposedAt, $organization, $proceeds, $fees, $fairValue, $netProceeds, $bookValue, $gainLoss): AssetDisposal {
            $pendingExists = AssetDisposal::query()
                ->where('asset_id', $asset->id)
                ->where('status', 'pending')
                ->exists();

            if ($pendingExists) {
                throw ValidationException::withMessages([
                    'asset_id' => [__('disposals.errors.pending_exists')],
                ]);
            }

            /** @var AssetDisposal $disposal */
            $disposal = AssetDisposal::query()->create([
                'asset_id' => $asset->id,
                'type' => $type,
                'reason' => is_string($payload['reason'] ?? null) ? (string) $payload['reason'] : null,
                'notes' => is_string($payload['notes'] ?? null) ? (string) $payload['notes'] : null,
                'currency_code' => is_string($organization->currency_code) ? $organization->currency_code : null,
                'proceeds_amount' => $proceeds,
                'fees_amount' => $fees,
                'fair_value_amount' => $fairValue,
                'net_proceeds_amount' => $netProceeds,
                'book_value_at_disposal' => $bookValue,
                'gain_loss_amount' => $gainLoss,
                'disposed_at' => $disposedAt,
                'requested_by' => $actor->id,
                'status' => 'pending',
                'previous_status_id' => $asset->asset_status_id,
                'previous_location_id' => $asset->asset_location_id,
                'previous_department_id' => $asset->department_id,
            ]);

            $this->approvalEngine->createRequest(
                approvable: $disposal,
                type: 'disposal',
                actor: $actor,
                metadata: ['asset_id' => $asset->id],
            );

            $this->audit->logDisposalRequested(
                asset: $asset,
                actor: $actor,
                disposal: $disposal,
            );

            return $disposal;
        });
    }

    public function approve(AssetDisposal $disposal, User $actor, ?string $notes = null): AssetDisposal
    {
        $approval = $disposal->approval()->first();
        if (! $approval) {
            abort(404);
        }

        $approval = $this->approvalEngine->approveCurrentStep($approval, $actor, $notes);

        if ($approval->status === 'approved') {
            $this->executeDisposal($disposal, $actor);
        }

        return $disposal->refresh();
    }

    public function reject(AssetDisposal $disposal, User $actor, ?string $notes = null): AssetDisposal
    {
        $approval = $disposal->approval()->first();
        if (! $approval) {
            abort(404);
        }

        $approval = $this->approvalEngine->reject($approval, $actor, $notes);

        if ($approval->status === 'rejected') {
            $disposal->forceFill([
                'status' => 'rejected',
                'rejected_by' => $actor->id,
                'rejected_at' => now(),
                'decision_notes' => $notes,
            ])->save();

            $asset = $disposal->asset()->first();
            if ($asset) {
                $this->audit->logDisposalRejected(
                    asset: $asset,
                    actor: $actor,
                    disposal: $disposal,
                    notes: $notes,
                );
            }
        }

        return $disposal->refresh();
    }

    private function executeDisposal(AssetDisposal $disposal, User $actor): void
    {
        DB::transaction(function () use ($disposal, $actor): void {
            /** @var AssetDisposal $locked */
            $locked = AssetDisposal::query()->whereKey($disposal->id)->lockForUpdate()->firstOrFail();

            if ($locked->status === 'executed') {
                return;
            }

            /** @var Asset $asset */
            $asset = $locked->asset()->lockForUpdate()->firstOrFail();

            $disposedAt = $locked->disposed_at ?? now();

            $disposedStatusId = AssetStatus::query()
                ->where('code', 'disposed')
                ->value('id');

            if ($disposedStatusId === null) {
                $disposedStatusId = AssetStatus::query()->where('code', 'disposal')->value('id');
            }

            $asset->forceFill([
                'archived_at' => now(),
                'archived_by' => $actor->id,
                'asset_status_id' => $disposedStatusId ?? $asset->asset_status_id,
            ])->save();

            $locked->forceFill([
                'status' => 'executed',
                'executed_at' => now(),
                'disposed_by' => $actor->id,
                'disposed_at' => $disposedAt,
                'approved_by' => $actor->id,
                'approved_at' => now(),
            ])->save();

            $this->audit->logDisposed(
                asset: $asset,
                actor: $actor,
                disposal: $locked,
            );
        });
    }
}
