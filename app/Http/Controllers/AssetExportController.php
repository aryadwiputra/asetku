<?php

namespace App\Http\Controllers;

use App\Exports\AssetsExport;
use App\Http\Requests\DataTableRequest;
use App\Models\Asset;
use App\Queries\AssetListQuery;
use Illuminate\Support\Facades\View;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class AssetExportController extends Controller
{
    public function export(DataTableRequest $request): BinaryFileResponse
    {
        $this->authorize('viewAny', Asset::class);

        $user = $request->user();
        if ($user === null) {
            abort(401);
        }

        $organizationId = $user->current_organization_id;
        $isManager = $organizationId !== null && $user->hasOrganizationRole((int) $organizationId, ['Owner', 'Admin', 'Manager']);

        abort_unless($user->can('asset.export') || $isManager, 403);

        $format = (string) $request->query('format', 'csv');
        $format = in_array($format, ['csv', 'excel', 'pdf'], true) ? $format : 'csv';

        $query = AssetListQuery::build($user, $request->searchQuery(), $request->filters());

        $sortBy = $request->sortBy('created_at');
        $sortDirection = $request->sortDirection('desc');

        $allowedSorts = ['code', 'name', 'cost', 'purchase_date', 'created_at', 'updated_at'];
        if (! in_array($sortBy, $allowedSorts, true)) {
            $sortBy = 'created_at';
        }

        $query->orderBy($sortBy, $sortDirection);

        return match ($format) {
            'excel' => Excel::download(new AssetsExport($query), 'assets.xlsx'),
            'pdf' => $this->exportPdf($query),
            default => $this->exportCsv($query),
        };
    }

    private function exportCsv($query): BinaryFileResponse
    {
        $fileName = 'assets.csv';
        $tmp = tempnam(sys_get_temp_dir(), 'assets-');

        $out = fopen($tmp, 'wb');
        abort_unless(is_resource($out), 500);

        fputcsv($out, [
            'Code',
            'Name',
            'Category',
            'Status',
            'Condition',
            'Branch',
            'Department',
            'Serial Number',
            'Brand',
            'Model',
            'Purchase Date',
            'Cost',
        ]);

        $query->select([
            'assets.id',
            'assets.code',
            'assets.name',
            'assets.serial_number',
            'assets.brand',
            'assets.model',
            'assets.purchase_date',
            'assets.cost',
            'assets.branch_id',
            'assets.department_id',
            'assets.asset_category_id',
            'assets.asset_status_id',
            'assets.asset_condition_id',
        ])->with([
            'branch:id,name',
            'department:id,name',
            'category:id,name',
            'status:id,name',
            'condition:id,name',
        ])->chunk(500, function ($rows) use ($out): void {
            foreach ($rows as $row) {
                fputcsv($out, [
                    $row->code,
                    $row->name,
                    $row->category?->name,
                    $row->status?->name,
                    $row->condition?->name,
                    $row->branch?->name,
                    $row->department?->name,
                    $row->serial_number,
                    $row->brand,
                    $row->model,
                    $row->purchase_date?->format('Y-m-d'),
                    $row->cost,
                ]);
            }
        });

        fclose($out);

        return response()->download($tmp, $fileName)->deleteFileAfterSend();
    }

    private function exportPdf($query): BinaryFileResponse
    {
        $rows = $query->select([
            'assets.id',
            'assets.code',
            'assets.name',
            'assets.serial_number',
            'assets.brand',
            'assets.model',
            'assets.purchase_date',
            'assets.cost',
            'assets.branch_id',
            'assets.department_id',
            'assets.asset_category_id',
            'assets.asset_status_id',
            'assets.asset_condition_id',
        ])->with([
            'branch:id,name',
            'department:id,name',
            'category:id,name',
            'status:id,name',
            'condition:id,name',
        ])->limit(2000)->get();

        $html = View::make('exports.assets', ['rows' => $rows])->render();

        $pdf = app('dompdf.wrapper');
        $pdf->loadHTML($html);

        $tmp = tempnam(sys_get_temp_dir(), 'assets-').'.pdf';
        file_put_contents($tmp, $pdf->output());

        return response()->download($tmp, 'assets.pdf')->deleteFileAfterSend();
    }
}
