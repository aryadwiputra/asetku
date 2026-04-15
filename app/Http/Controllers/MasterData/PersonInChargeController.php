<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Http\Requests\DataTableRequest;
use App\Http\Requests\MasterData\StorePersonInChargeRequest;
use App\Http\Requests\MasterData\UpdatePersonInChargeRequest;
use App\Models\PersonInCharge;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PersonInChargeController extends Controller
{
    public function index(DataTableRequest $request): Response
    {
        $this->authorize('viewAny', PersonInCharge::class);

        $search = $request->searchQuery();
        $sortBy = $request->sortBy('name');
        $sortDirection = $request->sortDirection('asc');

        $allowedSorts = ['name', 'email', 'created_at'];
        if (! in_array($sortBy, $allowedSorts, true)) {
            $sortBy = 'name';
        }

        $items = PersonInCharge::query()
            ->when(is_string($search) && $search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhere('notes', 'like', "%{$search}%");
                });
            })
            ->orderBy($sortBy, $sortDirection)
            ->paginate($request->perPage(10))
            ->withQueryString();

        return Inertia::render('master-data/person-in-charges/index', [
            'items' => $items,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', PersonInCharge::class);

        return Inertia::render('master-data/person-in-charges/create');
    }

    public function store(StorePersonInChargeRequest $request): RedirectResponse
    {
        $this->authorize('create', PersonInCharge::class);

        PersonInCharge::query()->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('person_in_charges.toast.created')]);

        return to_route('master-data.person-in-charges.index');
    }

    public function edit(PersonInCharge $personInCharge): Response
    {
        $this->authorize('update', $personInCharge);

        return Inertia::render('master-data/person-in-charges/edit', [
            'item' => $personInCharge,
        ]);
    }

    public function update(UpdatePersonInChargeRequest $request, PersonInCharge $personInCharge): RedirectResponse
    {
        $this->authorize('update', $personInCharge);

        $personInCharge->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('person_in_charges.toast.updated')]);

        return to_route('master-data.person-in-charges.index');
    }

    public function destroy(PersonInCharge $personInCharge): RedirectResponse
    {
        $this->authorize('delete', $personInCharge);

        $personInCharge->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('person_in_charges.toast.deleted')]);

        return to_route('master-data.person-in-charges.index');
    }
}
