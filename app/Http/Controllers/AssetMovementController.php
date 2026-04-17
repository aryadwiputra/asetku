<?php

namespace App\Http\Controllers;

use App\Http\Requests\Assets\StoreAssetMovementRequest;
use App\Models\Asset;
use App\Models\AssetLocation;
use App\Models\AssetMedia;
use App\Models\AssetMovement;
use App\Models\Department;
use App\Services\AssetAuditLogger;
use Carbon\CarbonImmutable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AssetMovementController extends Controller
{
    public function store(StoreAssetMovementRequest $request, Asset $asset, AssetAuditLogger $audit): RedirectResponse
    {
        $this->authorize('update', $asset);

        $user = $request->user();
        if ($user === null) {
            abort(401);
        }

        $data = $request->validated();
        $type = (string) $data['type'];

        $performedAt = null;
        if (is_string($data['performed_at'] ?? null) && $data['performed_at'] !== '') {
            $performedAt = CarbonImmutable::parse($data['performed_at']);
        }

        $before = [
            'branch_id' => $asset->branch_id,
            'department_id' => $asset->department_id,
            'asset_location_id' => $asset->asset_location_id,
            'asset_user_id' => $asset->asset_user_id,
        ];

        $toBranchId = $data['to_branch_id'] ?? null;

        if (isset($data['to_department_id'])) {
            $department = Department::query()->findOrFail((int) $data['to_department_id'], ['id', 'branch_id']);
            if ($toBranchId === null) {
                $toBranchId = $department->branch_id;
            } elseif ((int) $toBranchId !== (int) $department->branch_id) {
                throw ValidationException::withMessages([
                    'to_department_id' => [__('assets.lifecycle.validation.department_branch_mismatch')],
                ]);
            }
        }

        if (isset($data['to_location_id'])) {
            $location = AssetLocation::query()->findOrFail((int) $data['to_location_id'], ['id', 'branch_id']);
            if ($toBranchId === null) {
                $toBranchId = $location->branch_id;
            } elseif ((int) $toBranchId !== (int) $location->branch_id) {
                throw ValidationException::withMessages([
                    'to_location_id' => [__('assets.lifecycle.validation.location_branch_mismatch')],
                ]);
            }
        }

        $movement = DB::transaction(function () use ($asset, $user, $data, $type, $performedAt, $toBranchId): AssetMovement {
            /** @var AssetMovement $movement */
            $movement = AssetMovement::query()->create([
                'asset_id' => $asset->id,
                'type' => $type,
                'from_branch_id' => $asset->branch_id,
                'to_branch_id' => $toBranchId,
                'from_location_id' => $asset->asset_location_id,
                'to_location_id' => $data['to_location_id'] ?? null,
                'from_department_id' => $asset->department_id,
                'to_department_id' => $data['to_department_id'] ?? null,
                'from_asset_user_id' => $asset->asset_user_id,
                'to_asset_user_id' => $type === 'return' ? null : ($data['to_asset_user_id'] ?? null),
                'notes' => $data['notes'] ?? null,
                'moved_by' => $user->id,
                'performed_at' => $performedAt,
                // approval columns exist but v1 defaults are fine (approved)
            ]);

            $asset->forceFill([
                'branch_id' => $toBranchId ?? $asset->branch_id,
                'department_id' => $data['to_department_id'] ?? $asset->department_id,
                'asset_location_id' => $data['to_location_id'] ?? $asset->asset_location_id,
                'asset_user_id' => match ($type) {
                    'borrow' => $data['to_asset_user_id'],
                    'return' => null,
                    default => $data['to_asset_user_id'] ?? $asset->asset_user_id,
                },
            ])->save();

            if (isset($data['media_asset_id'])) {
                $stage = $data['stage'] ?? null;
                $documentType = $data['document_type'] ?? null;

                if (! is_string($stage) || $stage === '') {
                    $stage = match ($type) {
                        'placement' => 'placement',
                        'borrow', 'return' => 'usage',
                        default => 'mutation',
                    };
                }

                AssetMedia::query()->create([
                    'asset_id' => $asset->id,
                    'media_asset_id' => (int) $data['media_asset_id'],
                    'kind' => 'document',
                    'stage' => $stage,
                    'document_type' => is_string($documentType) && $documentType !== '' ? $documentType : 'other',
                    'sort_order' => (int) (AssetMedia::query()->where('asset_id', $asset->id)->where('kind', 'document')->max('sort_order') ?? 0) + 1,
                    'is_primary' => false,
                ]);
            }

            return $movement;
        });

        $after = [
            'branch_id' => $asset->branch_id,
            'department_id' => $asset->department_id,
            'asset_location_id' => $asset->asset_location_id,
            'asset_user_id' => $asset->asset_user_id,
        ];

        $audit->logMovement(
            asset: $asset,
            actor: $user,
            type: $type,
            performedAt: $performedAt,
            before: $before,
            after: $after,
            payload: ['movement_id' => $movement->id],
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => __('assets.lifecycle.toast.movement_recorded')]);

        return back();
    }
}
