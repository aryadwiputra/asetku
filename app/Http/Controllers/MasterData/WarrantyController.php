<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Http\Requests\DataTableRequest;
use App\Http\Requests\MasterData\StoreWarrantyRequest;
use App\Http\Requests\MasterData\UpdateWarrantyRequest;
use App\Models\Warranty;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class WarrantyController extends Controller
{
    public function index(DataTableRequest $request): Response
    {
        $this->authorize('viewAny', Warranty::class);

        $search = $request->searchQuery();
        $sortBy = $request->sortBy('name');
        $sortDirection = $request->sortDirection('asc');

        $allowedSorts = ['name', 'duration_months', 'created_at'];
        if (! in_array($sortBy, $allowedSorts, true)) {
            $sortBy = 'name';
        }

        $items = Warranty::query()
            ->when(is_string($search) && $search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('notes', 'like', "%{$search}%");
                });
            })
            ->orderBy($sortBy, $sortDirection)
            ->paginate($request->perPage(10))
            ->withQueryString();

        return Inertia::render('master-data/warranties/index', [
            'items' => $items,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Warranty::class);

        return Inertia::render('master-data/warranties/create');
    }

    public function store(StoreWarrantyRequest $request): RedirectResponse
    {
        $this->authorize('create', Warranty::class);

        Warranty::query()->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('warranties.toast.created')]);

        return to_route('master-data.warranties.index');
    }

    public function edit(Warranty $warranty): Response
    {
        $this->authorize('update', $warranty);

        return Inertia::render('master-data/warranties/edit', [
            'item' => $warranty,
        ]);
    }

    public function update(UpdateWarrantyRequest $request, Warranty $warranty): RedirectResponse
    {
        $this->authorize('update', $warranty);

        $warranty->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('warranties.toast.updated')]);

        return to_route('master-data.warranties.index');
    }

    public function destroy(Warranty $warranty): RedirectResponse
    {
        $this->authorize('delete', $warranty);

        $warranty->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('warranties.toast.deleted')]);

        return to_route('master-data.warranties.index');
    }
}
