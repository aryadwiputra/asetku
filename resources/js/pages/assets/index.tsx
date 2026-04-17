import { Head, Link, router, usePage } from '@inertiajs/react';
import { Activity, Banknote, Box, Check, Eye, FileDown, Filter, Pencil, Plus, Printer, Save, Settings2, Tags, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import AssetController from '@/actions/App/Http/Controllers/AssetController';
import AssetSavedFilterController from '@/actions/App/Http/Controllers/AssetSavedFilterController';
import { DataTable } from '@/components/data-table/data-table';
import Heading from '@/components/heading';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
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
    const pageUrl = usePage().url;
    const { t } = useTranslation();

    const canCreate = permissions.includes('asset.create') || ['Owner', 'Admin', 'Manager'].includes(orgRole || '');
    const canUpdate = permissions.includes('asset.update') || ['Owner', 'Admin', 'Manager'].includes(orgRole || '');
    const canDelete = permissions.includes('asset.delete') || ['Owner', 'Admin', 'Manager'].includes(orgRole || '');
    const canExport = permissions.includes('asset.export') || ['Owner', 'Admin', 'Manager'].includes(orgRole || '');

    const [costMin, setCostMin] = useState<string>('');
    const [costMax, setCostMax] = useState<string>('');
    const [branchId, setBranchId] = useState<string>('');
    const [departmentId, setDepartmentId] = useState<string>('');
    const [locationId, setLocationId] = useState<string>('');
    const [categoryId, setCategoryId] = useState<string>('');
    const [statusId, setStatusId] = useState<string>('');
    const [conditionId, setConditionId] = useState<string>('');
    const [picId, setPicId] = useState<string>('');
    const [assetUserId, setAssetUserId] = useState<string>('');

    const [saveFilterOpen, setSaveFilterOpen] = useState(false);
    const [renameFilterOpen, setRenameFilterOpen] = useState(false);
    const [deleteFilterOpen, setDeleteFilterOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<SavedFilter | null>(null);
    const [filterName, setFilterName] = useState('');
    const [setAsDefault, setSetAsDefault] = useState(false);

    const savedFiltersResolved = savedFilters ?? [];
    const appliedParams = useMemo(() => new URLSearchParams(pageUrl.split('?')[1] ?? ''), [pageUrl]);
    const appliedFilters = useMemo(
        () => ({
            costMin: appliedParams.get('filters[cost_min]') ?? '',
            costMax: appliedParams.get('filters[cost_max]') ?? '',
            branchId: appliedParams.get('filters[branch_id]') ?? '',
            departmentId: appliedParams.get('filters[department_id]') ?? '',
            locationId: appliedParams.get('filters[asset_location_id]') ?? '',
            categoryId: appliedParams.get('filters[asset_category_id]') ?? '',
            statusId: appliedParams.get('filters[asset_status_id]') ?? '',
            conditionId: appliedParams.get('filters[asset_condition_id]') ?? '',
            picId: appliedParams.get('filters[person_in_charge_id]') ?? '',
            assetUserId: appliedParams.get('filters[asset_user_id]') ?? '',
        }),
        [appliedParams],
    );

    useEffect(() => {
        setCostMin(appliedFilters.costMin);
        setCostMax(appliedFilters.costMax);
        setBranchId(appliedFilters.branchId);
        setDepartmentId(appliedFilters.departmentId);
        setLocationId(appliedFilters.locationId);
        setCategoryId(appliedFilters.categoryId);
        setStatusId(appliedFilters.statusId);
        setConditionId(appliedFilters.conditionId);
        setPicId(appliedFilters.picId);
        setAssetUserId(appliedFilters.assetUserId);
    }, [appliedFilters]);

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

    function applyFilters() {
        applyFiltersWith({});
    }

    function applyFiltersWith(next: Partial<{
        costMin: string;
        costMax: string;
        branchId: string;
        departmentId: string;
        locationId: string;
        categoryId: string;
        statusId: string;
        conditionId: string;
        picId: string;
        assetUserId: string;
    }>) {
        const state = {
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
            ...next,
        };

        const url = new URL(window.location.href);
        const params = url.searchParams;

        const map: Record<string, string> = {
            'filters[branch_id]': state.branchId,
            'filters[department_id]': state.departmentId,
            'filters[asset_location_id]': state.locationId,
            'filters[asset_category_id]': state.categoryId,
            'filters[asset_status_id]': state.statusId,
            'filters[asset_condition_id]': state.conditionId,
            'filters[person_in_charge_id]': state.picId,
            'filters[asset_user_id]': state.assetUserId,
            'filters[cost_min]': state.costMin,
            'filters[cost_max]': state.costMax,
        };

        params.delete('page');

        Object.entries(map).forEach(([k, v]) => {
            if (String(v ?? '').trim() === '') {
                params.delete(k);
            } else {
                params.set(k, String(v).trim());
            }
        });

        router.get(
            url.pathname + (params.toString() ? `?${params.toString()}` : ''),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                only: ['items', 'summary', 'savedFilters', 'filtersMeta'],
            },
        );
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

        router.get(
            url.pathname + (params.toString() ? `?${params.toString()}` : ''),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                only: ['items', 'summary', 'savedFilters', 'filtersMeta'],
            },
        );
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

        const params = new URLSearchParams(appliedParams);
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

        router.get(
            url.pathname + (params.toString() ? `?${params.toString()}` : ''),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                only: ['items', 'summary', 'savedFilters', 'filtersMeta'],
            },
        );
    }

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

    const draftFilters = useMemo(
        () => ({
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
        }),
        [assetUserId, branchId, categoryId, conditionId, costMax, costMin, departmentId, locationId, picId, statusId],
    );

    const hasActiveFilters = useMemo(
        () => Object.values(appliedFilters).some((value) => value.trim() !== ''),
        [appliedFilters],
    );

    const hasDraftFilters = useMemo(
        () => Object.values(draftFilters).some((value) => value.trim() !== ''),
        [draftFilters],
    );

    const isDirtyFilters = useMemo(
        () => Object.entries(draftFilters).some(([key, value]) => value !== appliedFilters[key as keyof typeof appliedFilters]),
        [appliedFilters, draftFilters],
    );

    const searchValue = useMemo(() => appliedParams.get('search'), [appliedParams]);

    const activeFilterCount = useMemo(() => {
        return [
            appliedFilters.costMin,
            appliedFilters.costMax,
            appliedFilters.branchId,
            appliedFilters.departmentId,
            appliedFilters.locationId,
            appliedFilters.categoryId,
            appliedFilters.statusId,
            appliedFilters.conditionId,
            appliedFilters.picId,
            appliedFilters.assetUserId,
        ].filter((v) => String(v ?? '').trim() !== '').length;
    }, [appliedFilters]);

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

    const filterSelects = useMemo(() => {
        return {
            branches: meta.branches
                .filter((b) => b.is_active !== false)
                .map((b) => ({ value: String(b.id), label: `${b.name}${b.code ? ` (${b.code})` : ''}` })),
            departments: departmentsForBranch.map((d) => ({ value: String(d.id), label: `${d.name}${d.code ? ` (${d.code})` : ''}` })),
            locations: locationsForBranch.map((l) => ({ value: String(l.id), label: `${l.name}${l.code ? ` (${l.code})` : ''}` })),
            categories: meta.categories.map((c) => ({ value: String(c.id), label: `${c.name}${c.code ? ` (${c.code})` : ''}` })),
            statuses: meta.statuses.map((s) => ({ value: String(s.id), label: s.name })),
            conditions: meta.conditions.map((c) => ({ value: String(c.id), label: c.name })),
            pics: meta.pics.map((p) => ({ value: String(p.id), label: p.name })),
            assetUsers: meta.assetUsers.map((u) => ({ value: String(u.id), label: u.name })),
        };
    }, [departmentsForBranch, locationsForBranch, meta.assetUsers, meta.branches, meta.categories, meta.conditions, meta.pics, meta.statuses]);

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
        const current = normalizeViewQuery(new URLSearchParams(appliedParams));
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

        router.get(
            url.pathname + (params.toString() ? `?${params.toString()}` : ''),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                only: ['items', 'summary', 'savedFilters', 'filtersMeta'],
            },
        );
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

        if (appliedFilters.branchId) {
            chips.push({
                key: 'filters[branch_id]',
                label: t('assets.fields.branch'),
                value: optionLabels.branch.get(appliedFilters.branchId) ?? appliedFilters.branchId,
            });
        }

        if (appliedFilters.departmentId) {
            chips.push({
                key: 'filters[department_id]',
                label: t('assets.fields.department'),
                value: optionLabels.department.get(appliedFilters.departmentId) ?? appliedFilters.departmentId,
            });
        }

        if (appliedFilters.locationId) {
            chips.push({
                key: 'filters[asset_location_id]',
                label: t('assets.fields.location'),
                value: optionLabels.location.get(appliedFilters.locationId) ?? appliedFilters.locationId,
            });
        }

        if (appliedFilters.categoryId) {
            chips.push({
                key: 'filters[asset_category_id]',
                label: t('assets.fields.category'),
                value: optionLabels.category.get(appliedFilters.categoryId) ?? appliedFilters.categoryId,
            });
        }

        if (appliedFilters.statusId) {
            chips.push({
                key: 'filters[asset_status_id]',
                label: t('assets.filters.status'),
                value: optionLabels.status.get(appliedFilters.statusId) ?? appliedFilters.statusId,
            });
        }

        if (appliedFilters.conditionId) {
            chips.push({
                key: 'filters[asset_condition_id]',
                label: t('assets.filters.condition'),
                value: optionLabels.condition.get(appliedFilters.conditionId) ?? appliedFilters.conditionId,
            });
        }

        if (appliedFilters.picId) {
            chips.push({
                key: 'filters[person_in_charge_id]',
                label: t('assets.fields.pic'),
                value: optionLabels.pic.get(appliedFilters.picId) ?? appliedFilters.picId,
            });
        }

        if (appliedFilters.assetUserId) {
            chips.push({
                key: 'filters[asset_user_id]',
                label: t('assets.fields.asset_user'),
                value: optionLabels.assetUser.get(appliedFilters.assetUserId) ?? appliedFilters.assetUserId,
            });
        }

        if (appliedFilters.costMin.trim() !== '') {
            chips.push({ key: 'filters[cost_min]', label: t('assets.filters.cost_min'), value: appliedFilters.costMin });
        }

        if (appliedFilters.costMax.trim() !== '') {
            chips.push({ key: 'filters[cost_max]', label: t('assets.filters.cost_max'), value: appliedFilters.costMax });
        }

        return chips;
    }, [
        appliedFilters,
        optionLabels,
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

        router.get(
            url.pathname + (params.toString() ? `?${params.toString()}` : ''),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                only: ['items', 'summary', 'savedFilters', 'filtersMeta'],
            },
        );
    }

    return (
        <>
            <Head title={t('assets.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Heading variant="small" title={t('assets.title')} description={t('assets.description')} />

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        {canExport ? (
                            <Link href={assetsExport().url}>
                                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                    <FileDown className="mr-2 h-4 w-4" />
                                    {t('assets.actions.export')}
                                </Button>
                            </Link>
                        ) : null}

                        {canCreate ? (
                            <Button onClick={() => router.visit(AssetController.create.url())} size="sm" className="w-full sm:w-auto shadow-inset-button">
                                <Plus className="mr-2 h-4 w-4" />
                                {t('assets.actions.new')}
                            </Button>
                        ) : null}
                    </div>
                </div>

                <div className="flex items-center justify-between border-b border-border/60">
                    <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
                        <button
                            type="button"
                            onClick={applyAllAssetsView}
                            className={cn(
                                'pb-3 text-sm font-medium transition-colors hover:text-foreground/80 whitespace-nowrap',
                                !hasActiveFilters && !searchValue ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground border-b-2 border-transparent'
                            )}
                        >
                            {t('assets.views.all')}
                        </button>

                        {savedFiltersResolved.map((filter) => {
                            const isActive = isSavedFilterActive(filter);

                            return (
                                <button
                                    key={filter.id}
                                    type="button"
                                    onClick={() => applySavedFilter(filter)}
                                    className={cn(
                                        'pb-3 text-sm font-medium transition-colors hover:text-foreground/80 whitespace-nowrap max-w-[220px] truncate',
                                        isActive ? 'border-b-2 border-primary text-foreground' : 'text-muted-foreground border-b-2 border-transparent'
                                    )}
                                >
                                    {filter.name}
                                </button>
                            );
                        })}
                    </div>
                    <div className="shrink-0 pl-4 flex items-center h-full pb-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                    <Settings2 className="h-4 w-4" />
                                    <span className="sr-only">{t('assets.views.manage')}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[260px]">
                                <DropdownMenuLabel>{t('assets.views.manage')}</DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                {savedFiltersResolved.length === 0 ? (
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
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="py-4">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pb-2">
                            <CardTitle className="text-sm font-medium">{t('assets.kpis.total_assets')}</CardTitle>
                            <Box className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="px-4">
                            <div className="text-2xl font-bold">{numberFormatter.format(summary.total_count)}</div>
                            <p className="text-xs text-muted-foreground">{t('assets.kpis.scoped')}</p>
                        </CardContent>
                    </Card>

                    <Card className="py-4">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pb-2">
                            <CardTitle className="text-sm font-medium">{t('assets.kpis.total_value')}</CardTitle>
                            <Banknote className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="px-4">
                            <div className="text-2xl font-bold">
                                {currencyFormatter.format(Number(summary.total_cost || 0))}
                            </div>
                            <p className="text-xs text-muted-foreground">{currencyCode}</p>
                        </CardContent>
                    </Card>

                    <Card className="py-2 flex flex-col max-h-32">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pb-2 h-auto shrink-0">
                            <CardTitle className="text-sm font-medium">{t('assets.kpis.by_status')}</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="px-4 overflow-y-auto no-scrollbar scroll-smooth flex-1 space-y-1 text-sm">
                            {summary.by_status.length === 0 ? (
                                <div className="text-muted-foreground text-xs">—</div>
                            ) : (
                                summary.by_status.map((row) => (
                                    <div key={`${row.id ?? 'other'}-${row.name}`} className="flex items-center justify-between gap-3">
                                        <span className="truncate text-muted-foreground">{row.name}</span>
                                        <span className="shrink-0">{numberFormatter.format(row.count)}</span>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    <Card className="py-2 flex flex-col max-h-32">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pb-2 h-auto shrink-0">
                            <CardTitle className="text-sm font-medium">{t('assets.kpis.by_condition')}</CardTitle>
                            <Tags className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="px-4 overflow-y-auto no-scrollbar scroll-smooth flex-1 space-y-1 text-sm">
                            {summary.by_condition.length === 0 ? (
                                <div className="text-muted-foreground text-xs">—</div>
                            ) : (
                                summary.by_condition.map((row) => (
                                    <div key={`${row.id ?? 'other'}-${row.name}`} className="flex items-center justify-between gap-3">
                                        <span className="truncate text-muted-foreground">{row.name}</span>
                                        <span className="shrink-0">{numberFormatter.format(row.count)}</span>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="min-w-0">
                    <Card className="py-4">
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 px-4 pb-3">
                            <div className="space-y-1">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Filter className="h-4 w-4 text-muted-foreground" />
                                    {t('assets.filters.title')}
                                </CardTitle>
                                <CardDescription className="text-sm">
                                    {t('assets.filters.active_count', { count: activeFilterCount })}
                                </CardDescription>
                            </div>
                            {activeFilterCount > 0 ? (
                                <Badge variant="secondary" className="shrink-0">
                                    {activeFilterCount}
                                </Badge>
                            ) : null}
                        </CardHeader>
                        <CardContent className="px-4">
                            {!filtersMeta ? (
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                    <div className="h-8 animate-pulse rounded-md bg-muted" />
                                    <div className="h-8 animate-pulse rounded-md bg-muted" />
                                    <div className="h-8 animate-pulse rounded-md bg-muted" />
                                    <div className="h-8 animate-pulse rounded-md bg-muted" />
                                </div>
                            ) : (
                                <form
                                    className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        applyFilters();
                                    }}
                                >
                                    <div className="grid gap-1.5">
                                        <Label className="text-xs text-muted-foreground">{t('assets.fields.branch')}</Label>
                                        <Select
                                            value={branchId || 'all'}
                                            onValueChange={(value) => {
                                                const nextBranchId = value === 'all' ? '' : value;
                                                setBranchId(nextBranchId);
                                                setDepartmentId('');
                                                setLocationId('');
                                            }}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={t('assets.placeholders.branch')} />
                                            </SelectTrigger>
                                            <SelectContent align="start">
                                                <SelectItem value="all">{t('datatable.filter_all', { label: t('assets.fields.branch') })}</SelectItem>
                                                {filterSelects.branches.map((opt) => (
                                                    <SelectItem key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label className="text-xs text-muted-foreground">{t('assets.fields.department')}</Label>
                                        <Select
                                            value={departmentId || 'all'}
                                            onValueChange={(value) => {
                                                const nextDepartmentId = value === 'all' ? '' : value;
                                                setDepartmentId(nextDepartmentId);
                                            }}
                                            disabled={filterSelects.departments.length === 0}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={t('assets.placeholders.department')} />
                                            </SelectTrigger>
                                            <SelectContent align="start">
                                                <SelectItem value="all">{t('datatable.filter_all', { label: t('assets.fields.department') })}</SelectItem>
                                                {filterSelects.departments.map((opt) => (
                                                    <SelectItem key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label className="text-xs text-muted-foreground">{t('assets.fields.location')}</Label>
                                        <Select
                                            value={locationId || 'all'}
                                            onValueChange={(value) => {
                                                const nextLocationId = value === 'all' ? '' : value;
                                                setLocationId(nextLocationId);
                                            }}
                                            disabled={filterSelects.locations.length === 0}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={t('assets.placeholders.location')} />
                                            </SelectTrigger>
                                            <SelectContent align="start">
                                                <SelectItem value="all">{t('datatable.filter_all', { label: t('assets.fields.location') })}</SelectItem>
                                                {filterSelects.locations.map((opt) => (
                                                    <SelectItem key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label className="text-xs text-muted-foreground">{t('assets.fields.category')}</Label>
                                        <Select
                                            value={categoryId || 'all'}
                                            onValueChange={(value) => {
                                                const nextCategoryId = value === 'all' ? '' : value;
                                                setCategoryId(nextCategoryId);
                                            }}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={t('assets.placeholders.category')} />
                                            </SelectTrigger>
                                            <SelectContent align="start">
                                                <SelectItem value="all">{t('datatable.filter_all', { label: t('assets.fields.category') })}</SelectItem>
                                                {filterSelects.categories.map((opt) => (
                                                    <SelectItem key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label className="text-xs text-muted-foreground">{t('assets.filters.status')}</Label>
                                        <Select
                                            value={statusId || 'all'}
                                            onValueChange={(value) => {
                                                const nextStatusId = value === 'all' ? '' : value;
                                                setStatusId(nextStatusId);
                                            }}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={t('assets.placeholders.status')} />
                                            </SelectTrigger>
                                            <SelectContent align="start">
                                                <SelectItem value="all">{t('datatable.filter_all', { label: t('assets.filters.status') })}</SelectItem>
                                                {filterSelects.statuses.map((opt) => (
                                                    <SelectItem key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label className="text-xs text-muted-foreground">{t('assets.filters.condition')}</Label>
                                        <Select
                                            value={conditionId || 'all'}
                                            onValueChange={(value) => {
                                                const nextConditionId = value === 'all' ? '' : value;
                                                setConditionId(nextConditionId);
                                            }}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={t('assets.placeholders.condition')} />
                                            </SelectTrigger>
                                            <SelectContent align="start">
                                                <SelectItem value="all">{t('datatable.filter_all', { label: t('assets.filters.condition') })}</SelectItem>
                                                {filterSelects.conditions.map((opt) => (
                                                    <SelectItem key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label className="text-xs text-muted-foreground">{t('assets.fields.pic')}</Label>
                                        <Select
                                            value={picId || 'all'}
                                            onValueChange={(value) => {
                                                const nextPicId = value === 'all' ? '' : value;
                                                setPicId(nextPicId);
                                            }}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={t('assets.placeholders.pic')} />
                                            </SelectTrigger>
                                            <SelectContent align="start">
                                                <SelectItem value="all">{t('datatable.filter_all', { label: t('assets.fields.pic') })}</SelectItem>
                                                {filterSelects.pics.map((opt) => (
                                                    <SelectItem key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label className="text-xs text-muted-foreground">{t('assets.fields.asset_user')}</Label>
                                        <Select
                                            value={assetUserId || 'all'}
                                            onValueChange={(value) => {
                                                const nextAssetUserId = value === 'all' ? '' : value;
                                                setAssetUserId(nextAssetUserId);
                                            }}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={t('assets.placeholders.asset_user')} />
                                            </SelectTrigger>
                                            <SelectContent align="start">
                                                <SelectItem value="all">{t('datatable.filter_all', { label: t('assets.fields.asset_user') })}</SelectItem>
                                                {filterSelects.assetUsers.map((opt) => (
                                                    <SelectItem key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-1.5 sm:col-span-2 lg:col-span-2">
                                        <Label className="text-xs text-muted-foreground">{t('assets.fields.cost')}</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input
                                                id="costMin"
                                                value={costMin}
                                                onChange={(e) => setCostMin(e.target.value)}
                                                inputMode="decimal"
                                                placeholder={t('assets.filters.cost_min')}
                                                className="h-8"
                                            />
                                            <Input
                                                id="costMax"
                                                value={costMax}
                                                onChange={(e) => setCostMax(e.target.value)}
                                                inputMode="decimal"
                                                placeholder={t('assets.filters.cost_max')}
                                                className="h-8"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row sm:items-end sm:justify-end lg:col-span-2">
                                        <Button size="sm" type="submit" className="w-full sm:w-auto" disabled={!isDirtyFilters}>
                                            {t('common.apply')}
                                        </Button>
                                        <Button
                                            size="sm"
                                            type="button"
                                            variant="outline"
                                            className="w-full sm:w-auto"
                                            onClick={clearAllFilters}
                                            disabled={!hasActiveFilters && !hasDraftFilters}
                                        >
                                            {t('assets.filters.clear_all')}
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </CardContent>
                    </Card>

                    {activeFilterChips.length > 0 ? (
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <div className="mr-1 text-sm text-muted-foreground">
                                {t('assets.filters.active_count', { count: activeFilterChips.length })}
                            </div>
                            {activeFilterChips.map((chip) => (
                                <Badge key={chip.key} variant="secondary" className="flex items-center gap-1 bg-secondary/40 px-2 py-0.5 text-xs font-normal">
                                    <span className="max-w-[220px] truncate">
                                        <span className="text-muted-foreground">{chip.label}:</span> {chip.value}
                                    </span>
                                    <button
                                        type="button"
                                        className="ml-1 inline-flex items-center justify-center rounded-full hover:bg-muted"
                                        onClick={() => removeFilterChip(chip.key)}
                                        aria-label={t('assets.filters.remove')}
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="ml-auto h-7 text-xs">
                                {t('assets.filters.clear_all')}
                            </Button>
                        </div>
                    ) : null}

                    <div className="mt-4">
                        <DataTable
                            tableId="assets"
                            data={items}
                            columns={columns}
                            rowActions={rowActions}
                            bulkActions={bulkActions}
                            onBulkAction={onBulkAction}
                            routePrefix={assetsIndex.url()}
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
