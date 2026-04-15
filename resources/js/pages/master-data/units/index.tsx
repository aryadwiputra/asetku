import { Head, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';

import UnitController from '@/actions/App/Http/Controllers/MasterData/UnitController';
import Heading from '@/components/heading';
import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { index as masterDataIndex } from '@/routes/master-data';
import { index as unitsIndex } from '@/routes/master-data/units';
import type { DataTableColumn, PaginatedData, RowAction } from '@/types/datatable';

type Row = {
    id: number;
    name: string;
    symbol: string;
    description: string | null;
    created_at: string;
};

type Props = {
    items: PaginatedData<Row>;
};

export default function UnitsIndex({ items }: Props) {
    const { masterDataAbilities } = usePage().props;
    const abilities = masterDataAbilities.units ?? { view: false, create: false, update: false, delete: false };
    const { t } = useTranslation();

    const columns: DataTableColumn<Row>[] = [
        { key: 'name', label: t('common.name'), sortable: true },
        { key: 'symbol', label: t('units.fields.symbol'), sortable: true },
        { key: 'description', label: t('units.fields.description'), sortable: false },
        { key: 'created_at', label: t('common.created'), sortable: true },
    ];

    const rowActions: RowAction<Row>[] = [
        {
            key: 'edit',
            label: t('common.edit'),
            icon: <Pencil className="mr-2 h-4 w-4" />,
            onClick: (row) => router.visit(UnitController.edit.url({ unit: row.id })),
            visible: () => abilities.update,
        },
        {
            key: 'delete',
            label: t('common.delete'),
            icon: <Trash2 className="mr-2 h-4 w-4" />,
            variant: 'destructive',
            onClick: (row) => {
                if (confirm(t('units.actions.delete_confirm', { name: row.name }))) {
                    router.delete(UnitController.destroy.url({ unit: row.id }));
                }
            },
            visible: () => abilities.delete,
        },
    ];

    return (
        <>
            <Head title={t('units.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Heading variant="small" title={t('units.title')} description={t('units.description')} />

                    {abilities.create ? (
                        <Button onClick={() => router.visit(UnitController.create.url())}>
                            <Plus className="mr-2 h-4 w-4" />
                            {t('units.actions.new')}
                        </Button>
                    ) : null}
                </div>

                <DataTable
                    tableId="units"
                    data={items}
                    columns={columns}
                    rowActions={rowActions}
                    routePrefix={unitsIndex.url()}
                    mobileView="cards"
                />
            </div>
        </>
    );
}

UnitsIndex.layout = {
    breadcrumbs: [
        { title: 'common.master_data', href: masterDataIndex.url() },
        { title: 'units.title', href: unitsIndex.url() },
    ],
};
