import { Deferred, Head, Link, router, usePage } from '@inertiajs/react';
import { Check, Eye, FileDown, Filter, Pencil, Plus, Printer, Save, Settings2, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import AssetController from '@/actions/App/Http/Controllers/AssetController';
import AssetSavedFilterController from '@/actions/App/Http/Controllers/AssetSavedFilterController';
import Heading from '@/components/heading';
import { DataTable } from '@/components/data-table/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

type SummaryBucket = { id: number | null; name: string; count: number };

type Props = {
    items: PaginatedData<AssetRow>;
    summary: {
        total_count: number;
        total_cost: string;
        by_status: SummaryBucket[];
        by_condition: SummaryBucket[];
    };
    savedFilters?: SavedFilter[];
    filtersMeta?: {
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

export default function AssetsIndex({ items, summary, savedFilters, filtersMeta }: Props) {
    const { permissions, orgRole, organization, locale } = usePage().props as {
        permissions: string[];
        orgRole: string | null;
        organization: { currency_code: string } | null;
        locale: string;
    };
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

    const savedFiltersResolved = savedFilters ?? [];

    const selectFilters = useMemo(
        () => [
            {
                key: 'branch_id',
                label: t('assets.fields.branch'),
                options: (filtersMeta?.branches || [])
                    .filter((b) => b.is_active !== false)
                    .map((b) => ({ value: String(b.id), label: `${b.name}${b.code ? ` (${b.code})` : ''}` })),
            },
            {
                key: 'asset_status_id',
                label: t('assets.filters.status'),
                options: (filtersMeta?.statuses || []).map((s) => ({ value: String(s.id), label: s.name })),
            },
            {
                key: 'asset_condition_id',
                label: t('assets.filters.condition'),
                options: (filtersMeta?.conditions || []).map((c) => ({ value: String(c.id), label: c.name })),
            },
        ],
        [filtersMeta, t],
    );

    const columns: DataTableColumn<AssetRow>[] = [
        {
            key: 'code',
            label: t('assets.fields.code'),
            sortable: true,
            render: (row) => (
                <Link href={AssetController.show.url({ asset: row.id })} className="font-medium hover:underline">
                    {row.code}
                </Link>
            ),
        },
        {
            key: 'name',
            label: t('assets.fields.name'),
            sortable: true,
            render: (row) => <span className="truncate">{row.name}</span>,
        },
        {
            key: 'category',
            label: t('assets.fields.category'),
            sortable: false,
            render: (row) => <span className="text-muted-foreground">{row.category?.name ?? '—'}</span>,
        },
        {
            key: 'location',
            label: t('assets.fields.location'),
            sortable: false,
            render: (row) => <span className="text-muted-foreground">{row.location?.name ?? '—'}</span>,
        },
        {
            key: 'owner',
            label: t('assets.fields.pic'),
            sortable: false,
            render: (row) => (
                <div className="space-y-0.5">
                    <div className="text-sm">{row.person_in_charge?.name ?? '—'}</div>
                    <div className="text-xs text-muted-foreground">{row.user?.name ?? '—'}</div>
                </div>
            ),
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
            key: 'cost',
            label: t('assets.fields.cost'),
            sortable: true,
            render: (row) => {
                const value = row.cost === null ? null : Number(row.cost);
                return (
                    <span className="text-muted-foreground">
                        {value === null || Number.isNaN(value) ? '—' : currencyFormatter.format(value)}
                    </span>
                );
            },
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
            icon: <Eye className="mr-2 h-4 w-4" />,
            onClick: (row) => router.visit(AssetController.show.url({ asset: row.id })),
        },
        {
            key: 'edit',
            label: t('common.edit'),
            icon: <Pencil className="mr-2 h-4 w-4" />,
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

    const savedDefault = savedFiltersResolved.find((f) => f.is_default) ?? null;

    const departmentsForBranch = useMemo(() => {
        const departments = filtersMeta?.departments ?? [];
        if (!branchId) {
            return departments;
        }

        return departments.filter((d) => String(d.branch_id) === String(branchId));
    }, [filtersMeta?.departments, branchId]);

    const locationsForBranch = useMemo(() => {
        const locations = filtersMeta?.locations ?? [];
        if (!branchId) {
            return locations;
        }

        return locations.filter((l) => String(l.branch_id) === String(branchId));
    }, [filtersMeta?.locations, branchId]);

    const hasActiveFilters = useMemo(() => {
        const params = new URLSearchParams(window.location.search);
        return Array.from(params.keys()).some((k) => k.startsWith('filters[') && (params.get(k) ?? '') !== '');
    }, [items.current_page]); // re-evaluate on navigation

    const searchValue = useMemo(() => new URLSearchParams(window.location.search).get('search'), [items.current_page]);

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

    const meta = filtersMeta ?? {
        branches: [],
        departments: [],
        locations: [],
        categories: [],
        statuses: [],
        conditions: [],
        pics: [],
        assetUsers: [],
    };

    const filterForm = filtersMeta ? (
        <Card className="space-y-4 p-4">
            <div className="grid gap-2">
                <CardDescription className="text-xs font-medium text-foreground">{t('assets.filters.groups.structure')}</CardDescription>
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
                    {meta.branches
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
                <CardDescription className="text-xs font-medium text-foreground">{t('assets.filters.groups.classification')}</CardDescription>
                <Label>{t('assets.fields.category')}</Label>
                <select
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    value={categoryId || ''}
                    onChange={(e) => setCategoryId(e.target.value)}
                >
                    <option value="">{t('common.none')}</option>
                    {meta.categories.map((c) => (
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
                    {meta.statuses.map((s) => (
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
                    {meta.conditions.map((c) => (
                        <option key={c.id} value={String(c.id)}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid gap-2">
                <CardDescription className="text-xs font-medium text-foreground">{t('assets.filters.groups.ownership')}</CardDescription>
                <Label>{t('assets.fields.pic')}</Label>
                <select
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    value={picId || ''}
                    onChange={(e) => setPicId(e.target.value)}
                >
                    <option value="">{t('common.none')}</option>
                    {meta.pics.map((p) => (
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
                    {meta.assetUsers.map((u) => (
                        <option key={u.id} value={String(u.id)}>
                            {u.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid gap-2">
                <CardDescription className="text-xs font-medium text-foreground">{t('assets.filters.groups.finance')}</CardDescription>
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
                    {t('assets.filters.clear_all')}
                </Button>
            </div>
        </Card>
    ) : (
        <Card className="space-y-3 p-4">
            <div className="h-4 w-28 rounded bg-muted" />
            <div className="h-10 rounded-md bg-muted" />
            <div className="h-10 rounded-md bg-muted" />
            <div className="h-10 rounded-md bg-muted" />
            <div className="h-4 w-28 rounded bg-muted" />
            <div className="h-10 rounded-md bg-muted" />
            <div className="h-10 rounded-md bg-muted" />
            <div className="h-4 w-28 rounded bg-muted" />
            <div className="h-10 rounded-md bg-muted" />
            <div className="h-10 rounded-md bg-muted" />
            <div className="h-4 w-28 rounded bg-muted" />
            <div className="h-10 rounded-md bg-muted" />
            <div className="h-10 rounded-md bg-muted" />
        </Card>
    );

    const currencyCode = organization?.currency_code || 'IDR';

    const numberFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);

    const currencyFormatter = useMemo(
        () => new Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode, maximumFractionDigits: 0 }),
        [currencyCode, locale],
    );

    function normalizeViewQuery(params: URLSearchParams): Record<string, string> {
        const query: Record<string, string> = {};

        for (const [key, value] of params.entries()) {
            if (key === 'page') {
                continue;
            }
            if (key === 'sort_by' || key === 'sort_direction' || key === 'per_page') {
                continue;
            }

            query[key] = value;
        }

        return query;
    }

    function isSavedFilterActive(filter: SavedFilter): boolean {
        const current = normalizeViewQuery(new URLSearchParams(window.location.search));
        const expected = normalizeViewQuery(
            new URLSearchParams(
                Object.entries(filter.query || {})
                    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
                    .join('&'),
            ),
        );

        const keys = new Set([...Object.keys(current), ...Object.keys(expected)]);
        for (const key of keys) {
            if ((current[key] ?? '') !== (expected[key] ?? '')) {
                return false;
            }
        }

        return true;
    }

    function applyAllAssetsView() {
        const url = new URL(window.location.href);
        const params = url.searchParams;

        Array.from(params.keys()).forEach((k) => {
            if (k === 'sort_by' || k === 'sort_direction' || k === 'per_page') {
                return;
            }
            if (k === 'search' || k.startsWith('filters[') || k === 'page') {
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

    const optionLabels = useMemo(() => {
        return {
            branch: new Map((meta.branches || []).map((b) => [String(b.id), b.name])),
            department: new Map((meta.departments || []).map((d) => [String(d.id), d.name])),
            location: new Map((meta.locations || []).map((l) => [String(l.id), l.name])),
            category: new Map((meta.categories || []).map((c) => [String(c.id), c.name])),
            status: new Map((meta.statuses || []).map((s) => [String(s.id), s.name])),
            condition: new Map((meta.conditions || []).map((c) => [String(c.id), c.name])),
            pic: new Map((meta.pics || []).map((p) => [String(p.id), p.name])),
            assetUser: new Map((meta.assetUsers || []).map((u) => [String(u.id), u.name])),
        };
    }, [meta]);

    const activeFilterChips = useMemo(() => {
        const chips: Array<{ key: string; label: string; value: string }> = [];

        if (branchId) {
            chips.push({ key: 'filters[branch_id]', label: t('assets.fields.branch'), value: optionLabels.branch.get(branchId) ?? branchId });
        }
        if (departmentId) {
            chips.push({
                key: 'filters[department_id]',
                label: t('assets.fields.department'),
                value: optionLabels.department.get(departmentId) ?? departmentId,
            });
        }
        if (locationId) {
            chips.push({
                key: 'filters[asset_location_id]',
                label: t('assets.fields.location'),
                value: optionLabels.location.get(locationId) ?? locationId,
            });
        }
        if (categoryId) {
            chips.push({
                key: 'filters[asset_category_id]',
                label: t('assets.fields.category'),
                value: optionLabels.category.get(categoryId) ?? categoryId,
            });
        }
        if (statusId) {
            chips.push({ key: 'filters[asset_status_id]', label: t('assets.filters.status'), value: optionLabels.status.get(statusId) ?? statusId });
        }
        if (conditionId) {
            chips.push({
                key: 'filters[asset_condition_id]',
                label: t('assets.filters.condition'),
                value: optionLabels.condition.get(conditionId) ?? conditionId,
            });
        }
        if (picId) {
            chips.push({ key: 'filters[person_in_charge_id]', label: t('assets.fields.pic'), value: optionLabels.pic.get(picId) ?? picId });
        }
        if (assetUserId) {
            chips.push({
                key: 'filters[asset_user_id]',
                label: t('assets.fields.asset_user'),
                value: optionLabels.assetUser.get(assetUserId) ?? assetUserId,
            });
        }
        if (costMin.trim() !== '') {
            chips.push({ key: 'filters[cost_min]', label: t('assets.filters.cost_min'), value: costMin });
        }
        if (costMax.trim() !== '') {
            chips.push({ key: 'filters[cost_max]', label: t('assets.filters.cost_max'), value: costMax });
        }

        return chips;
    }, [
        assetUserId,
        branchId,
        categoryId,
        conditionId,
        costMax,
        costMin,
        departmentId,
        locationId,
        optionLabels,
        picId,
        statusId,
        t,
    ]);

    function removeFilterChip(key: string) {
        const url = new URL(window.location.href);
        const params = url.searchParams;
        params.delete(key);
        params.delete('page');

        if (key === 'filters[branch_id]') {
            setBranchId('');
            setDepartmentId('');
            setLocationId('');
            params.delete('filters[department_id]');
            params.delete('filters[asset_location_id]');
        }
        if (key === 'filters[department_id]') {
            setDepartmentId('');
        }
        if (key === 'filters[asset_location_id]') {
            setLocationId('');
        }
        if (key === 'filters[asset_category_id]') {
            setCategoryId('');
        }
        if (key === 'filters[asset_status_id]') {
            setStatusId('');
        }
        if (key === 'filters[asset_condition_id]') {
            setConditionId('');
        }
        if (key === 'filters[person_in_charge_id]') {
            setPicId('');
        }
        if (key === 'filters[asset_user_id]') {
            setAssetUserId('');
        }
        if (key === 'filters[cost_min]') {
            setCostMin('');
        }
        if (key === 'filters[cost_max]') {
            setCostMax('');
        }

        router.get(url.pathname + '?' + params.toString(), {}, { preserveScroll: true, preserveState: true });
    }

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
                                    {t('assets.views.manage')}
                                    {savedDefault ? (
                                        <Badge variant="secondary" className="ml-2">
                                            {savedDefault.name}
                                        </Badge>
                                    ) : null}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[260px]">
                                <DropdownMenuLabel>{t('assets.views.manage')}</DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                {!savedFilters ? (
                                    <DropdownMenuItem disabled>{t('common.loading')}</DropdownMenuItem>
                                ) : savedFiltersResolved.length === 0 ? (
                                    <DropdownMenuItem disabled>{t('saved_filters.empty')}</DropdownMenuItem>
                                ) : (
                                    savedFiltersResolved.map((filter) => (
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

                                {savedFiltersResolved.length > 0 ? (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuLabel>{t('saved_filters.actions.manage')}</DropdownMenuLabel>
                                        {savedFiltersResolved.map((filter) => (
                                            <DropdownMenuItem key={`manage-${filter.id}`} onClick={() => openRenameSavedFilter(filter)}>
                                                {t('saved_filters.actions.rename', { name: filter.name })}
                                            </DropdownMenuItem>
                                        ))}
                                        {savedFiltersResolved.map((filter) => (
                                            <DropdownMenuItem
                                                key={`default-${filter.id}`}
                                                disabled={filter.is_default}
                                                onClick={() => setDefaultSavedFilter(filter)}
                                            >
                                                {t('saved_filters.actions.set_default', { name: filter.name })}
                                            </DropdownMenuItem>
                                        ))}
                                        {savedFiltersResolved.map((filter) => (
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

                <Deferred
                    data={['savedFilters']}
                    fallback={
                        <div className="flex flex-wrap gap-2">
                            <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
                            <div className="h-8 w-32 animate-pulse rounded-md bg-muted" />
                            <div className="h-8 w-28 animate-pulse rounded-md bg-muted" />
                        </div>
                    }
                >
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            size="sm"
                            variant={!hasActiveFilters && !searchValue ? 'default' : 'outline'}
                            onClick={applyAllAssetsView}
                        >
                            {t('assets.views.all')}
                        </Button>

                        {savedFiltersResolved.map((filter) => (
                            <Button
                                key={filter.id}
                                size="sm"
                                variant={isSavedFilterActive(filter) ? 'default' : 'outline'}
                                onClick={() => applySavedFilter(filter)}
                                className="max-w-[220px] justify-start"
                            >
                                <span className="truncate">{filter.name}</span>
                            </Button>
                        ))}
                    </div>
                </Deferred>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="py-4">
                        <CardHeader className="px-4">
                            <CardTitle className="text-sm">{t('assets.kpis.total_assets')}</CardTitle>
                            <CardDescription className="text-xs">{t('assets.kpis.scoped')}</CardDescription>
                        </CardHeader>
                        <CardContent className="px-4">
                            <div className="text-2xl font-semibold">{numberFormatter.format(summary.total_count)}</div>
                        </CardContent>
                    </Card>

                    <Card className="py-4">
                        <CardHeader className="px-4">
                            <CardTitle className="text-sm">{t('assets.kpis.total_value')}</CardTitle>
                            <CardDescription className="text-xs">{currencyCode}</CardDescription>
                        </CardHeader>
                        <CardContent className="px-4">
                            <div className="text-2xl font-semibold">
                                {currencyFormatter.format(Number(summary.total_cost || 0))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="py-4">
                        <CardHeader className="px-4">
                            <CardTitle className="text-sm">{t('assets.kpis.by_status')}</CardTitle>
                        </CardHeader>
                        <CardContent className="px-4">
                            <div className="space-y-1 text-sm">
                                {summary.by_status.length === 0 ? (
                                    <div className="text-muted-foreground">—</div>
                                ) : (
                                    summary.by_status.map((row) => (
                                        <div key={`${row.id ?? 'other'}-${row.name}`} className="flex items-center justify-between gap-3">
                                            <span className="truncate text-muted-foreground">{row.name}</span>
                                            <span className="shrink-0">{numberFormatter.format(row.count)}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="py-4">
                        <CardHeader className="px-4">
                            <CardTitle className="text-sm">{t('assets.kpis.by_condition')}</CardTitle>
                        </CardHeader>
                        <CardContent className="px-4">
                            <div className="space-y-1 text-sm">
                                {summary.by_condition.length === 0 ? (
                                    <div className="text-muted-foreground">—</div>
                                ) : (
                                    summary.by_condition.map((row) => (
                                        <div key={`${row.id ?? 'other'}-${row.name}`} className="flex items-center justify-between gap-3">
                                            <span className="truncate text-muted-foreground">{row.name}</span>
                                            <span className="shrink-0">{numberFormatter.format(row.count)}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
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
                        {activeFilterChips.length > 0 ? (
                            <div className="mb-3 flex flex-wrap items-center gap-2">
                                <div className="mr-1 text-sm text-muted-foreground">
                                    {t('assets.filters.active_count', { count: activeFilterChips.length })}
                                </div>
                                {activeFilterChips.map((chip) => (
                                    <Badge key={chip.key} variant="secondary" className="flex items-center gap-1">
                                        <span className="max-w-[220px] truncate">
                                            {chip.label}: {chip.value}
                                        </span>
                                        <button
                                            type="button"
                                            className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded hover:bg-muted"
                                            onClick={() => removeFilterChip(chip.key)}
                                            aria-label={t('assets.filters.remove')}
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                                <Button variant="ghost" size="sm" onClick={clearAllFilters} className="ml-auto">
                                    {t('assets.filters.clear_all')}
                                </Button>
                            </div>
                        ) : null}

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
