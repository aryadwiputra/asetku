import { Head, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';

import WarrantyController from '@/actions/App/Http/Controllers/MasterData/WarrantyController';
import Heading from '@/components/heading';
import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { index as masterDataIndex } from '@/routes/master-data';
import { index as warrantiesIndex } from '@/routes/master-data/warranties';
import type { DataTableColumn, PaginatedData, RowAction } from '@/types/datatable';

type Row = {
    id: number;
    name: string;
    duration_months: number;
    notes: string | null;
    created_at: string;
};

type Props = {
    items: PaginatedData<Row>;
};

export default function WarrantiesIndex({ items }: Props) {
    const { masterDataAbilities } = usePage().props;
    const abilities = masterDataAbilities.warranties ?? { view: false, create: false, update: false, delete: false };
    const { t } = useTranslation();

    const columns: DataTableColumn<Row>[] = [
        { key: 'name', label: t('common.name'), sortable: true },
        { key: 'duration_months', label: t('warranties.fields.duration_months'), sortable: true },
        { key: 'created_at', label: t('common.created'), sortable: true },
    ];

    const rowActions: RowAction<Row>[] = [
        {
            key: 'edit',
            label: t('common.edit'),
            icon: <Pencil className="mr-2 h-4 w-4" />,
            onClick: (row) => router.visit(WarrantyController.edit.url({ warranty: row.id })),
            visible: () => abilities.update,
        },
        {
            key: 'delete',
            label: t('common.delete'),
            icon: <Trash2 className="mr-2 h-4 w-4" />,
            variant: 'destructive',
            onClick: (row) => {
                if (confirm(t('warranties.actions.delete_confirm', { name: row.name }))) {
                    router.delete(WarrantyController.destroy.url({ warranty: row.id }));
                }
            },
            visible: () => abilities.delete,
        },
    ];

    return (
        <>
            <Head title={t('warranties.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Heading variant="small" title={t('warranties.title')} description={t('warranties.description')} />

                    {abilities.create ? (
                        <Button onClick={() => router.visit(WarrantyController.create.url())}>
                            <Plus className="mr-2 h-4 w-4" />
                            {t('warranties.actions.new')}
                        </Button>
                    ) : null}
                </div>

                <DataTable
                    tableId="warranties"
                    data={items}
                    columns={columns}
                    rowActions={rowActions}
                    routePrefix={warrantiesIndex.url()}
                    mobileView="cards"
                />
            </div>
        </>
    );
}

WarrantiesIndex.layout = {
    breadcrumbs: [
        { title: 'common.master_data', href: masterDataIndex.url() },
        { title: 'warranties.title', href: warrantiesIndex.url() },
    ],
};
