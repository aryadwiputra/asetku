import { Head, router, usePage } from '@inertiajs/react';
import { Eye, Plus } from 'lucide-react';

import Heading from '@/components/heading';
import { DataTable } from '@/components/data-table/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { create as workOrdersCreate, show as workOrdersShow } from '@/routes/work-orders';
import type { DataTableColumn, PaginatedData, RowAction } from '@/types/datatable';

type Branch = { id: number; name: string; code: string };

type Row = {
    id: number;
    description: string;
    type: string;
    source: string;
    priority: string;
    status: string;
    progress_percent: number;
    response_due_at: string | null;
    resolution_due_at: string | null;
    escalation_level: number;
    created_at: string;
    technician: { id: number; name: string; email: string | null } | null;
    branch: Branch | null;
    asset: {
        id: number;
        code: string;
        name: string;
        branch: Branch | null;
        status: { id: number; name: string; code: string } | null;
        condition: { id: number; name: string; code: string } | null;
    } | null;
};

type Props = {
    items: PaginatedData<Row>;
    filtersMeta: {
        branches: Branch[];
        statuses: string[];
        types: string[];
        priorities: string[];
        technicians: { user_id: number; name: string | null; branch_id: number | null; is_available: boolean; skills: string[] }[];
    };
};

export default function WorkOrdersIndex({ items, filtersMeta }: Props) {
    const { t } = useTranslation();
    const { orgRole, permissions } = usePage().props as { orgRole: string | null; permissions: string[] };

    const canCreate = permissions.includes('work_order.create') || ['Owner', 'Admin', 'Manager'].includes(orgRole || '');

    const columns: DataTableColumn<Row>[] = [
        {
            key: 'asset',
            label: t('work_orders.fields.asset'),
            sortable: false,
            render: (row) => (
                <div className="min-w-0">
                    <div className="truncate font-medium">{row.asset?.name || '-'}</div>
                    <div className="truncate text-xs text-muted-foreground">{row.asset?.code || '-'}</div>
                    <div className="mt-1 truncate text-xs text-muted-foreground">{row.description}</div>
                </div>
            ),
        },
        {
            key: 'type',
            label: t('work_orders.fields.type'),
            sortable: false,
            render: (row) => <Badge variant="secondary">{t(`work_orders.types.${row.type}`)}</Badge>,
        },
        {
            key: 'status',
            label: t('work_orders.fields.status'),
            sortable: false,
            render: (row) => <Badge>{t(`work_orders.status.${row.status}`)}</Badge>,
        },
        {
            key: 'priority',
            label: t('work_orders.fields.priority'),
            sortable: false,
            render: (row) => <Badge variant="outline">{t(`work_orders.priorities.${row.priority}`)}</Badge>,
        },
        {
            key: 'assigned_to',
            label: t('work_orders.fields.assigned_to'),
            sortable: false,
            render: (row) => <span className="text-sm">{row.technician?.name || '-'}</span>,
        },
        {
            key: 'resolution_due_at',
            label: t('work_orders.fields.due'),
            sortable: false,
            render: (row) => (
                <div className="text-sm">
                    <div>{row.resolution_due_at || '-'}</div>
                    {row.escalation_level > 0 ? (
                        <div className="text-xs text-amber-600">{t('work_orders.labels.escalated', { level: row.escalation_level })}</div>
                    ) : null}
                </div>
            ),
        },
    ];

    const rowActions: RowAction<Row>[] = [
        {
            key: 'view',
            label: t('common.view'),
            icon: <Eye className="mr-2 h-4 w-4" />,
            onClick: (row) => router.visit(workOrdersShow(row.id).url),
            visible: () => true,
        },
    ];

    const branchOptions = filtersMeta.branches.map((b) => ({ value: String(b.id), label: `${b.code} • ${b.name}` }));
    const statusOptions = filtersMeta.statuses.map((s) => ({ value: s, label: t(`work_orders.status.${s}`) }));
    const typeOptions = filtersMeta.types.map((s) => ({ value: s, label: t(`work_orders.types.${s}`) }));
    const priorityOptions = filtersMeta.priorities.map((s) => ({ value: s, label: t(`work_orders.priorities.${s}`) }));
    const technicianOptions = filtersMeta.technicians
        .filter((t) => t.name)
        .map((t) => ({ value: String(t.user_id), label: t.name as string }));

    return (
        <>
            <Head title={t('work_orders.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        variant="small"
                        title={t('work_orders.title')}
                        description={t('work_orders.description')}
                    />

                    {canCreate ? (
                        <Button onClick={() => router.visit(workOrdersCreate().url)} className="w-full sm:w-auto">
                            <Plus className="mr-2 h-4 w-4" />
                            {t('work_orders.actions.new')}
                        </Button>
                    ) : null}
                </div>

                <DataTable
                    tableId="work-orders"
                    routePrefix="/work-orders"
                    data={items}
                    columns={columns}
                    mobileView="cards"
                    rowActions={rowActions}
                    filters={[
                        { key: 'status', label: t('work_orders.fields.status'), options: statusOptions },
                        { key: 'type', label: t('work_orders.fields.type'), options: typeOptions },
                        { key: 'priority', label: t('work_orders.fields.priority'), options: priorityOptions },
                        { key: 'branch_id', label: t('common.branch'), options: branchOptions },
                        { key: 'assigned_to', label: t('work_orders.fields.assigned_to'), options: technicianOptions },
                        { key: 'overdue', label: t('work_orders.fields.overdue'), options: [{ value: '1', label: t('common.yes') }] },
                    ]}
                />
            </div>
        </>
    );
}
