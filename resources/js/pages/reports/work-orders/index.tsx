import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { index as workOrdersReportIndex } from '@/routes/reports/work-orders';
import { useTranslation } from '@/hooks/use-translation';

type Option = { id?: number; user_id?: number; name: string | null; code?: string | null };

type Props = {
    filters: Record<string, string>;
    summary: {
        kpis: Record<string, number>;
        monthly_summary: Array<Record<string, number | string>>;
        technician_performance: Array<Record<string, number | string | null>>;
        sla_compliance: Array<Record<string, number | string>>;
        downtime_summary: Record<string, number>;
        downtime_by_asset: Array<Record<string, number | string>>;
        downtime_by_month: Array<Record<string, number | string>>;
    };
    filtersMeta: {
        branches: Option[];
        statuses: string[];
        types: string[];
        priorities: string[];
        technicians: Option[];
        default_date_from: string;
        default_date_to: string;
    };
};

export default function WorkOrdersReportIndex({ filters, summary, filtersMeta }: Props) {
    const { t } = useTranslation();
    const [state, setState] = useState({
        date_from: filters.date_from ?? filtersMeta.default_date_from,
        date_to: filters.date_to ?? filtersMeta.default_date_to,
        branch_id: filters.branch_id ?? '',
        assigned_to: filters.assigned_to ?? '',
        status: filters.status ?? '',
        type: filters.type ?? '',
        priority: filters.priority ?? '',
    });

    function apply() {
        router.get(workOrdersReportIndex({ query: { filters: state, date_from: state.date_from, date_to: state.date_to } }).url, {}, { preserveScroll: true, preserveState: true });
    }

    function clear() {
        router.get(workOrdersReportIndex().url, {}, { preserveScroll: true, preserveState: true });
    }

    return (
        <>
            <Head title={t('reports.work_orders.title')} />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <Heading variant="small" title={t('reports.work_orders.title')} description={t('reports.work_orders.description')} />

                <Card className="p-4">
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        <Field label={t('reports.work_orders.filters.date_from')}><Input type="date" value={state.date_from} onChange={(e) => setState((v) => ({ ...v, date_from: e.target.value }))} /></Field>
                        <Field label={t('reports.work_orders.filters.date_to')}><Input type="date" value={state.date_to} onChange={(e) => setState((v) => ({ ...v, date_to: e.target.value }))} /></Field>
                        <SelectField label={t('reports.work_orders.filters.branch')} value={state.branch_id} onChange={(v) => setState((s) => ({ ...s, branch_id: v }))} options={filtersMeta.branches.map((item) => ({ value: String(item.id), label: item.code ? `${item.code} - ${item.name}` : String(item.name) }))} />
                        <SelectField label={t('reports.work_orders.filters.technician')} value={state.assigned_to} onChange={(v) => setState((s) => ({ ...s, assigned_to: v }))} options={filtersMeta.technicians.filter((item) => item.user_id && item.name).map((item) => ({ value: String(item.user_id), label: String(item.name) }))} />
                        <SelectField label={t('reports.work_orders.filters.status')} value={state.status} onChange={(v) => setState((s) => ({ ...s, status: v }))} options={filtersMeta.statuses.map((item) => ({ value: item, label: t(`work_orders.status.${item}`) }))} />
                        <SelectField label={t('reports.work_orders.filters.type')} value={state.type} onChange={(v) => setState((s) => ({ ...s, type: v }))} options={filtersMeta.types.map((item) => ({ value: item, label: t(`work_orders.types.${item}`) }))} />
                        <SelectField label={t('reports.work_orders.filters.priority')} value={state.priority} onChange={(v) => setState((s) => ({ ...s, priority: v }))} options={filtersMeta.priorities.map((item) => ({ value: item, label: t(`work_orders.priorities.${item}`) }))} />
                    </div>
                    <div className="mt-4 flex gap-2">
                        <Button size="sm" onClick={apply}>{t('reports.inventory.actions.apply')}</Button>
                        <Button size="sm" variant="outline" onClick={clear}>{t('reports.inventory.actions.clear')}</Button>
                    </div>
                </Card>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                    {Object.entries(summary.kpis).map(([key, value]) => (
                        <Card key={key} className="p-4">
                            <div className="text-xs font-medium text-muted-foreground">{t(`reports.work_orders.kpis.${key}`)}</div>
                            <div className="mt-1 text-2xl font-semibold">{formatMetric(key, value)}</div>
                        </Card>
                    ))}
                </div>

                <TableCard title={t('reports.work_orders.tables.monthly_summary')} headers={['period', 'opened', 'completed', 'cancelled', 'overdue', 'response_sla_breached', 'resolution_sla_breached']} rows={summary.monthly_summary} translationPrefix="reports.work_orders.columns" />
                <TableCard title={t('reports.work_orders.tables.technician_performance')} headers={['technician', 'assigned_count', 'completed_count', 'overdue_count', 'average_completion_hours']} rows={summary.technician_performance} translationPrefix="reports.work_orders.columns" />
                <TableCard
                    title={t('reports.work_orders.tables.sla_compliance')}
                    headers={['period', 'total_with_response_sla', 'response_on_time', 'response_breached', 'response_compliance_percent', 'total_with_resolution_sla', 'resolution_on_time', 'resolution_breached', 'resolution_compliance_percent']}
                    rows={summary.sla_compliance}
                    translationPrefix="reports.work_orders.columns"
                />
                <div className="grid gap-3 md:grid-cols-3">
                    {Object.entries(summary.downtime_summary).map(([key, value]) => (
                        <Card key={key} className="p-4">
                            <div className="text-xs font-medium text-muted-foreground">{t(`reports.work_orders.kpis.${key}`)}</div>
                            <div className="mt-1 text-2xl font-semibold">{formatMetric(key, value)}</div>
                        </Card>
                    ))}
                </div>
                <TableCard
                    title={t('reports.work_orders.tables.downtime_by_asset')}
                    headers={['asset', 'incident_count', 'total_downtime_hours', 'average_downtime_hours', 'latest_downtime_hours']}
                    rows={summary.downtime_by_asset}
                    translationPrefix="reports.work_orders.columns"
                />
                <TableCard
                    title={t('reports.work_orders.tables.downtime_by_month')}
                    headers={['period', 'incident_count', 'total_downtime_hours', 'average_downtime_hours']}
                    rows={summary.downtime_by_month}
                    translationPrefix="reports.work_orders.columns"
                />
            </div>
        </>
    );
}

function formatMetric(key: string, value: number) {
    if (key.endsWith('_percent')) {
        return `${value}%`;
    }

    if (key.endsWith('_hours')) {
        return `${value}h`;
    }

    return String(value);
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

function TableCard({ title, headers, rows, translationPrefix }: { title: string; headers: string[]; rows: Array<Record<string, unknown>>; translationPrefix: string }) {
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
                                {headers.map((header) => (
                                    <td key={header} className="px-4 py-2">
                                        {formatCell(header, row[header])}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {rows.length === 0 ? (
                            <tr className="border-t">
                                <td colSpan={headers.length} className="px-4 py-6 text-center text-muted-foreground">
                                    {t('common.empty')}
                                </td>
                            </tr>
                        ) : null}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}

function formatCell(header: string, value: unknown) {
    if (value === null || value === undefined || value === '') {
        return '-';
    }

    if (header.endsWith('_percent')) {
        return `${value}%`;
    }

    if (header.endsWith('_hours')) {
        return `${value}h`;
    }

    return String(value);
}
