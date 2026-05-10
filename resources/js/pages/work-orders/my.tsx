import { Head, router } from '@inertiajs/react';
import { Eye } from 'lucide-react';

import Heading from '@/components/heading';
import { DataTable } from '@/components/data-table/data-table';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/use-translation';
import { show as workOrdersShow } from '@/routes/work-orders';
import type { DataTableColumn, PaginatedData, RowAction } from '@/types/datatable';

type Branch = { id: number; name: string; code: string };

type Row = {
    id: number;
    work_order_number: string;
    description: string;
    priority: string;
    status: string;
    progress_percent: number;
    resolution_due_at: string | null;
    escalation_level: number;
    created_at: string;
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
};

export default function MyWorkOrders({ items }: Props) {
    const { t } = useTranslation();

    const columns: DataTableColumn<Row>[] = [
        {
            key: 'asset',
            label: t('work_orders.fields.asset'),
            sortable: false,
            render: (row) => (
                <div className="min-w-0">
                    <div className="truncate font-medium">{row.asset?.name || '-'}</div>
                    <div className="truncate text-xs text-muted-foreground">{row.asset?.code || '-'}</div>
                    <div className="truncate text-xs text-muted-foreground">{row.work_order_number}</div>
                    <div className="mt-1 truncate text-xs text-muted-foreground">{row.description}</div>
                </div>
            ),
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

    return (
        <>
            <Head title={t('work_orders.my_title')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <Heading variant="small" title={t('work_orders.my_title')} description={t('work_orders.my_description')} />

                <DataTable
                    tableId="work-orders-my"
                    routePrefix="/work-orders/my"
                    data={items}
                    columns={columns}
                    mobileView="cards"
                    rowActions={rowActions}
                    searchable={false}
                />
            </div>
        </>
    );
}
