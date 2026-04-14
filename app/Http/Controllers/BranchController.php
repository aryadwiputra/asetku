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
        return Inertia::render('branches/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBranchRequest $request): RedirectResponse
    {
        $branch = Branch::query()->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Branch created.']);

        return to_route('branches.show', $branch);
    }

    /**
     * Display the specified resource.
     */
    public function show(Branch $branch): Response
    {
        return Inertia::render('branches/show', [
            'branch' => $branch,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Branch $branch): Response
    {
        return Inertia::render('branches/edit', [
            'branch' => $branch,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBranchRequest $request, Branch $branch): RedirectResponse
    {
        $branch->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Branch updated.']);

        return to_route('branches.show', $branch);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Branch $branch): RedirectResponse
    {
        $branch->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Branch deleted.']);

        return to_route('branches.index');
    }
}
