<?php

namespace App\Http\Controllers;

use App\Http\Requests\DecideAssetDisposalRequest;
use App\Models\AssetDisposal;
use App\Services\AssetDisposalService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class AssetDisposalApprovalController extends Controller
{
    public function approve(DecideAssetDisposalRequest $request, AssetDisposal $disposal, AssetDisposalService $service): RedirectResponse
    {
        $this->authorize('approve', $disposal);

        $user = $request->user();
        if ($user === null) {
            abort(401);
        }

        $service->approve($disposal, $user, $request->validated('notes'));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('disposals.toast.approved_step')]);

        return back();
    }

    public function reject(DecideAssetDisposalRequest $request, AssetDisposal $disposal, AssetDisposalService $service): RedirectResponse
    {
        $this->authorize('approve', $disposal);

        $user = $request->user();
        if ($user === null) {
            abort(401);
        }

        $service->reject($disposal, $user, $request->validated('notes'));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('disposals.toast.rejected')]);

        return back();
    }
}
