<?php

namespace App\Services;

use App\Models\Asset;
use App\Models\AssetStatus;
use App\Models\AssetStatusTransition;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class AssetStatusTransitionResolver
{
    /**
     * @return array<int, array{id:int,name:string,code:string,transition_type:string,transition_reason:?string}>
     */
    public function optionsForAsset(Asset $asset): array
    {
        /** @var EloquentCollection<int, AssetStatus> $statuses */
        $statuses = AssetStatus::query()
            ->orderBy('name')
            ->get(['id', 'name', 'code']);

        return $statuses
            ->map(function (AssetStatus $status) use ($asset): array {
                $decision = $this->decision($asset, $status);

                return [
                    'id' => $status->id,
                    'name' => $status->name,
                    'code' => $status->code,
                    'transition_type' => $decision['type'],
                    'transition_reason' => $decision['reason'],
                ];
            })
            ->values()
            ->all();
    }

    public function ensureAllowed(Asset $asset, ?int $toStatusId): void
    {
        $toStatus = $toStatusId !== null ? AssetStatus::query()->find($toStatusId, ['id', 'name', 'code']) : null;
        $decision = $this->decision($asset, $toStatus);

        if ($decision['type'] !== 'blocked') {
            return;
        }

        throw ValidationException::withMessages([
            'asset_status_id' => $decision['reason'] ?? __('assets.validation.status_transition_blocked'),
        ]);
    }

    /**
     * @param  Collection<int, Asset>  $assets
     */
    public function ensureAllowedForMany(Collection $assets, ?int $toStatusId): void
    {
        $toStatus = $toStatusId !== null ? AssetStatus::query()->find($toStatusId, ['id', 'name', 'code']) : null;

        $blockedAssets = $assets
            ->filter(function (Asset $asset) use ($toStatus): bool {
                $decision = $this->decision($asset, $toStatus);

                return $decision['type'] === 'blocked';
            })
            ->take(3)
            ->map(fn (Asset $asset): string => $asset->code)
            ->values();

        if ($blockedAssets->isEmpty()) {
            return;
        }

        throw ValidationException::withMessages([
            'asset_ids' => __('assets.validation.bulk_status_transition_blocked', [
                'assets' => $blockedAssets->join(', '),
            ]),
        ]);
    }

    /**
     * @return array{type:string,reason:?string}
     */
    public function decision(Asset $asset, ?AssetStatus $toStatus): array
    {
        $asset->loadMissing('status:id,name,code');

        /** @var AssetStatus|null $fromStatus */
        $fromStatus = $asset->status;

        $configured = $this->configuredDecision($fromStatus?->id, $toStatus?->id);
        if ($configured !== null) {
            return $configured;
        }

        return $this->fallbackDecision($fromStatus, $toStatus);
    }

    /**
     * @return array{type:string,reason:?string}|null
     */
    private function configuredDecision(?int $fromStatusId, ?int $toStatusId): ?array
    {
        if ($toStatusId === null) {
            return null;
        }

        $transition = AssetStatusTransition::query()
            ->where('to_status_id', $toStatusId)
            ->where(function ($query) use ($fromStatusId): void {
                $query->where('from_status_id', $fromStatusId);

                if ($fromStatusId !== null) {
                    $query->orWhereNull('from_status_id');
                }
            })
            ->orderByRaw('from_status_id is null')
            ->first(['transition_type', 'reason']);

        if ($transition === null) {
            return null;
        }

        return [
            'type' => $transition->transition_type,
            'reason' => $transition->reason,
        ];
    }

    /**
     * @return array{type:string,reason:?string}
     */
    private function fallbackDecision(?AssetStatus $fromStatus, ?AssetStatus $toStatus): array
    {
        $fromCode = strtolower((string) ($fromStatus?->code ?? ''));
        $toCode = strtolower((string) ($toStatus?->code ?? ''));

        if ($toCode === '' || $fromCode === $toCode) {
            return ['type' => 'allowed', 'reason' => null];
        }

        if (in_array($fromCode, ['disposed', 'disposal'], true) && ! in_array($toCode, ['disposed', 'disposal'], true)) {
            return [
                'type' => 'blocked',
                'reason' => __('assets.lifecycle.transitions.blocked_from_disposed'),
            ];
        }

        if (in_array($toCode, ['disposed', 'disposal'], true) && ! in_array($fromCode, ['disposed', 'disposal', 'retired', 'inactive'], true)) {
            return [
                'type' => 'discouraged',
                'reason' => __('assets.lifecycle.transitions.discouraged_direct_disposal'),
            ];
        }

        return ['type' => 'allowed', 'reason' => null];
    }
}
