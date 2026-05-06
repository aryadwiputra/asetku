<?php

namespace App\Http\Controllers;

use App\Http\Requests\DataTableRequest;
use App\Http\Requests\StoreMaintenanceChecklistRequest;
use App\Http\Requests\UpdateMaintenanceChecklistRequest;
use App\Models\AssetCategory;
use App\Models\MaintenanceChecklistTemplate;
use App\Models\MaintenanceChecklistTemplateItem;
use App\Services\OrganizationContext;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MaintenanceChecklistController extends Controller
{
    public function index(DataTableRequest $request): Response
    {
        $this->authorize('viewAny', MaintenanceChecklistTemplate::class);

        $search = $request->searchQuery();
        $filters = $request->filters();

        $query = MaintenanceChecklistTemplate::query()
            ->with(['category:id,name,code,parent_id'])
            ->when($filters['active'] ?? null, function (Builder $q, string $active): void {
                if (! in_array($active, ['0', '1'], true)) {
                    return;
                }

                $q->where('is_active', $active === '1');
            });

        $search = is_string($search) ? trim($search) : '';
        if ($search !== '') {
            $query->where('name', 'like', "%{$search}%");
        }

        $items = $query
            ->orderBy('name')
            ->paginate($request->perPage(10))
            ->withQueryString();

        return Inertia::render('maintenance-checklists/index', [
            'items' => $items,
            'filtersMeta' => [
                'activeOptions' => [
                    ['value' => '1', 'label' => __('common.active')],
                    ['value' => '0', 'label' => __('common.inactive')],
                ],
            ],
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', MaintenanceChecklistTemplate::class);

        return Inertia::render('maintenance-checklists/create', [
            'meta' => [
                'categories' => AssetCategory::query()->orderBy('name')->get(['id', 'name', 'code', 'parent_id']),
            ],
        ]);
    }

    public function store(StoreMaintenanceChecklistRequest $request): RedirectResponse
    {
        $this->authorize('create', MaintenanceChecklistTemplate::class);

        $data = $request->validated();

        $template = MaintenanceChecklistTemplate::query()->create([
            'organization_id' => app(OrganizationContext::class)->requireOrganizationId(),
            'asset_category_id' => $data['asset_category_id'] ?? null,
            'name' => $data['name'],
            'is_active' => (bool) ($data['is_active'] ?? true),
            'required_skill' => $data['required_skill'] ?? null,
        ]);

        $this->syncTemplateItems($template, $data['items'] ?? []);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('maintenance_checklists.toast.created')]);

        return to_route('maintenance-checklists.edit', $template);
    }

    public function edit(MaintenanceChecklistTemplate $template): Response
    {
        $this->authorize('update', $template);

        $template->load(['category:id,name,code,parent_id', 'items']);

        return Inertia::render('maintenance-checklists/edit', [
            'template' => $template,
            'meta' => [
                'categories' => AssetCategory::query()->orderBy('name')->get(['id', 'name', 'code', 'parent_id']),
            ],
        ]);
    }

    public function update(UpdateMaintenanceChecklistRequest $request, MaintenanceChecklistTemplate $template): RedirectResponse
    {
        $this->authorize('update', $template);

        $data = $request->validated();

        $template->fill([
            'asset_category_id' => $data['asset_category_id'] ?? null,
            'name' => $data['name'],
            'is_active' => (bool) ($data['is_active'] ?? true),
            'required_skill' => $data['required_skill'] ?? null,
        ])->save();

        $this->syncTemplateItems($template, $data['items'] ?? []);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('maintenance_checklists.toast.updated')]);

        return back();
    }

    public function destroy(MaintenanceChecklistTemplate $template): RedirectResponse
    {
        $this->authorize('delete', $template);

        $template->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('maintenance_checklists.toast.deleted')]);

        return to_route('maintenance-checklists.index');
    }

    /**
     * @param  array<int, array{title: string, is_required?: bool|null, sort_order?: int|null, id?: int|null}>  $items
     */
    private function syncTemplateItems(MaintenanceChecklistTemplate $template, array $items): void
    {
        $existingIds = [];

        foreach ($items as $item) {
            $existing = null;

            if (isset($item['id']) && is_numeric($item['id'])) {
                $existing = MaintenanceChecklistTemplateItem::query()
                    ->where('template_id', $template->id)
                    ->find((int) $item['id']);
            }

            $row = $existing ?? new MaintenanceChecklistTemplateItem;
            $row->template_id = $template->id;
            $row->title = $item['title'];
            $row->is_required = (bool) ($item['is_required'] ?? true);
            $row->sort_order = (int) ($item['sort_order'] ?? 0);
            $row->save();

            $existingIds[] = $row->id;
        }

        MaintenanceChecklistTemplateItem::query()
            ->where('template_id', $template->id)
            ->whereNotIn('id', $existingIds)
            ->delete();
    }
}
