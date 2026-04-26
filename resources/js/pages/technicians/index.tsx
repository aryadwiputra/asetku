import { Head, router, usePage } from '@inertiajs/react';
import { Pencil, Plus } from 'lucide-react';

import Heading from '@/components/heading';
import { DataTable } from '@/components/data-table/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { create as techniciansCreate, edit as techniciansEdit } from '@/routes/technicians';
import type { DataTableColumn, PaginatedData, RowAction } from '@/types/datatable';

type Row = {
    id: number;
    is_active: boolean;
    is_available: boolean;
    skills: string[] | null;
    user: { id: number; name: string; email: string | null } | null;
    branch: { id: number; name: string; code: string } | null;
};

type Props = {
    items: PaginatedData<Row>;
};

export default function TechniciansIndex({ items }: Props) {
    const { t } = useTranslation();
    const { orgRole, permissions } = usePage().props as { orgRole: string | null; permissions: string[] };

    const canCreate = permissions.includes('technician.create') || ['Owner', 'Admin', 'Manager'].includes(orgRole || '');

    const columns: DataTableColumn<Row>[] = [
        {
            key: 'user',
            label: t('technicians.fields.user'),
            sortable: false,
            render: (row) => (
                <div className="min-w-0">
                    <div className="truncate font-medium">{row.user?.name || '-'}</div>
                    <div className="truncate text-xs text-muted-foreground">{row.user?.email || '-'}</div>
                </div>
            ),
        },
        {
            key: 'branch',
            label: t('common.branch'),
            sortable: false,
            render: (row) => <span className="text-sm">{row.branch ? row.branch.code : '-'}</span>,
        },
        {
            key: 'skills',
            label: t('technicians.fields.skills'),
            sortable: false,
            render: (row) => <span className="text-sm">{(row.skills || []).join(', ') || '-'}</span>,
        },
        {
            key: 'status',
            label: t('common.status'),
            sortable: false,
            render: (row) => (
                <div className="flex flex-wrap gap-2">
                    <Badge variant={row.is_active ? 'default' : 'secondary'}>
                        {row.is_active ? t('common.active') : t('common.inactive')}
                    </Badge>
                    <Badge variant={row.is_available ? 'outline' : 'secondary'}>
                        {row.is_available ? t('technicians.labels.available') : t('technicians.labels.unavailable')}
                    </Badge>
                </div>
            ),
        },
    ];

    const rowActions: RowAction<Row>[] = [
        {
            key: 'edit',
            label: t('common.edit'),
            icon: <Pencil className="mr-2 h-4 w-4" />,
            onClick: (row) => router.visit(techniciansEdit(row.id).url),
            visible: () => true,
        },
    ];

    return (
        <>
            <Head title={t('technicians.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Heading variant="small" title={t('technicians.title')} description={t('technicians.description')} />
                    {canCreate ? (
                        <Button onClick={() => router.visit(techniciansCreate().url)} className="w-full sm:w-auto">
                            <Plus className="mr-2 h-4 w-4" />
                            {t('technicians.actions.new')}
                        </Button>
                    ) : null}
                </div>

                <DataTable
                    tableId="technicians"
                    routePrefix="/technicians"
                    data={items}
                    columns={columns}
                    mobileView="cards"
                    rowActions={rowActions}
                />
            </div>
        </>
    );
}

