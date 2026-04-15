import { Head, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';

import VendorContractController from '@/actions/App/Http/Controllers/MasterData/VendorContractController';
import Heading from '@/components/heading';
import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { index as masterDataIndex } from '@/routes/master-data';
import { index as vendorContractsIndex } from '@/routes/master-data/vendor-contracts';
import type { DataTableColumn, PaginatedData, RowAction } from '@/types/datatable';

type Row = {
    id: number;
    vendor_name: string;
    contract_number: string | null;
    start_date: string | null;
    end_date: string | null;
    created_at: string;
};

type Props = {
    items: PaginatedData<Row>;
};

export default function VendorContractsIndex({ items }: Props) {
    const { masterDataAbilities } = usePage().props as {
        masterDataAbilities: Record<string, { view: boolean; create: boolean; update: boolean; delete: boolean }>;
    };
    const abilities = masterDataAbilities.vendor_contracts ?? { view: false, create: false, update: false, delete: false };
    const { t } = useTranslation();

    const columns: DataTableColumn<Row>[] = [
        { key: 'vendor_name', label: t('vendor_contracts.fields.vendor_name'), sortable: true },
        { key: 'contract_number', label: t('vendor_contracts.fields.contract_number'), sortable: true },
        { key: 'start_date', label: t('vendor_contracts.fields.start_date'), sortable: true },
        { key: 'end_date', label: t('vendor_contracts.fields.end_date'), sortable: true },
        { key: 'created_at', label: t('common.created'), sortable: true },
    ];

    const rowActions: RowAction<Row>[] = [
        {
            key: 'edit',
            label: t('common.edit'),
            icon: <Pencil className="mr-2 h-4 w-4" />,
            onClick: (row) => router.visit(VendorContractController.edit.url({ vendor_contract: row.id })),
            visible: () => abilities.update,
        },
        {
            key: 'delete',
            label: t('common.delete'),
            icon: <Trash2 className="mr-2 h-4 w-4" />,
            variant: 'destructive',
            onClick: (row) => {
                if (confirm(t('vendor_contracts.actions.delete_confirm', { name: row.vendor_name }))) {
                    router.delete(VendorContractController.destroy.url({ vendor_contract: row.id }));
                }
            },
            visible: () => abilities.delete,
        },
    ];

    return (
        <>
            <Head title={t('vendor_contracts.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Heading variant="small" title={t('vendor_contracts.title')} description={t('vendor_contracts.description')} />

                    {abilities.create ? (
                        <Button onClick={() => router.visit(VendorContractController.create.url())}>
                            <Plus className="mr-2 h-4 w-4" />
                            {t('vendor_contracts.actions.new')}
                        </Button>
                    ) : null}
                </div>

                <DataTable
                    tableId="vendor-contracts"
                    data={items}
                    columns={columns}
                    rowActions={rowActions}
                    routePrefix={vendorContractsIndex()}
                    mobileView="cards"
                />
            </div>
        </>
    );
}

VendorContractsIndex.layout = {
    breadcrumbs: [
        { title: 'common.master_data', href: masterDataIndex() },
        { title: 'vendor_contracts.title', href: vendorContractsIndex() },
    ],
};

