<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class OrganizationImportTemplateController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, string $type): StreamedResponse
    {
        $type = Str::lower($type);

        if ($type !== 'branches') {
            abort(404);
        }

        $spreadsheet = new Spreadsheet;
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('branches');
        $sheet->fromArray([
            ['code', 'name', 'address', 'pic_name', 'pic_email', 'pic_phone', 'latitude', 'longitude', 'is_active'],
            ['JKT', 'Jakarta', 'Jl. Sudirman', 'Budi', 'budi@example.com', '08123456789', -6.200000, 106.816666, 1],
        ]);

        $writer = new Xlsx($spreadsheet);

        return response()->streamDownload(function () use ($writer) {
            $writer->save('php://output');
        }, 'template-branches.xlsx', [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }
}
