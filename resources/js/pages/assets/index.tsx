import { Head, Link, router, usePage } from '@inertiajs/react';
import { Check, FileDown, Filter, Plus, Printer, Save, Settings2, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import AssetController from '@/actions/App/Http/Controllers/AssetController';
import AssetSavedFilterController from '@/actions/App/Http/Controllers/AssetSavedFilterController';
import Heading from '@/components/heading';
import { DataTable } from '@/components/data-table/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useTranslation } from '@/hooks/use-translation';
import { index as assetsIndex } from '@/routes/assets';
import { exportMethod as assetsExport } from '@/routes/assets';
import { print as printLabels } from '@/routes/assets/labels';
import type { DataTableColumn, PaginatedData, RowAction, BulkAction } from '@/types/datatable';

type Option = { id: number; name: string; code?: string | null; branch_id?: number | null; parent_id?: number | null; is_active?: boolean };

type AssetRow = {
    id: number;
    code: string;
    name: string;
    serial_number: string | null;
    cost: string | number | null;
    purchase_date: string | null;
    branch: { id: number; name: string; code: string } | null;
    department: { id: number; name: string; code: string; branch_id: number } | null;
    status: { id: number; name: string; code: string } | null;
    condition: { id: number; name: string; code: string } | null;
    category: { id: number; name: string; code: string; parent_id: number | null } | null;
    location: { id: number; name: string; code: string; branch_id: number; parent_id: number | null; type: string | null } | null;
    person_in_charge: { id: number; name: string } | null;
    user: { id: number; name: string } | null;
    updated_at: string;
};

type SavedFilter = {
    id: number;
    name: string;
    query: Record<string, string>;
    is_default: boolean;
};

type Props = {
    items: PaginatedData<AssetRow>;
    savedFilters: SavedFilter[];
    filtersMeta: {
        branches: Option[];
        departments: Option[];
        locations: Option[];
        categories: Option[];
        statuses: Option[];
        conditions: Option[];
        pics: Option[];
        assetUsers: Option[];
    };
};

export default function AssetsIndex({ items, savedFilters, filtersMeta }: Props) {
    const { permissions, orgRole } = usePage().props as { permissions: string[]; orgRole: string | null };
    const { t } = useTranslation();

    const canCreate = permissions.includes('asset.create') || ['Owner', 'Admin', 'Manager'].includes(orgRole || '');
    const canUpdate = permissions.includes('asset.update') || ['Owner', 'Admin', 'Manager'].includes(orgRole || '');
    const canDelete = permissions.includes('asset.delete') || ['Owner', 'Admin', 'Manager'].includes(orgRole || '');
    const canExport = permissions.includes('asset.export') || ['Owner', 'Admin', 'Manager'].includes(orgRole || '');

    const urlParams = useMemo(() => new URLSearchParams(window.location.search), []);

    const [costMin, setCostMin] = useState<string>(urlParams.get('filters[cost_min]') ?? '');
    const [costMax, setCostMax] = useState<string>(urlParams.get('filters[cost_max]') ?? '');
    const [branchId, setBranchId] = useState<string>(urlParams.get('filters[branch_id]') ?? '');
    const [departmentId, setDepartmentId] = useState<string>(urlParams.get('filters[department_id]') ?? '');
    const [locationId, setLocationId] = useState<string>(urlParams.get('filters[asset_location_id]') ?? '');
    const [categoryId, setCategoryId] = useState<string>(urlParams.get('filters[asset_category_id]') ?? '');
    const [statusId, setStatusId] = useState<string>(urlParams.get('filters[asset_status_id]') ?? '');
    const [conditionId, setConditionId] = useState<string>(urlParams.get('filters[asset_condition_id]') ?? '');
    const [picId, setPicId] = useState<string>(urlParams.get('filters[person_in_charge_id]') ?? '');
    const [assetUserId, setAssetUserId] = useState<string>(urlParams.get('filters[asset_user_id]') ?? '');

    const [saveFilterOpen, setSaveFilterOpen] = useState(false);
    const [renameFilterOpen, setRenameFilterOpen] = useState(false);
    const [deleteFilterOpen, setDeleteFilterOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<SavedFilter | null>(null);
    const [filterName, setFilterName] = useState('');
    const [setAsDefault, setSetAsDefault] = useState(false);

    const selectFilters = useMemo(
        () => [
            {
                key: 'branch_id',
                label: t('assets.fields.branch'),
                options: (filtersMeta.branches || [])
                    .filter((b) => b.is_active !== false)
                    .map((b) => ({ value: String(b.id), label: `${b.name}${b.code ? ` (${b.code})` : ''}` })),
            },
            {
                key: 'asset_status_id',
                label: t('assets.filters.status'),
                options: (filtersMeta.statuses || []).map((s) => ({ value: String(s.id), label: s.name })),
            },
            {
                key: 'asset_condition_id',
                label: t('assets.filters.condition'),
                options: (filtersMeta.conditions || []).map((c) => ({ value: String(c.id), label: c.name })),
            },
        ],
        [filtersMeta, t],
    );

    const columns: DataTableColumn<AssetRow>[] = [
        { key: 'code', label: t('assets.fields.code'), sortable: true },
        { key: 'name', label: t('assets.fields.name'), sortable: true },
        {
            key: 'branch',
            label: t('assets.fields.branch'),
            sortable: false,
            render: (row) => <span className="text-muted-foreground">{row.branch?.name ?? '—'}</span>,
        },
        {
            key: 'status',
            label: t('assets.fields.status'),
            sortable: false,
            render: (row) =>
                row.status ? <Badge variant="secondary">{row.status.name}</Badge> : <span className="text-muted-foreground">—</span>,
        },
        {
            key: 'condition',
            label: t('assets.fields.condition'),
            sortable: false,
            render: (row) =>
                row.condition ? <Badge>{row.condition.name}</Badge> : <span className="text-muted-foreground">—</span>,
        },
        {
            key: 'updated_at',
            label: t('common.updated'),
            sortable: true,
            render: (row) => <span className="text-muted-foreground">{new Date(row.updated_at).toLocaleDateString()}</span>,
        },
    ];

    const rowActions: RowAction<AssetRow>[] = [
        {
            key: 'view',
            label: t('common.view'),
            icon: <Filter className="mr-2 h-4 w-4" />,
            onClick: (row) => router.visit(AssetController.show.url({ asset: row.id })),
        },
        {
            key: 'edit',
            label: t('common.edit'),
            icon: <Filter className="mr-2 h-4 w-4" />,
            onClick: (row) => router.visit(AssetController.edit.url({ asset: row.id })),
            visible: () => canUpdate,
        },
        {
            key: 'delete',
            label: t('common.delete'),
            icon: <Trash2 className="mr-2 h-4 w-4" />,
            variant: 'destructive',
            onClick: (row) => {
                if (confirm(t('assets.actions.delete_confirm', { code: row.code }))) {
                    router.delete(AssetController.destroy.url({ asset: row.id }));
                }
            },
            visible: () => canDelete,
        },
    ];

    const bulkActions: BulkAction[] = [
        {
            key: 'print_labels',
            label: t('labels.actions.print'),
            icon: <Printer className="mr-2 h-4 w-4" />,
            requireConfirm: false,
        },
    ];

    function onBulkAction(key: string, ids: number[]) {
        if (key === 'print_labels') {
            const url = printLabels({ query: { ids } }).url;
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    }

    function applyCostFilter() {
        const url = new URL(window.location.href);
        const params = url.searchParams;

        if (costMin.trim() !== '') {
            params.set('filters[cost_min]', costMin.trim());
        } else {
            params.delete('filters[cost_min]');
        }

        if (costMax.trim() !== '') {
            params.set('filters[cost_max]', costMax.trim());
        } else {
            params.delete('filters[cost_max]');
        }

        router.get(url.pathname + '?' + params.toString(), {}, { preserveScroll: true, preserveState: true });
    }

    function applyFilters() {
        const url = new URL(window.location.href);
        const params = url.searchParams;

        const map: Record<string, string> = {
            'filters[branch_id]': branchId,
            'filters[department_id]': departmentId,
            'filters[asset_location_id]': locationId,
            'filters[asset_category_id]': categoryId,
            'filters[asset_status_id]': statusId,
            'filters[asset_condition_id]': conditionId,
            'filters[person_in_charge_id]': picId,
            'filters[asset_user_id]': assetUserId,
            'filters[cost_min]': costMin,
            'filters[cost_max]': costMax,
        };

        Object.entries(map).forEach(([k, v]) => {
            if (String(v ?? '').trim() === '') {
                params.delete(k);
            } else {
                params.set(k, String(v).trim());
            }
        });

        router.get(url.pathname + '?' + params.toString(), {}, { preserveScroll: true, preserveState: true });
    }

    function clearAllFilters() {
        const url = new URL(window.location.href);
        const params = url.searchParams;
        Array.from(params.keys()).forEach((k) => {
            if (k === 'search' || k === 'sort_by' || k === 'sort_direction' || k === 'per_page') {
                return;
            }
            if (k.startsWith('filters[')) {
                params.delete(k);
            }
        });

        setCostMin('');
        setCostMax('');
        setBranchId('');
        setDepartmentId('');
        setLocationId('');
        setCategoryId('');
        setStatusId('');
        setConditionId('');
        setPicId('');
        setAssetUserId('');

        router.get(url.pathname + '?' + params.toString(), {}, { preserveScroll: true, preserveState: true });
    }

    function openSaveCurrentFilter() {
        setSelectedFilter(null);
        setFilterName('');
        setSetAsDefault(false);
        setSaveFilterOpen(true);
    }

    function submitSaveCurrentFilter() {
        if (!canCreate) {
            return;
        }

        const params = new URLSearchParams(window.location.search);
        const query: Record<string, string> = {};
        for (const [k, v] of params.entries()) {
            query[k] = v;
        }

        router.post(
            AssetSavedFilterController.store.url(),
            { name: filterName.trim(), query, is_default: setAsDefault },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSaveFilterOpen(false);
                },
            },
        );
    }

    function openRenameSavedFilter(filter: SavedFilter) {
        setSelectedFilter(filter);
        setFilterName(filter.name);
        setSetAsDefault(filter.is_default);
        setRenameFilterOpen(true);
    }

    function submitRenameSavedFilter() {
        if (!selectedFilter) {
            return;
        }

        router.patch(
            AssetSavedFilterController.update.url({ savedFilter: selectedFilter.id }),
            { name: filterName.trim(), query: selectedFilter.query, is_default: setAsDefault },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setRenameFilterOpen(false);
                },
            },
        );
    }

    function openDeleteSavedFilter(filter: SavedFilter) {
        setSelectedFilter(filter);
        setDeleteFilterOpen(true);
    }

    function submitDeleteSavedFilter() {
        if (!selectedFilter) {
            return;
        }

        router.delete(AssetSavedFilterController.destroy.url({ savedFilter: selectedFilter.id }), {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteFilterOpen(false);
            },
        });
    }

    function setDefaultSavedFilter(filter: SavedFilter) {
        router.patch(
            AssetSavedFilterController.update.url({ savedFilter: filter.id }),
            { name: filter.name, query: filter.query, is_default: true },
            { preserveScroll: true },
        );
    }

    function applySavedFilter(filter: SavedFilter) {
        const url = new URL(window.location.href);
        url.search = '';
        const params = new URLSearchParams();

        Object.entries(filter.query || {}).forEach(([k, v]) => {
            if (v === null || v === undefined) {
                return;
            }
            params.set(k, String(v));
        });

        router.get(url.pathname + '?' + params.toString(), {}, { preserveScroll: true });
    }

    const savedDefault = savedFilters.find((f) => f.is_default) ?? null;

    const departmentsForBranch = useMemo(() => {
        if (!branchId) {
            return filtersMeta.departments;
        }

        return filtersMeta.departments.filter((d) => String(d.branch_id) === String(branchId));
    }, [filtersMeta.departments, branchId]);

    const locationsForBranch = useMemo(() => {
        if (!branchId) {
            return filtersMeta.locations;
        }

        return filtersMeta.locations.filter((l) => String(l.branch_id) === String(branchId));
    }, [filtersMeta.locations, branchId]);

    const hasActiveFilters = useMemo(() => {
        const params = new URLSearchParams(window.location.search);
        return Array.from(params.keys()).some((k) => k.startsWith('filters[') && (params.get(k) ?? '') !== '');
    }, [items.current_page]); // re-evaluate on navigation

    const activeFilterCount = useMemo(() => {
        return [
            costMin,
            costMax,
            branchId,
            departmentId,
            locationId,
            categoryId,
            statusId,
            conditionId,
            picId,
            assetUserId,
        ].filter((v) => String(v ?? '').trim() !== '').length;
    }, [assetUserId, branchId, categoryId, conditionId, costMax, costMin, departmentId, locationId, picId, statusId]);

    const filterForm = (
        <Card className="space-y-4 p-4">
            <div className="grid gap-2">
                <Label>{t('assets.fields.branch')}</Label>
                <select
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    value={branchId || ''}
                    onChange={(e) => {
                        setBranchId(e.target.value);
                        setDepartmentId('');
                        setLocationId('');
                    }}
                >
                    <option value="">{t('common.none')}</option>
                    {filtersMeta.branches
                        .filter((b) => b.is_active !== false)
                        .map((b) => (
                            <option key={b.id} value={String(b.id)}>
                                {b.name} {b.code ? `(${b.code})` : ''}
                            </option>
                        ))}
                </select>
            </div>

            <div className="grid gap-2">
                <Label>{t('assets.fields.department')}</Label>
                <select
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    value={departmentId || ''}
                    onChange={(e) => setDepartmentId(e.target.value)}
                >
                    <option value="">{t('common.none')}</option>
                    {departmentsForBranch.map((d) => (
                        <option key={d.id} value={String(d.id)}>
                            {d.name} {d.code ? `(${d.code})` : ''}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid gap-2">
                <Label>{t('assets.fields.location')}</Label>
                <select
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    value={locationId || ''}
                    onChange={(e) => setLocationId(e.target.value)}
                >
                    <option value="">{t('common.none')}</option>
                    {locationsForBranch.map((l) => (
                        <option key={l.id} value={String(l.id)}>
                            {l.name} {l.code ? `(${l.code})` : ''}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid gap-2">
                <Label>{t('assets.fields.category')}</Label>
                <select
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    value={categoryId || ''}
                    onChange={(e) => setCategoryId(e.target.value)}
                >
                    <option value="">{t('common.none')}</option>
                    {filtersMeta.categories.map((c) => (
                        <option key={c.id} value={String(c.id)}>
                            {c.name} {c.code ? `(${c.code})` : ''}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid gap-2">
                <Label>{t('assets.filters.status')}</Label>
                <select
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    value={statusId || ''}
                    onChange={(e) => setStatusId(e.target.value)}
                >
                    <option value="">{t('common.none')}</option>
                    {filtersMeta.statuses.map((s) => (
                        <option key={s.id} value={String(s.id)}>
                            {s.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid gap-2">
                <Label>{t('assets.filters.condition')}</Label>
                <select
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    value={conditionId || ''}
                    onChange={(e) => setConditionId(e.target.value)}
                >
                    <option value="">{t('common.none')}</option>
                    {filtersMeta.conditions.map((c) => (
                        <option key={c.id} value={String(c.id)}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid gap-2">
                <Label>{t('assets.fields.pic')}</Label>
                <select
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    value={picId || ''}
                    onChange={(e) => setPicId(e.target.value)}
                >
                    <option value="">{t('common.none')}</option>
                    {filtersMeta.pics.map((p) => (
                        <option key={p.id} value={String(p.id)}>
                            {p.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid gap-2">
                <Label>{t('assets.fields.asset_user')}</Label>
                <select
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    value={assetUserId || ''}
                    onChange={(e) => setAssetUserId(e.target.value)}
                >
                    <option value="">{t('common.none')}</option>
                    {filtersMeta.assetUsers.map((u) => (
                        <option key={u.id} value={String(u.id)}>
                            {u.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="costMin">{t('assets.filters.cost_min')}</Label>
                <Input id="costMin" value={costMin} onChange={(e) => setCostMin(e.target.value)} inputMode="decimal" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="costMax">{t('assets.filters.cost_max')}</Label>
                <Input id="costMax" value={costMax} onChange={(e) => setCostMax(e.target.value)} inputMode="decimal" />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Button onClick={applyFilters} className="w-full sm:w-auto">
                    {t('common.apply')}
                </Button>
                <Button onClick={clearAllFilters} variant="outline" className="w-full sm:w-auto">
                    {t('common.clear')}
                </Button>
            </div>
        </Card>
    );

    return (
        <>
            <Head title={t('assets.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Heading variant="small" title={t('assets.title')} description={t('assets.description')} />

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                    <Settings2 className="mr-2 h-4 w-4" />
                                    {t('saved_filters.title')}
                                    {savedDefault ? (
                                        <Badge variant="secondary" className="ml-2">
                                            {savedDefault.name}
                                        </Badge>
                                    ) : null}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[260px]">
                                <DropdownMenuLabel>{t('saved_filters.title')}</DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                {savedFilters.length === 0 ? (
                                    <DropdownMenuItem disabled>{t('saved_filters.empty')}</DropdownMenuItem>
                                ) : (
                                    savedFilters.map((filter) => (
                                        <DropdownMenuItem key={filter.id} onClick={() => applySavedFilter(filter)} className="flex items-center justify-between gap-2">
                                            <span className="truncate">{filter.name}</span>
                                            <span className="shrink-0 text-muted-foreground">
                                                {filter.is_default ? <Check className="h-4 w-4" /> : null}
                                            </span>
                                        </DropdownMenuItem>
                                    ))
                                )}

                                <DropdownMenuSeparator />
                                {canCreate ? (
                                    <DropdownMenuItem onClick={openSaveCurrentFilter}>
                                        <Save className="mr-2 h-4 w-4" />
                                        {t('saved_filters.actions.save')}
                                    </DropdownMenuItem>
                                ) : null}

                                {savedFilters.length > 0 ? (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuLabel>{t('saved_filters.actions.manage')}</DropdownMenuLabel>
                                        {savedFilters.map((filter) => (
                                            <DropdownMenuItem key={`manage-${filter.id}`} onClick={() => openRenameSavedFilter(filter)}>
                                                {t('saved_filters.actions.rename', { name: filter.name })}
                                            </DropdownMenuItem>
                                        ))}
                                        {savedFilters.map((filter) => (
                                            <DropdownMenuItem
                                                key={`default-${filter.id}`}
                                                disabled={filter.is_default}
                                                onClick={() => setDefaultSavedFilter(filter)}
                                            >
                                                {t('saved_filters.actions.set_default', { name: filter.name })}
                                            </DropdownMenuItem>
                                        ))}
                                        {savedFilters.map((filter) => (
                                            <DropdownMenuItem
                                                key={`delete-${filter.id}`}
                                                className="text-destructive focus:text-destructive"
                                                onClick={() => openDeleteSavedFilter(filter)}
                                            >
                                                {t('saved_filters.actions.delete', { name: filter.name })}
                                            </DropdownMenuItem>
                                        ))}
                                    </>
                                ) : null}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="sm" className="w-full sm:w-auto lg:hidden">
                                    <Filter className="mr-2 h-4 w-4" />
                                    {t('assets.filters.more')}
                                    {hasActiveFilters ? (
                                        <Badge variant="secondary" className="ml-2">
                                            {activeFilterCount}
                                        </Badge>
                                    ) : null}
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[calc(100vw-1.5rem)] max-w-sm">
                                <SheetHeader>
                                    <SheetTitle>{t('assets.filters.title')}</SheetTitle>
                                </SheetHeader>

                                <div className="mt-6">{filterForm}</div>
                            </SheetContent>
                        </Sheet>

                        {canExport ? (
                            <Link href={assetsExport().url}>
                                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                    <FileDown className="mr-2 h-4 w-4" />
                                    {t('assets.actions.export')}
                                </Button>
                            </Link>
                        ) : null}

                        {canCreate ? (
                            <Button onClick={() => router.visit(AssetController.create.url())} className="w-full sm:w-auto">
                                <Plus className="mr-2 h-4 w-4" />
                                {t('assets.actions.new')}
                            </Button>
                        ) : null}
                    </div>
                </div>

                <div className="flex flex-col gap-6 lg:flex-row">
                    <div className="hidden lg:block lg:w-80">
                        <div className="sticky top-6">
                            <div className="mb-3 flex items-center justify-between">
                                <div className="text-sm font-medium">{t('assets.filters.title')}</div>
                                {activeFilterCount > 0 ? (
                                    <Badge variant="secondary" className="shrink-0">
                                        {activeFilterCount}
                                    </Badge>
                                ) : null}
                            </div>
                            {filterForm}
                        </div>
                    </div>

                    <div className="min-w-0 flex-1">
                        <DataTable
                            tableId="assets"
                            data={items}
                            columns={columns}
                            rowActions={rowActions}
                            bulkActions={bulkActions}
                            onBulkAction={onBulkAction}
                            routePrefix={assetsIndex.url()}
                            filters={selectFilters}
                            exportable={canExport}
                            exportUrl={assetsExport().url}
                            mobileView="cards"
                        />
                    </div>
                </div>
            </div>

            <Dialog open={saveFilterOpen} onOpenChange={setSaveFilterOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('saved_filters.actions.save_title')}</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-2">
                        <Label htmlFor="savedFilterName">{t('saved_filters.actions.name')}</Label>
                        <Input id="savedFilterName" value={filterName} onChange={(e) => setFilterName(e.target.value)} />
                    </div>

                    <label className="mt-3 flex items-center gap-2 text-sm">
                        <Checkbox checked={setAsDefault} onCheckedChange={(v) => setSetAsDefault(Boolean(v))} />
                        <span>{t('saved_filters.actions.is_default')}</span>
                    </label>

                    <DialogFooter className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <Button variant="outline" onClick={() => setSaveFilterOpen(false)} className="w-full sm:w-auto">
                            {t('common.cancel')}
                        </Button>
                        <Button onClick={submitSaveCurrentFilter} disabled={filterName.trim() === ''} className="w-full sm:w-auto">
                            {t('common.save')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={renameFilterOpen} onOpenChange={setRenameFilterOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('saved_filters.actions.rename_title')}</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-2">
                        <Label htmlFor="renameFilterName">{t('saved_filters.actions.name')}</Label>
                        <Input id="renameFilterName" value={filterName} onChange={(e) => setFilterName(e.target.value)} />
                    </div>

                    <label className="mt-3 flex items-center gap-2 text-sm">
                        <Checkbox checked={setAsDefault} onCheckedChange={(v) => setSetAsDefault(Boolean(v))} />
                        <span>{t('saved_filters.actions.is_default')}</span>
                    </label>

                    <DialogFooter className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <Button variant="outline" onClick={() => setRenameFilterOpen(false)} className="w-full sm:w-auto">
                            {t('common.cancel')}
                        </Button>
                        <Button
                            onClick={submitRenameSavedFilter}
                            disabled={filterName.trim() === '' || selectedFilter === null}
                            className="w-full sm:w-auto"
                        >
                            {t('common.save')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={deleteFilterOpen} onOpenChange={setDeleteFilterOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('saved_filters.actions.delete_title')}</DialogTitle>
                    </DialogHeader>

                    <div className="text-sm text-muted-foreground">
                        {selectedFilter ? t('saved_filters.actions.delete_confirm', { name: selectedFilter.name }) : null}
                    </div>

                    <DialogFooter className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <Button variant="outline" onClick={() => setDeleteFilterOpen(false)} className="w-full sm:w-auto">
                            {t('common.cancel')}
                        </Button>
                        <Button variant="destructive" onClick={submitDeleteSavedFilter} disabled={selectedFilter === null} className="w-full sm:w-auto">
                            {t('common.delete')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

AssetsIndex.layout = {
    breadcrumbs: [{ title: 'assets.title', href: assetsIndex() }],
};
