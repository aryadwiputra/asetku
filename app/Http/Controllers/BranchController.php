<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBranchRequest;
use App\Http\Requests\UpdateBranchRequest;
use App\Models\Branch;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BranchController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $this->authorize('viewAny', Branch::class);

        $branches = Branch::query()
            ->orderBy('name')
            ->get([
                'id',
                'name',
                'code',
                'is_active',
                'address',
                'pic_name',
                'pic_email',
                'pic_phone',
                'latitude',
                'longitude',
            ]);

        return Inertia::render('branches/index', [
            'branches' => $branches,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $this->authorize('create', Branch::class);

        return Inertia::render('branches/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBranchRequest $request): RedirectResponse
    {
        $this->authorize('create', Branch::class);

        $branch = Branch::query()->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Branch created.']);

        return to_route('branches.show', $branch);
    }

    /**
     * Display the specified resource.
     */
    public function show(Branch $branch): Response
    {
        $this->authorize('view', $branch);

        return Inertia::render('branches/show', [
            'branch' => $branch,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Branch $branch): Response
    {
        $this->authorize('update', $branch);

        return Inertia::render('branches/edit', [
            'branch' => $branch,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBranchRequest $request, Branch $branch): RedirectResponse
    {
        $this->authorize('update', $branch);

        $branch->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Branch updated.']);

        return to_route('branches.show', $branch);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Branch $branch): RedirectResponse
    {
        $this->authorize('deactivate', $branch);

        $branch->forceFill(['is_active' => false])->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Branch deactivated.']);

        return to_route('branches.index');
    }
}
