<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class QrController extends Controller
{
    public function show(Request $request, string $token): Response
    {
        $token = trim($token);
        abort_unless($token !== '', 404);

        $row = DB::table('assets')
            ->leftJoin('asset_statuses', 'assets.asset_status_id', '=', 'asset_statuses.id')
            ->leftJoin('asset_conditions', 'assets.asset_condition_id', '=', 'asset_conditions.id')
            ->leftJoin('branches', 'assets.branch_id', '=', 'branches.id')
            ->leftJoin('departments', 'assets.department_id', '=', 'departments.id')
            ->leftJoin('asset_locations', 'assets.asset_location_id', '=', 'asset_locations.id')
            ->where('assets.qr_token', $token)
            ->select([
                'assets.id',
                'assets.organization_id',
                'assets.code',
                'assets.name',
                'assets.updated_at',
                'asset_statuses.name as status_name',
                'asset_conditions.name as condition_name',
                'branches.name as branch_name',
                'departments.name as department_name',
                'asset_locations.name as location_name',
            ])
            ->first();

        if ($row === null) {
            throw new ModelNotFoundException;
        }

        $user = $request->user();
        $canViewFull = false;
        $asset = null;

        if ($user !== null && (int) $user->current_organization_id === (int) $row->organization_id) {
            $asset = Asset::query()->where('qr_token', $token)->first();

            if ($asset !== null) {
                $canViewFull = $user->can('view', $asset);
            }
        }

        return Inertia::render('qr/show', [
            'asset' => [
                'id' => (int) $row->id,
                'code' => $row->code,
                'name' => $row->name,
                'status' => $row->status_name,
                'condition' => $row->condition_name,
                'branch' => $row->branch_name,
                'department' => $row->department_name,
                'location' => $row->location_name,
                'updated_at' => $row->updated_at,
            ],
            'canViewFull' => $canViewFull,
            'assetId' => $canViewFull ? $asset?->id : null,
            'isAuthenticated' => $user !== null,
        ]);
    }
}
