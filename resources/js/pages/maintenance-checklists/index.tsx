import { Head, router, usePage } from '@inertiajs/react';
import { Pencil, Plus } from 'lucide-react';

import Heading from '@/components/heading';
import { DataTable } from '@/components/data-table/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { create as templatesCreate, edit as templatesEdit } from '@/routes/maintenance-checklists';
import type { DataTableColumn, PaginatedData, RowAction } from '@/types/datatable';

type Row = {
    id: number;
    name: string;
    is_active: boolean;
    required_skill: string | null;
    category: { id: number; name: string; code: string; parent_id: number | null } | null;
};

type Props = {
    items: PaginatedData<Row>;
    filtersMeta: { activeOptions: { value: string; label: string }[] };
};

export default function MaintenanceChecklistsIndex({ items, filtersMeta }: Props) {
    const { t } = useTranslation();
    const { orgRole, permissions } = usePage().props as { orgRole: string | null; permissions: string[] };

    const canCreate =
        permissions.includes('maintenance_checklist.create') || ['Owner', 'Admin', 'Manager'].includes(orgRole || '');

    const columns: DataTableColumn<Row>[] = [
        {
            key: 'name',
            label: t('maintenance_checklists.fields.name'),
            sortable: false,
            render: (row) => (
                <div className="min-w-0">
                    <div className="truncate font-medium">{row.name}</div>
                    <div className="truncate text-xs text-muted-foreground">{row.category?.name || t('common.all')}</div>
                </div>
            ),
        },
        {
            key: 'required_skill',
            label: t('maintenance_checklists.fields.required_skill'),
            sortable: false,
            render: (row) => <span className="text-sm">{row.required_skill || '-'}</span>,
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
            onClick: (row) => router.visit(templatesEdit(row.id).url),
            visible: () => true,
        },
    ];

    return (
        <>
            <Head title={t('maintenance_checklists.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Heading variant="small" title={t('maintenance_checklists.title')} description={t('maintenance_checklists.description')} />
                    {canCreate ? (
                        <Button onClick={() => router.visit(templatesCreate().url)} className="w-full sm:w-auto">
                            <Plus className="mr-2 h-4 w-4" />
                            {t('maintenance_checklists.actions.new')}
                        </Button>
                    ) : null}
                </div>

                <DataTable
                    tableId="maintenance-checklists"
                    routePrefix="/maintenance-checklists"
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

