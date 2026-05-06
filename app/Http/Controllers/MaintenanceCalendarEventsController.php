<?php

namespace App\Http\Controllers;

use App\Models\MaintenanceSchedule;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class MaintenanceCalendarEventsController extends Controller
{
    /**
     * @return JsonResponse<array<int, array<string, mixed>>>
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', MaintenanceSchedule::class);

        $start = $request->query('start');
        $end = $request->query('end');

        if (! is_string($start) || ! is_string($end) || trim($start) === '' || trim($end) === '') {
            abort(422);
        }

        $startDate = Carbon::parse($start)->startOfDay();
        $endDate = Carbon::parse($end)->endOfDay();

        $filters = [
            'branch_id' => $request->query('branch_id'),
            'asset_category_id' => $request->query('asset_category_id'),
            'assigned_to' => $request->query('assigned_to'),
            'q' => $request->query('q'),
        ];

        $query = MaintenanceSchedule::query()
            ->with([
                'asset:id,code,name,branch_id,asset_category_id',
                'asset.branch:id,name,code',
                'asset.category:id,name,code,parent_id',
                'technician:id,name',
            ])
            ->where('is_active', true);

        if (is_numeric($filters['assigned_to'] ?? null)) {
            $query->where('assigned_to', (int) $filters['assigned_to']);
        }

        if (is_numeric($filters['branch_id'] ?? null)) {
            $query->whereHas('asset', fn (Builder $q) => $q->where('branch_id', (int) $filters['branch_id']));
        }

        if (is_numeric($filters['asset_category_id'] ?? null)) {
            $query->whereHas('asset', fn (Builder $q) => $q->where('asset_category_id', (int) $filters['asset_category_id']));
        }

        $search = is_string($filters['q'] ?? null) ? trim((string) $filters['q']) : '';
        if ($search !== '') {
            $query->where(function (Builder $q) use ($search): void {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhereHas('asset', fn (Builder $assetQ) => $assetQ->where('code', 'like', "%{$search}%")->orWhere('name', 'like', "%{$search}%"));
            });
        }

        $schedules = $query
            ->orderBy('next_due_at')
            ->get();

        $today = now()->startOfDay();
        $events = [];

        foreach ($schedules as $schedule) {
            if (! $schedule->asset || ! $schedule->next_due_at) {
                continue;
            }

            $intervalDays = (int) $schedule->interval_days;
            if ($intervalDays <= 0) {
                continue;
            }

            $occurrence = $schedule->next_due_at->copy()->startOfDay();

            if ($occurrence->lt($startDate)) {
                $diff = $occurrence->diffInDays($startDate);
                $steps = intdiv($diff + $intervalDays - 1, $intervalDays);
                $occurrence = $occurrence->addDays($steps * $intervalDays)->startOfDay();
            }

            $count = 0;
            while ($occurrence->lte($endDate) && $count < 60) {
                $events[] = [
                    'id' => $schedule->id.'-'.$occurrence->format('Ymd'),
                    'scheduleId' => $schedule->id,
                    'title' => $schedule->asset->code.' • '.$schedule->name,
                    'start' => $occurrence->toDateString(),
                    'allDay' => true,
                    'meta' => [
                        'priority' => $schedule->default_priority,
                        'asset' => [
                            'id' => $schedule->asset->id,
                            'code' => $schedule->asset->code,
                            'name' => $schedule->asset->name,
                        ],
                        'branch' => $schedule->asset->branch ? [
                            'id' => $schedule->asset->branch->id,
                            'name' => $schedule->asset->branch->name,
                            'code' => $schedule->asset->branch->code,
                        ] : null,
                        'category' => $schedule->asset->category ? [
                            'id' => $schedule->asset->category->id,
                            'name' => $schedule->asset->category->name,
                            'code' => $schedule->asset->category->code,
                        ] : null,
                        'technician' => $schedule->technician ? [
                            'id' => $schedule->technician->id,
                            'name' => $schedule->technician->name,
                        ] : null,
                        'overdue' => $occurrence->lt($today),
                    ],
                ];

                $occurrence = $occurrence->copy()->addDays($intervalDays);
                $count++;
            }
        }

        return response()->json($events);
    }
}
