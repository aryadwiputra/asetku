import { Head, router, usePage } from '@inertiajs/react';
import { Pencil, Plus } from 'lucide-react';

import Heading from '@/components/heading';
import { DataTable } from '@/components/data-table/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { create as schedulesCreate, edit as schedulesEdit } from '@/routes/maintenance-schedules';
import type { DataTableColumn, PaginatedData, RowAction } from '@/types/datatable';

type Row = {
    id: number;
    name: string;
    interval_days: number;
    next_due_at: string;
    is_active: boolean;
    asset: { id: number; code: string; name: string; branch: { id: number; name: string; code: string } | null } | null;
    checklist_template: { id: number; name: string } | null;
};

type Props = {
    items: PaginatedData<Row>;
    filtersMeta: { activeOptions: { value: string; label: string }[] };
};

export default function MaintenanceSchedulesIndex({ items, filtersMeta }: Props) {
    const { t } = useTranslation();
    const { orgRole, permissions } = usePage().props as { orgRole: string | null; permissions: string[] };

    const canCreate =
        permissions.includes('maintenance_schedule.create') || ['Owner', 'Admin', 'Manager'].includes(orgRole || '');

    const columns: DataTableColumn<Row>[] = [
        {
            key: 'asset',
            label: t('maintenance_schedules.fields.asset'),
            sortable: false,
            render: (row) => (
                <div className="min-w-0">
                    <div className="truncate font-medium">{row.asset?.name || '-'}</div>
                    <div className="truncate text-xs text-muted-foreground">{row.asset?.code || '-'}</div>
                </div>
            ),
        },
        {
            key: 'name',
            label: t('maintenance_schedules.fields.name'),
            sortable: false,
            render: (row) => <span className="text-sm">{row.name}</span>,
        },
        {
            key: 'next_due_at',
            label: t('maintenance_schedules.fields.next_due_at'),
            sortable: false,
            render: (row) => <span className="text-sm">{row.next_due_at}</span>,
        },
        {
            key: 'interval_days',
            label: t('maintenance_schedules.fields.interval_days'),
            sortable: false,
            render: (row) => <span className="text-sm">{row.interval_days}</span>,
        },
        {
            key: 'is_active',
            label: t('common.status'),
            sortable: false,
            render: (row) => (
                <Badge variant={row.is_active ? 'default' : 'secondary'}>
                    {row.is_active ? t('common.active') : t('common.inactive')}
                </Badge>
            ),
        },
    ];

    const rowActions: RowAction<Row>[] = [
        {
            key: 'edit',
            label: t('common.edit'),
            icon: <Pencil className="mr-2 h-4 w-4" />,
            onClick: (row) => router.visit(schedulesEdit(row.id).url),
            visible: () => true,
        },
    ];

    return (
        <>
            <Head title={t('maintenance_schedules.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Heading variant="small" title={t('maintenance_schedules.title')} description={t('maintenance_schedules.description')} />

                    {canCreate ? (
                        <Button onClick={() => router.visit(schedulesCreate().url)} className="w-full sm:w-auto">
                            <Plus className="mr-2 h-4 w-4" />
                            {t('maintenance_schedules.actions.new')}
                        </Button>
                    ) : null}
                </div>

                <DataTable
                    tableId="maintenance-schedules"
                    routePrefix="/maintenance-schedules"
                    data={items}
                    columns={columns}
                    mobileView="cards"
                    rowActions={rowActions}
                    filters={[{ key: 'active', label: t('common.status'), options: filtersMeta.activeOptions }]}
                />
            </div>
        </>
    );
}
