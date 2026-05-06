<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDepreciationRunRequest;
use App\Jobs\RunDepreciationJob;
use App\Models\AssetDepreciationRun;
use Carbon\CarbonImmutable;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class DepreciationRunController extends Controller
{
    public function store(StoreDepreciationRunRequest $request): RedirectResponse
    {
        $this->authorize('create', AssetDepreciationRun::class);

        $user = $request->user();
        if ($user === null) {
            abort(401);
        }

        $organizationId = $user->current_organization_id ?? $user->organization_id;
        if ($organizationId === null) {
            abort(403);
        }

        $month = (string) $request->validated('month');
        [$year, $monthNumber] = explode('-', $month, 2);

        $periodStart = CarbonImmutable::createFromDate((int) $year, (int) $monthNumber, 1)->startOfDay();
        $periodEnd = $periodStart->endOfMonth()->endOfDay();

        $run = AssetDepreciationRun::query()->firstOrCreate(
            [
                'period' => 'monthly',
                'period_end' => $periodEnd->toDateString(),
            ],
            [
                'period_start' => $periodStart->toDateString(),
                'status' => 'queued',
                'requested_by' => $user->id,
                'meta' => null,
                'error_message' => null,
            ],
        );

        if ($run->status === 'failed') {
            $run->forceFill([
                'status' => 'queued',
                'requested_by' => $user->id,
                'error_message' => null,
            ])->saveQuietly();
        }

        if ($run->status === 'queued' && ($run->wasRecentlyCreated || $run->wasChanged('status'))) {
            RunDepreciationJob::dispatch($run->id);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('depreciation.toast.run_queued')]);

        return to_route('depreciation.index');
    }
}
