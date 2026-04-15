import { Head, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';

import PersonInChargeController from '@/actions/App/Http/Controllers/MasterData/PersonInChargeController';
import Heading from '@/components/heading';
import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { index as masterDataIndex } from '@/routes/master-data';
import { index as personInChargesIndex } from '@/routes/master-data/person-in-charges';
import type { DataTableColumn, PaginatedData, RowAction } from '@/types/datatable';

type Row = {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    notes: string | null;
    created_at: string;
};

type Props = {
    items: PaginatedData<Row>;
};

export default function PersonInChargesIndex({ items }: Props) {
    const { masterDataAbilities } = usePage().props;
    const abilities = masterDataAbilities.person_in_charges ?? { view: false, create: false, update: false, delete: false };
    const { t } = useTranslation();

    const columns: DataTableColumn<Row>[] = [
        { key: 'name', label: t('common.name'), sortable: true },
        { key: 'email', label: t('person_in_charges.fields.email'), sortable: true },
        { key: 'phone', label: t('person_in_charges.fields.phone'), sortable: false },
        { key: 'created_at', label: t('common.created'), sortable: true },
    ];

    const rowActions: RowAction<Row>[] = [
        {
            key: 'edit',
            label: t('common.edit'),
            icon: <Pencil className="mr-2 h-4 w-4" />,
            onClick: (row) => router.visit(PersonInChargeController.edit.url({ person_in_charge: row.id })),
            visible: () => abilities.update,
        },
        {
            key: 'delete',
            label: t('common.delete'),
            icon: <Trash2 className="mr-2 h-4 w-4" />,
            variant: 'destructive',
            onClick: (row) => {
                if (confirm(t('person_in_charges.actions.delete_confirm', { name: row.name }))) {
                    router.delete(PersonInChargeController.destroy.url({ person_in_charge: row.id }));
                }
            },
            visible: () => abilities.delete,
        },
    ];

    return (
        <>
            <Head title={t('person_in_charges.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Heading variant="small" title={t('person_in_charges.title')} description={t('person_in_charges.description')} />

                    {abilities.create ? (
                        <Button onClick={() => router.visit(PersonInChargeController.create.url())}>
                            <Plus className="mr-2 h-4 w-4" />
                            {t('person_in_charges.actions.new')}
                        </Button>
                    ) : null}
                </div>

                <DataTable
                    tableId="person-in-charges"
                    data={items}
                    columns={columns}
                    rowActions={rowActions}
                    routePrefix={personInChargesIndex.url()}
                    mobileView="cards"
                />
            </div>
        </>
    );
}

PersonInChargesIndex.layout = {
    breadcrumbs: [
        { title: 'common.master_data', href: masterDataIndex.url() },
        { title: 'person_in_charges.title', href: personInChargesIndex.url() },
    ],
};
