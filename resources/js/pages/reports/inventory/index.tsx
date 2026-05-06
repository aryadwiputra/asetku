import { Head, Link, router, usePage } from '@inertiajs/react';
import { FileDown, Printer } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Heading from '@/components/heading';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { exportMethod as assetsExport } from '@/routes/assets';
import { index as inventoryIndex } from '@/routes/reports/inventory';
import { print as inventoryStocktakePrint } from '@/routes/reports/inventory/stocktake';
import { useTranslation } from '@/hooks/use-translation';

type Option = { id: number; name: string; code?: string | null; parent_id?: number | null; branch_id?: number | null };

type SummaryRow = {
    id: number;
    name: string;
    code: string | null;
    count: number;
    total_value: string;
};

type Props = {
    search: string | null;
    filters: Record<string, string>;
    summary: {
        total_assets: number;
        total_value: string;
        by_branch: SummaryRow[];
        by_status: SummaryRow[];
        by_condition: SummaryRow[];
    };
    filtersMeta: {
        branches: Option[];
        statuses: Option[];
        conditions: Option[];
        categories: Option[];
        locations: Option[];
        departments: Option[];
    };
};

export default function InventoryReportIndex({ search, filters, summary, filtersMeta }: Props) {
    const { t } = useTranslation();
    const { moduleAbilities, organization } = usePage().props as {
        moduleAbilities: { reports: { inventoryExport: boolean } };
        organization?: { currency_code?: string; timezone?: string; name?: string } | null;
    };

    const applied = useMemo(() => {
        return {
            q: typeof search === 'string' ? search : '',
            branch_id: filters.branch_id ?? '',
            asset_status_id: filters.asset_status_id ?? '',
            asset_condition_id: filters.asset_condition_id ?? '',
            asset_category_id: filters.asset_category_id ?? '',
            asset_location_id: filters.asset_location_id ?? '',
            department_id: filters.department_id ?? '',
        };
    }, [filters, search]);

    const [q, setQ] = useState(applied.q);
    const [branchId, setBranchId] = useState(applied.branch_id);
    const [statusId, setStatusId] = useState(applied.asset_status_id);
    const [conditionId, setConditionId] = useState(applied.asset_condition_id);
    const [categoryId, setCategoryId] = useState(applied.asset_category_id);
    const [locationId, setLocationId] = useState(applied.asset_location_id);
    const [departmentId, setDepartmentId] = useState(applied.department_id);

    useEffect(() => {
        setQ(applied.q);
        setBranchId(applied.branch_id);
        setStatusId(applied.asset_status_id);
        setConditionId(applied.asset_condition_id);
        setCategoryId(applied.asset_category_id);
        setLocationId(applied.asset_location_id);
        setDepartmentId(applied.department_id);
    }, [applied]);

    const isDirty =
        q !== applied.q ||
        branchId !== applied.branch_id ||
        statusId !== applied.asset_status_id ||
        conditionId !== applied.asset_condition_id ||
        categoryId !== applied.asset_category_id ||
        locationId !== applied.asset_location_id ||
        departmentId !== applied.department_id;

    function apply() {
        router.get(
            inventoryIndex({
                query: {
                    q: q.trim() || undefined,
                    filters: {
                        branch_id: branchId || undefined,
                        asset_status_id: statusId || undefined,
                        asset_condition_id: conditionId || undefined,
                        asset_category_id: categoryId || undefined,
                        asset_location_id: locationId || undefined,
                        department_id: departmentId || undefined,
                    },
                },
            }).url,
            {},
            { preserveScroll: true, preserveState: true },
        );
    }

    function clear() {
        router.get(inventoryIndex().url, {}, { preserveScroll: true, preserveState: true });
    }

    const currency = organization?.currency_code || 'IDR';
    const numberFormatter = useMemo(() => {
        try {
            return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 0 });
        } catch {
            return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });
        }
    }, [currency]);

    const totalValueFormatted = useMemo(() => {
        const value = Number(summary.total_value || 0);
        return numberFormatter.format(isFinite(value) ? value : 0);
    }, [numberFormatter, summary.total_value]);

    const hasBranch = branchId.trim() !== '';

    const exportQuery = useMemo(() => {
        return {
            q: applied.q.trim() || undefined,
            filters: {
                branch_id: applied.branch_id || undefined,
                department_id: applied.department_id || undefined,
                asset_category_id: applied.asset_category_id || undefined,
                asset_location_id: applied.asset_location_id || undefined,
                asset_status_id: applied.asset_status_id || undefined,
                asset_condition_id: applied.asset_condition_id || undefined,
            },
        };
    }, [applied]);

    return (
        <>
            <Head title={t('reports.inventory.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Heading variant="small" title={t('reports.inventory.title')} description={t('reports.inventory.description')} />

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        {moduleAbilities.reports.inventoryExport ? (
                            <Link
                                href={assetsExport({
                                    query: {
                                        ...exportQuery,
                                        format: 'excel',
                                    },
                                }).url}
                            >
                                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                    <FileDown className="mr-2 h-4 w-4" />
                                    {t('reports.inventory.actions.export')}
                                </Button>
                            </Link>
                        ) : null}

                        <Link
                            href={inventoryStocktakePrint({
                                query: {
                                    ...exportQuery,
                                    branch_id: applied.branch_id || undefined,
                                },
                            }).url}
                        >
                            <Button variant="outline" size="sm" className="w-full sm:w-auto" disabled={!hasBranch}>
                                <Printer className="mr-2 h-4 w-4" />
                                {t('reports.inventory.actions.print_stocktake')}
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid gap-3 rounded-xl border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="min-w-0">
                        <div className="text-xs font-medium text-muted-foreground">{t('reports.inventory.kpis.total_assets')}</div>
                        <div className="mt-1 truncate text-2xl font-semibold">{summary.total_assets}</div>
                    </div>
                    <div className="min-w-0">
                        <div className="text-xs font-medium text-muted-foreground">{t('reports.inventory.kpis.total_value')}</div>
                        <div className="mt-1 truncate text-2xl font-semibold">{totalValueFormatted}</div>
                    </div>
                    <div className="min-w-0">
                        <div className="text-xs font-medium text-muted-foreground">{t('reports.inventory.kpis.by_status')}</div>
                        <div className="mt-2 space-y-1">
                            {summary.by_status.slice(0, 3).map((row) => (
                                <div key={row.id} className="flex items-center justify-between gap-3 text-sm">
                                    <span className="min-w-0 truncate">{row.name}</span>
                                    <span className="shrink-0 tabular-nums text-muted-foreground">{row.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="min-w-0">
                        <div className="text-xs font-medium text-muted-foreground">{t('reports.inventory.kpis.by_condition')}</div>
                        <div className="mt-2 space-y-1">
                            {summary.by_condition.slice(0, 3).map((row) => (
                                <div key={row.id} className="flex items-center justify-between gap-3 text-sm">
                                    <span className="min-w-0 truncate">{row.name}</span>
                                    <span className="shrink-0 tabular-nums text-muted-foreground">{row.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <Card className="p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="min-w-0">
                                <Label htmlFor="q">{t('reports.inventory.filters.search')}</Label>
                                <Input id="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('common.search_placeholder')} />
                            </div>

                            <div className="min-w-0">
                                <Label>{t('reports.inventory.filters.branch')}</Label>
                                <Select value={branchId} onValueChange={(v) => setBranchId(v === '__all__' ? '' : v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('common.all')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="__all__">{t('common.all')}</SelectItem>
                                        {filtersMeta.branches.map((b) => (
                                            <SelectItem key={b.id} value={String(b.id)}>
                                                {b.code ? `${b.code} — ${b.name}` : b.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="min-w-0">
                                <Label>{t('reports.inventory.filters.status')}</Label>
                                <Select value={statusId} onValueChange={(v) => setStatusId(v === '__all__' ? '' : v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('common.all')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="__all__">{t('common.all')}</SelectItem>
                                        {filtersMeta.statuses.map((s) => (
                                            <SelectItem key={s.id} value={String(s.id)}>
                                                {s.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="min-w-0">
                                <Label>{t('reports.inventory.filters.condition')}</Label>
                                <Select value={conditionId} onValueChange={(v) => setConditionId(v === '__all__' ? '' : v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('common.all')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="__all__">{t('common.all')}</SelectItem>
                                        {filtersMeta.conditions.map((c) => (
                                            <SelectItem key={c.id} value={String(c.id)}>
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="min-w-0">
                                <Label>{t('reports.inventory.filters.department')}</Label>
                                <Select value={departmentId} onValueChange={(v) => setDepartmentId(v === '__all__' ? '' : v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('common.all')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="__all__">{t('common.all')}</SelectItem>
                                        {filtersMeta.departments.map((d) => (
                                            <SelectItem key={d.id} value={String(d.id)}>
                                                {d.code ? `${d.code} — ${d.name}` : d.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="min-w-0">
                                <Label>{t('reports.inventory.filters.location')}</Label>
                                <Select value={locationId} onValueChange={(v) => setLocationId(v === '__all__' ? '' : v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('common.all')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="__all__">{t('common.all')}</SelectItem>
                                        {filtersMeta.locations.map((l) => (
                                            <SelectItem key={l.id} value={String(l.id)}>
                                                {l.code ? `${l.code} — ${l.name}` : l.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={clear}>
                                {t('reports.inventory.actions.clear')}
                            </Button>
                            <Button size="sm" className={cn('w-full sm:w-auto shadow-inset-button')} onClick={apply} disabled={!isDirty}>
                                {t('reports.inventory.actions.apply')}
                            </Button>
                        </div>
                    </div>

                    {!hasBranch ? <p className="mt-3 text-sm text-muted-foreground">{t('reports.inventory.empty.branch_required')}</p> : null}
                </Card>

                <div className="grid gap-4 lg:grid-cols-3">
                    <Card className="p-4">
                        <div className="text-sm font-semibold">{t('reports.inventory.kpis.by_branch')}</div>
                        <div className="mt-3 space-y-2">
                            {summary.by_branch.length === 0 ? (
                                <div className="text-sm text-muted-foreground">{t('common.empty')}</div>
                            ) : (
                                summary.by_branch.map((row) => (
                                    <div key={row.id} className="flex items-center justify-between gap-3 text-sm">
                                        <div className="min-w-0">
                                            <div className="truncate">{row.code ? `${row.code} — ${row.name}` : row.name}</div>
                                            <div className="text-xs text-muted-foreground">{numberFormatter.format(Number(row.total_value || 0))}</div>
                                        </div>
                                        <div className="shrink-0 tabular-nums text-muted-foreground">{row.count}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="text-sm font-semibold">{t('reports.inventory.kpis.by_status')}</div>
                        <div className="mt-3 space-y-2">
                            {summary.by_status.length === 0 ? (
                                <div className="text-sm text-muted-foreground">{t('common.empty')}</div>
                            ) : (
                                summary.by_status.map((row) => (
                                    <div key={row.id} className="flex items-center justify-between gap-3 text-sm">
                                        <div className="min-w-0">
                                            <div className="truncate">{row.name}</div>
                                            <div className="text-xs text-muted-foreground">{numberFormatter.format(Number(row.total_value || 0))}</div>
                                        </div>
                                        <div className="shrink-0 tabular-nums text-muted-foreground">{row.count}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="text-sm font-semibold">{t('reports.inventory.kpis.by_condition')}</div>
                        <div className="mt-3 space-y-2">
                            {summary.by_condition.length === 0 ? (
                                <div className="text-sm text-muted-foreground">{t('common.empty')}</div>
                            ) : (
                                summary.by_condition.map((row) => (
                                    <div key={row.id} className="flex items-center justify-between gap-3 text-sm">
                                        <div className="min-w-0">
                                            <div className="truncate">{row.name}</div>
                                            <div className="text-xs text-muted-foreground">{numberFormatter.format(Number(row.total_value || 0))}</div>
                                        </div>
                                        <div className="shrink-0 tabular-nums text-muted-foreground">{row.count}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
}
