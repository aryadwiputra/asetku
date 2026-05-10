<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Http\Requests\DataTableRequest;
use App\Services\Reports\MaintenanceCostReportService;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class MaintenanceCostReportController extends Controller
{
    public function index(DataTableRequest $request, MaintenanceCostReportService $reports): Response
    {
        Gate::authorize('viewMaintenanceReport');

        $user = $request->user();
        if ($user === null) {
            abort(401);
        }

        $filters = $this->filters($request);

        return Inertia::render('reports/maintenance-costs/index', [
            'filters' => $filters,
            'summary' => $reports->build($user, $filters),
            'filtersMeta' => $reports->filtersMeta($filters),
            'abilities' => [
                'view' => true,
                'export' => Gate::forUser($user)->allows('exportMaintenanceReport'),
            ],
        ]);
    }

    /**
     * @return array<string, string>
     */
    private function filters(DataTableRequest $request): array
    {
        $filters = $request->filters();

        foreach (['date_from', 'date_to'] as $key) {
            $value = $request->query($key);
            if (is_string($value) && $value !== '') {
                $filters[$key] = $value;
            }
        }

        return $filters;
    }
}
