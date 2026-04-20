<?php

namespace App\Http\Controllers;

use App\Models\AssetDisposal;
use App\Models\AssetMedia;
use App\Models\MediaAsset;
use App\Services\AssetAuditLogger;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class AssetDisposalBaController extends Controller
{
    public function show(Request $request, AssetDisposal $disposal, AssetAuditLogger $audit): Response
    {
        $this->authorize('export', $disposal);

        $user = $request->user();
        if ($user === null) {
            abort(401);
        }

        $disposal->load([
            'asset.organization:id,name,slug',
            'asset.branch:id,name,code',
            'asset.department:id,name,code',
            'asset.location:id,name,code',
            'asset.category:id,name,code',
            'asset.personInCharge:id,name',
            'asset.user:id,name',
        ]);

        $asset = $disposal->asset;
        if (! $asset) {
            abort(404);
        }

        $existing = $asset->media()
            ->where('kind', 'document')
            ->where('stage', 'disposal')
            ->where('document_type', 'disposal_report')
            ->with('mediaAsset')
            ->latest('id')
            ->first();

        if ($existing && $existing->mediaAsset && $existing->mediaAsset->getFirstMedia('file')) {
            $media = $existing->mediaAsset->getFirstMedia('file');

            return response()->download(
                $media->getPath(),
                "BA-PENGHAPUSAN-{$asset->code}.pdf",
                ['Content-Type' => 'application/pdf'],
            );
        }

        $documentNumber = sprintf(
            'BA-DISP-%s-%s-%04d',
            strtoupper((string) ($asset->organization?->slug ?? 'ORG')),
            now()->format('Y'),
            (int) $disposal->id,
        );

        $pdf = Pdf::loadView('pdf.disposal-ba', [
            'documentNumber' => $documentNumber,
            'generatedAt' => now(),
            'disposal' => $disposal,
            'asset' => $asset,
            'organization' => $asset->organization ?? null,
        ]);

        $bytes = $pdf->output();

        $mediaAsset = DB::transaction(function () use ($asset, $user, $bytes, $documentNumber, $audit): MediaAsset {
            /** @var MediaAsset $mediaAsset */
            $mediaAsset = MediaAsset::query()->create([
                'title' => "{$documentNumber} • {$asset->code}",
                'uploaded_by' => $user->id,
            ]);

            $mediaAsset
                ->addMediaFromString($bytes)
                ->usingFileName("{$documentNumber}.pdf")
                ->usingName($documentNumber)
                ->toMediaCollection('file');

            AssetMedia::query()->create([
                'asset_id' => $asset->id,
                'media_asset_id' => $mediaAsset->id,
                'kind' => 'document',
                'stage' => 'disposal',
                'document_type' => 'disposal_report',
                'sort_order' => (int) ($asset->media()->where('kind', 'document')->max('sort_order') ?? 0) + 1,
                'is_primary' => false,
            ]);

            $audit->logAttachmentAdded($asset, $user, [
                'kind' => 'document',
                'media_asset_id' => $mediaAsset->id,
                'stage' => 'disposal',
                'document_type' => 'disposal_report',
            ]);

            return $mediaAsset;
        });

        return response($bytes, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="BA-PENGHAPUSAN-'.$asset->code.'.pdf"',
        ]);
    }
}
