<?php

namespace App\Http\Controllers;

use App\Models\SavedFilter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AssetSavedFilterController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', SavedFilter::class);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'query' => ['required', 'array'],
            'is_default' => ['nullable', 'boolean'],
        ]);

        $user = $request->user();
        if ($user === null) {
            abort(401);
        }

        DB::transaction(function () use ($data, $user): void {
            $isDefault = (bool) ($data['is_default'] ?? false);

            if ($isDefault) {
                SavedFilter::query()
                    ->where('user_id', $user->id)
                    ->where('entity', 'assets')
                    ->update(['is_default' => false]);
            }

            SavedFilter::query()->create([
                'user_id' => $user->id,
                'entity' => 'assets',
                'name' => $data['name'],
                'query' => $data['query'],
                'is_default' => $isDefault,
            ]);
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('saved_filters.toast.created')]);

        return back();
    }

    public function update(Request $request, SavedFilter $savedFilter): RedirectResponse
    {
        $this->authorize('update', $savedFilter);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'query' => ['required', 'array'],
            'is_default' => ['nullable', 'boolean'],
        ]);

        $user = $request->user();
        if ($user === null) {
            abort(401);
        }

        DB::transaction(function () use ($data, $user, $savedFilter): void {
            $isDefault = (bool) ($data['is_default'] ?? false);

            if ($isDefault) {
                SavedFilter::query()
                    ->where('user_id', $user->id)
                    ->where('entity', 'assets')
                    ->whereKeyNot($savedFilter->id)
                    ->update(['is_default' => false]);
            }

            $savedFilter->forceFill([
                'name' => $data['name'],
                'query' => $data['query'],
                'is_default' => $isDefault,
            ])->save();
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('saved_filters.toast.updated')]);

        return back();
    }

    public function destroy(Request $request, SavedFilter $savedFilter): RedirectResponse
    {
        $this->authorize('delete', $savedFilter);

        $savedFilter->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('saved_filters.toast.deleted')]);

        return back();
    }
}
