import { Head, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { index as maintenanceCostsReportIndex } from '@/routes/reports/maintenance-costs';
import { useTranslation } from '@/hooks/use-translation';

type Option = { id: number; name: string; code?: string | null };

type Props = {
    filters: Record<string, string>;
    summary: {
        kpis: { total_cost: string; work_orders_with_cost: number; average_cost_per_work_order: string };
        monthly_totals: Array<Record<string, string | number>>;
        cost_by_asset: Array<Record<string, string | number>>;
        cost_by_category: Array<Record<string, string | number>>;
    };
    filtersMeta: {
        branches: Option[];
        categories: Option[];
        assets: Option[];
        assignees: Array<{ id: number; name: string | null }>;
        vendors: Option[];
        default_date_from: string;
        default_date_to: string;
    };
};

export default function MaintenanceCostsReportIndex({ filters, summary, filtersMeta }: Props) {
    const { t } = useTranslation();
    const { organization } = usePage().props as { organization?: { currency_code?: string } | null };
    const [state, setState] = useState({
        date_from: filters.date_from ?? filtersMeta.default_date_from,
        date_to: filters.date_to ?? filtersMeta.default_date_to,
        branch_id: filters.branch_id ?? '',
        asset_category_id: filters.asset_category_id ?? '',
        asset_id: filters.asset_id ?? '',
        assigned_to: filters.assigned_to ?? '',
        vendor_id: filters.vendor_id ?? '',
    });

    const formatter = useMemo(() => new Intl.NumberFormat(undefined, { style: 'currency', currency: organization?.currency_code || 'IDR', maximumFractionDigits: 0 }), [organization?.currency_code]);

    function money(value: string) {
        const parsed = Number(value || 0);
        return formatter.format(Number.isFinite(parsed) ? parsed : 0);
    }

    function apply() {
        router.get(maintenanceCostsReportIndex({ query: { filters: state, date_from: state.date_from, date_to: state.date_to } }).url, {}, { preserveScroll: true, preserveState: true });
    }

    function clear() {
        router.get(maintenanceCostsReportIndex().url, {}, { preserveScroll: true, preserveState: true });
    }

    return (
        <>
            <Head title={t('reports.maintenance_costs.title')} />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <Heading variant="small" title={t('reports.maintenance_costs.title')} description={t('reports.maintenance_costs.description')} />
                <Card className="p-4">
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        <Field label={t('reports.maintenance_costs.filters.date_from')}><Input type="date" value={state.date_from} onChange={(e) => setState((v) => ({ ...v, date_from: e.target.value }))} /></Field>
                        <Field label={t('reports.maintenance_costs.filters.date_to')}><Input type="date" value={state.date_to} onChange={(e) => setState((v) => ({ ...v, date_to: e.target.value }))} /></Field>
                        <SelectField label={t('reports.maintenance_costs.filters.branch')} value={state.branch_id} onChange={(v) => setState((s) => ({ ...s, branch_id: v }))} options={filtersMeta.branches.map((item) => ({ value: String(item.id), label: item.code ? `${item.code} - ${item.name}` : item.name }))} />
                        <SelectField label={t('reports.maintenance_costs.filters.category')} value={state.asset_category_id} onChange={(v) => setState((s) => ({ ...s, asset_category_id: v }))} options={filtersMeta.categories.map((item) => ({ value: String(item.id), label: item.code ? `${item.code} - ${item.name}` : item.name }))} />
                        <SelectField label={t('reports.maintenance_costs.filters.asset')} value={state.asset_id} onChange={(v) => setState((s) => ({ ...s, asset_id: v }))} options={filtersMeta.assets.map((item) => ({ value: String(item.id), label: item.code ? `${item.code} - ${item.name}` : item.name }))} />
                        <SelectField label={t('reports.maintenance_costs.filters.assignee')} value={state.assigned_to} onChange={(v) => setState((s) => ({ ...s, assigned_to: v }))} options={filtersMeta.assignees.filter((item) => item.name).map((item) => ({ value: String(item.id), label: String(item.name) }))} />
                        <SelectField label={t('reports.maintenance_costs.filters.vendor')} value={state.vendor_id} onChange={(v) => setState((s) => ({ ...s, vendor_id: v }))} options={filtersMeta.vendors.map((item) => ({ value: String(item.id), label: item.name }))} />
                    </div>
                    <div className="mt-4 flex gap-2">
                        <Button size="sm" onClick={apply}>{t('reports.inventory.actions.apply')}</Button>
                        <Button size="sm" variant="outline" onClick={clear}>{t('reports.inventory.actions.clear')}</Button>
                    </div>
                </Card>

                <div className="grid gap-3 md:grid-cols-3">
                    <MetricCard label={t('reports.maintenance_costs.kpis.total_cost')} value={money(summary.kpis.total_cost)} />
                    <MetricCard label={t('reports.maintenance_costs.kpis.work_orders_with_cost')} value={String(summary.kpis.work_orders_with_cost)} />
                    <MetricCard label={t('reports.maintenance_costs.kpis.average_cost_per_work_order')} value={money(summary.kpis.average_cost_per_work_order)} />
                </div>

                <TableCard title={t('reports.maintenance_costs.tables.monthly_totals')} headers={['period', 'total_cost', 'work_order_count']} rows={summary.monthly_totals} moneyColumns={['total_cost']} money={money} translationPrefix="reports.maintenance_costs.columns" />
                <TableCard title={t('reports.maintenance_costs.tables.cost_by_asset')} headers={['asset', 'total_cost', 'work_order_count']} rows={summary.cost_by_asset} moneyColumns={['total_cost']} money={money} translationPrefix="reports.maintenance_costs.columns" />
                <TableCard title={t('reports.maintenance_costs.tables.cost_by_category')} headers={['category', 'total_cost', 'work_order_count']} rows={summary.cost_by_category} moneyColumns={['total_cost']} money={money} translationPrefix="reports.maintenance_costs.columns" />
            </div>
        </>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return <div className="grid gap-2"><Label>{label}</Label>{children}</div>;
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: Array<{ value: string; label: string }> }) {
    return (
        <Field label={label}>
            <Select value={value || '__all__'} onValueChange={(v) => onChange(v === '__all__' ? '' : v)}>
                <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="__all__">All</SelectItem>
                    {options.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                </SelectContent>
            </Select>
        </Field>
    );
}

function MetricCard({ label, value }: { label: string; value: string }) {
    return <Card className="p-4"><div className="text-xs font-medium text-muted-foreground">{label}</div><div className="mt-1 text-2xl font-semibold">{value}</div></Card>;
}

function TableCard({ title, headers, rows, translationPrefix, moneyColumns, money }: { title: string; headers: string[]; rows: Array<Record<string, string | number>>; translationPrefix: string; moneyColumns: string[]; money: (value: string) => string }) {
    const { t } = useTranslation();

    return (
        <Card className="overflow-hidden">
            <div className="border-b px-4 py-3 text-sm font-medium">{title}</div>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-muted/50">
                        <tr>{headers.map((header) => <th key={header} className="px-4 py-2 text-left font-medium">{t(`${translationPrefix}.${header}`)}</th>)}</tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                            <tr key={index} className="border-t">
                                {headers.map((header) => {
                                    const value = String(row[header] ?? '-');
                                    return <td key={header} className="px-4 py-2">{moneyColumns.includes(header) ? money(value) : value}</td>;
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
