<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Http\Requests\DataTableRequest;
use App\Http\Requests\MasterData\StoreDepartmentRequest;
use App\Http\Requests\MasterData\UpdateDepartmentRequest;
use App\Models\Branch;
use App\Models\Department;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DepartmentController extends Controller
{
    public function index(DataTableRequest $request): Response
    {
        $this->authorize('viewAny', Department::class);

        $search = $request->searchQuery();
        $sortBy = $request->sortBy('name');
        $sortDirection = $request->sortDirection('asc');

        $allowedSorts = ['name', 'code', 'created_at'];
        if (! in_array($sortBy, $allowedSorts, true)) {
            $sortBy = 'name';
        }

        $items = Department::query()
            ->with('branch:id,name,code')
            ->when(is_string($search) && $search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('departments.name', 'like', "%{$search}%")
                        ->orWhere('departments.code', 'like', "%{$search}%")
                        ->orWhere('departments.description', 'like', "%{$search}%")
                        ->orWhereHas('branch', fn ($branch) => $branch->where('name', 'like', "%{$search}%")->orWhere('code', 'like', "%{$search}%"));
                });
            })
            ->orderBy($sortBy, $sortDirection)
            ->paginate($request->perPage(10))
            ->withQueryString();

        return Inertia::render('master-data/departments/index', [
            'items' => $items,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Department::class);

        $branches = Branch::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'code']);

        return Inertia::render('master-data/departments/create', [
            'branches' => $branches,
        ]);
    }

    public function store(StoreDepartmentRequest $request): RedirectResponse
    {
        $this->authorize('create', Department::class);

        Department::query()->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('departments.toast.created')]);

        return to_route('master-data.departments.index');
    }

    public function edit(Department $department): Response
    {
        $this->authorize('update', $department);

        $branches = Branch::query()
            ->orderBy('name')
            ->get(['id', 'name', 'code', 'is_active']);

        return Inertia::render('master-data/departments/edit', [
            'item' => $department,
            'branches' => $branches,
        ]);
    }

    public function update(UpdateDepartmentRequest $request, Department $department): RedirectResponse
    {
        $this->authorize('update', $department);

        $department->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('departments.toast.updated')]);

        return to_route('master-data.departments.index');
    }

    public function destroy(Department $department): RedirectResponse
    {
        $this->authorize('delete', $department);

        $department->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('departments.toast.deleted')]);

        return to_route('master-data.departments.index');
    }
}
