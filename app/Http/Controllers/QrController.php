<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\AssetHistory;
use App\Models\AssetMedia;
use App\Models\Organization;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QrController extends Controller
{
    public function show(Request $request, string $token): Response
    {
        $token = trim($token);
        abort_unless($token !== '', 404);

        $asset = Asset::query()
            ->withoutGlobalScope('organization')
            ->where('qr_token', $token)
            ->with([
                'organization' => fn ($query) => $query
                    ->withoutGlobalScope('organization')
                    ->select(['id', 'name', 'slug', 'currency_code', 'timezone', 'is_active']),
                'branch' => fn ($query) => $query->withoutGlobalScope('organization')->select(['id', 'organization_id', 'name', 'code']),
                'department' => fn ($query) => $query->withoutGlobalScope('organization')->select(['id', 'organization_id', 'branch_id', 'name', 'code']),
                'status' => fn ($query) => $query->withoutGlobalScope('organization')->select(['id', 'organization_id', 'name', 'code']),
                'condition' => fn ($query) => $query->withoutGlobalScope('organization')->select(['id', 'organization_id', 'name', 'code']),
                'category' => fn ($query) => $query->withoutGlobalScope('organization')->select(['id', 'organization_id', 'parent_id', 'name', 'code']),
                'location' => fn ($query) => $query->withoutGlobalScope('organization')->select(['id', 'organization_id', 'branch_id', 'parent_id', 'name', 'code', 'type']),
                'personInCharge' => fn ($query) => $query->withoutGlobalScope('organization')->select(['id', 'organization_id', 'name', 'email', 'phone']),
                'user' => fn ($query) => $query->withoutGlobalScope('organization')->select(['id', 'organization_id', 'name', 'email', 'phone']),
                'class' => fn ($query) => $query->withoutGlobalScope('organization')->select(['id', 'organization_id', 'name', 'code']),
                'unit' => fn ($query) => $query->withoutGlobalScope('organization')->select(['id', 'organization_id', 'name', 'symbol']),
                'warranty' => fn ($query) => $query->withoutGlobalScope('organization')->select(['id', 'organization_id', 'name', 'duration_months', 'notes']),
                'vendorContract' => fn ($query) => $query->withoutGlobalScope('organization')->select(['id', 'organization_id', 'vendor_name', 'contract_number', 'notes', 'start_date', 'end_date']),
            ])
            ->first();

        if ($asset === null) {
            throw new ModelNotFoundException;
        }

        $user = $request->user();
        $canViewFull = false;
        if ($user !== null && (int) $user->current_organization_id === (int) $asset->organization_id) {
            $canViewFull = $user->can('view', $asset);
        }

        return Inertia::render('qr/show', [
            'asset' => $this->serializeAsset($asset),
            'attachments' => $this->serializeAttachments($asset),
            'histories' => $this->serializeHistories($asset),
            'organization' => $this->serializeOrganization($asset->organization),
            'canViewFull' => $canViewFull,
            'assetId' => $canViewFull ? $asset->id : null,
            'isAuthenticated' => $user !== null,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function serializeAsset(Asset $asset): array
    {
        return [
            'id' => $asset->id,
            'organization_id' => $asset->organization_id,
            'code' => $asset->code,
            'name' => $asset->name,
            'description' => $asset->description,
            'brand' => $asset->brand,
            'model' => $asset->model,
            'series' => $asset->series,
            'serial_number' => $asset->serial_number,
            'imei' => $asset->imei,
            'purchase_date' => $asset->purchase_date?->toDateString(),
            'warranty_end' => $asset->warranty_end?->toDateString(),
            'cost' => $asset->cost,
            'depreciation_method' => $asset->depreciation_method,
            'useful_life_months' => $asset->useful_life_months,
            'residual_value' => $asset->residual_value,
            'book_value_cached' => $asset->book_value_cached,
            'computed_book_value' => $asset->bookValue(),
            'capex_opex' => $asset->capex_opex,
            'metadata' => $asset->metadata,
            'latitude' => $asset->latitude,
            'longitude' => $asset->longitude,
            'rfid_tag' => $asset->rfid_tag,
            'nfc_tag' => $asset->nfc_tag,
            'label_template' => $asset->label_template,
            'is_consumable' => (bool) $asset->is_consumable,
            'quantity' => $asset->quantity,
            'available_quantity' => $asset->available_quantity,
            'is_pool' => (bool) $asset->is_pool,
            'archived_at' => $asset->archived_at?->toIso8601String(),
            'retention_until' => $asset->retention_until?->toDateString(),
            'updated_at' => $asset->updated_at?->toIso8601String(),
            'created_at' => $asset->created_at?->toIso8601String(),
            'status' => $asset->status ? [
                'id' => $asset->status->id,
                'name' => $asset->status->name,
                'code' => $asset->status->code,
            ] : null,
            'condition' => $asset->condition ? [
                'id' => $asset->condition->id,
                'name' => $asset->condition->name,
                'code' => $asset->condition->code,
            ] : null,
            'class' => $asset->class ? [
                'id' => $asset->class->id,
                'name' => $asset->class->name,
                'code' => $asset->class->code,
            ] : null,
            'category' => $asset->category ? [
                'id' => $asset->category->id,
                'name' => $asset->category->name,
                'code' => $asset->category->code,
            ] : null,
            'unit' => $asset->unit ? [
                'id' => $asset->unit->id,
                'name' => $asset->unit->name,
                'symbol' => $asset->unit->symbol,
            ] : null,
            'branch' => $asset->branch ? [
                'id' => $asset->branch->id,
                'name' => $asset->branch->name,
                'code' => $asset->branch->code,
            ] : null,
            'department' => $asset->department ? [
                'id' => $asset->department->id,
                'name' => $asset->department->name,
                'code' => $asset->department->code,
            ] : null,
            'location' => $asset->location ? [
                'id' => $asset->location->id,
                'name' => $asset->location->name,
                'code' => $asset->location->code,
                'type' => $asset->location->type,
            ] : null,
            'person_in_charge' => $asset->personInCharge ? [
                'id' => $asset->personInCharge->id,
                'name' => $asset->personInCharge->name,
                'email' => $asset->personInCharge->email,
                'phone' => $asset->personInCharge->phone,
            ] : null,
            'user' => $asset->user ? [
                'id' => $asset->user->id,
                'name' => $asset->user->name,
                'email' => $asset->user->email,
                'phone' => $asset->user->phone,
            ] : null,
            'warranty' => $asset->warranty ? [
                'id' => $asset->warranty->id,
                'name' => $asset->warranty->name,
                'duration_months' => $asset->warranty->duration_months,
                'provider_name' => null,
                'description' => $asset->warranty->notes,
            ] : null,
            'vendor_contract' => $asset->vendorContract ? [
                'id' => $asset->vendorContract->id,
                'vendor_name' => $asset->vendorContract->vendor_name,
                'contract_number' => $asset->vendorContract->contract_number,
                'description' => $asset->vendorContract->notes,
                'start_date' => $asset->vendorContract->start_date?->toDateString(),
                'end_date' => $asset->vendorContract->end_date?->toDateString(),
            ] : null,
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function serializeAttachments(Asset $asset): array
    {
        return AssetMedia::query()
            ->withoutGlobalScope('organization')
            ->where('asset_id', $asset->id)
            ->with(['mediaAsset' => fn ($query) => $query->withoutGlobalScope('organization')])
            ->orderBy('kind')
            ->orderBy('sort_order')
            ->get()
            ->map(function (AssetMedia $row): array {
                $mediaAsset = $row->mediaAsset;
                $media = $mediaAsset?->getFirstMedia('file');

                return [
                    'id' => $row->id,
                    'kind' => $row->kind,
                    'sort_order' => $row->sort_order,
                    'is_primary' => (bool) $row->is_primary,
                    'media_asset' => $mediaAsset ? [
                        'id' => $mediaAsset->id,
                        'title' => $mediaAsset->title,
                        'url' => $mediaAsset->getFirstMediaUrl('file'),
                        'thumb_url' => $mediaAsset->getFirstMediaUrl('file', 'thumb'),
                        'mime' => $media?->mime_type,
                        'size' => $media?->size,
                    ] : null,
                ];
            })
            ->all();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function serializeHistories(Asset $asset): array
    {
        return AssetHistory::query()
            ->withoutGlobalScope('organization')
            ->where('asset_id', $asset->id)
            ->with('changedBy:id,name')
            ->latest()
            ->limit(20)
            ->get(['id', 'action', 'description', 'changed_by', 'payload', 'created_at'])
            ->map(fn (AssetHistory $history): array => [
                'id' => $history->id,
                'action' => $history->action,
                'description' => $history->description,
                'changed_by' => $history->changed_by,
                'actor' => $history->changedBy ? [
                    'id' => $history->changedBy->id,
                    'name' => $history->changedBy->name,
                ] : null,
                'payload' => $history->payload,
                'created_at' => $history->created_at?->toIso8601String(),
            ])
            ->all();
    }

    /**
     * @return array<string, mixed>|null
     */
    private function serializeOrganization(?Organization $organization): ?array
    {
        if ($organization === null) {
            return null;
        }

        return [
            'id' => $organization->id,
            'name' => $organization->name,
            'slug' => $organization->slug,
            'currency_code' => $organization->currency_code,
            'timezone' => $organization->timezone,
            'is_active' => (bool) $organization->is_active,
        ];
    }
}
