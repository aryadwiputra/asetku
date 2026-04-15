import { Head, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';

import DepartmentController from '@/actions/App/Http/Controllers/MasterData/DepartmentController';
import Heading from '@/components/heading';
import { DataTable } from '@/components/data-table/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { index as masterDataIndex } from '@/routes/master-data';
import { index as departmentsIndex } from '@/routes/master-data/departments';
import type { DataTableColumn, PaginatedData, RowAction } from '@/types/datatable';

type Row = {
    id: number;
    name: string;
    code: string;
    description: string | null;
    created_at: string;
    branch: { id: number; name: string; code: string } | null;
};

type Props = {
    items: PaginatedData<Row>;
};

export default function DepartmentsIndex({ items }: Props) {
    const { masterDataAbilities } = usePage().props as {
        masterDataAbilities: Record<string, { view: boolean; create: boolean; update: boolean; delete: boolean }>;
    };
    const abilities = masterDataAbilities.departments ?? { view: false, create: false, update: false, delete: false };
    const { t } = useTranslation();

    const columns: DataTableColumn<Row>[] = [
        { key: 'name', label: t('common.name'), sortable: true },
        { key: 'code', label: t('departments.fields.code'), sortable: true },
        {
            key: 'branch',
            label: t('departments.fields.branch'),
            sortable: false,
            render: (row) =>
                row.branch ? (
                    <div className="flex flex-wrap items-center gap-2">
                        <span>{row.branch.name}</span>
                        <Badge variant="secondary">{row.branch.code}</Badge>
                    </div>
                ) : (
                    '—'
                ),
        },
        { key: 'created_at', label: t('common.created'), sortable: true },
    ];

    const rowActions: RowAction<Row>[] = [
        {
            key: 'edit',
            label: t('common.edit'),
            icon: <Pencil className="mr-2 h-4 w-4" />,
            onClick: (row) => router.visit(DepartmentController.edit.url({ department: row.id })),
            visible: () => abilities.update,
        },
        {
            key: 'delete',
            label: t('common.delete'),
            icon: <Trash2 className="mr-2 h-4 w-4" />,
            variant: 'destructive',
            onClick: (row) => {
                if (confirm(t('departments.actions.delete_confirm', { name: row.name }))) {
                    router.delete(DepartmentController.destroy.url({ department: row.id }));
                }
            },
            visible: () => abilities.delete,
        },
    ];

    return (
        <>
            <Head title={t('departments.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Heading variant="small" title={t('departments.title')} description={t('departments.description')} />

                    {abilities.create ? (
                        <Button onClick={() => router.visit(DepartmentController.create.url())}>
                            <Plus className="mr-2 h-4 w-4" />
                            {t('departments.actions.new')}
                        </Button>
                    ) : null}
                </div>

                <DataTable
                    tableId="departments"
                    data={items}
                    columns={columns}
                    rowActions={rowActions}
                    routePrefix={departmentsIndex()}
                    mobileView="cards"
                />
            </div>
        </>
    );
}

DepartmentsIndex.layout = {
    breadcrumbs: [
        { title: 'common.master_data', href: masterDataIndex() },
        { title: 'departments.title', href: departmentsIndex() },
    ],
};

