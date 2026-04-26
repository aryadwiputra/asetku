import { Head, Link, router } from '@inertiajs/react';
import { Eye, FileClock, Pencil, Plus, RefreshCcw, Trash2 } from 'lucide-react';

import VendorContractController from '@/actions/App/Http/Controllers/VendorContractController';
import Heading from '@/components/heading';
import { DataTable } from '@/components/data-table/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { index as vendorContractsIndex } from '@/routes/vendor-contracts';
import type { DataTableColumn, PaginatedData, RowAction } from '@/types/datatable';

type Row = {
    id: number;
    title: string;
    vendor: { id: number; name: string; is_blacklisted: boolean } | null;
    type: string;
    contract_number: string | null;
    status: string;
    baseline_cost: string | null;
    start_date: string | null;
    end_date: string | null;
    assets_count: number;
    maintenance_cost_total: string | null;
    created_at: string;
};

type Props = {
    items: PaginatedData<Row>;
};

export default function VendorContractsIndex({ items }: Props) {
    const { t } = useTranslation();

    const columns: DataTableColumn<Row>[] = [
        { key: 'title', label: t('vendor_contracts.fields.title'), sortable: true },
        { key: 'vendor.name', label: t('vendor_contracts.fields.vendor'), sortable: false, render: (row) => row.vendor?.name ?? '—' },
        { key: 'type', label: t('vendor_contracts.fields.type'), sortable: true, render: (row) => t(`vendor_contracts.types.${row.type}`) },
        {
            key: 'status',
            label: t('vendor_contracts.fields.status'),
            sortable: true,
            render: (row) => <Badge variant={row.status === 'expired' ? 'destructive' : 'secondary'}>{t(`vendor_contracts.statuses.${row.status}`)}</Badge>,
        },
        { key: 'end_date', label: t('vendor_contracts.fields.end_date'), sortable: true },
        { key: 'assets_count', label: t('vendor_contracts.fields.assets'), sortable: false },
    ];

    const rowActions: RowAction<Row>[] = [
        {
            key: 'view',
            label: t('common.view'),
            icon: <Eye className="mr-2 h-4 w-4" />,
            onClick: (row) => router.visit(VendorContractController.show.url({ vendor_contract: row.id })),
            visible: () => true,
        },
        {
            key: 'edit',
            label: t('common.edit'),
            icon: <Pencil className="mr-2 h-4 w-4" />,
            onClick: (row) => router.visit(VendorContractController.edit.url({ vendor_contract: row.id })),
            visible: () => true,
        },
        {
            key: 'renew',
            label: t('vendor_contracts.actions.renew'),
            icon: <RefreshCcw className="mr-2 h-4 w-4" />,
            onClick: (row) => router.post(VendorContractController.renew.url({ vendorContract: row.id })),
            visible: () => true,
        },
        {
            key: 'delete',
            label: t('common.delete'),
            icon: <Trash2 className="mr-2 h-4 w-4" />,
            variant: 'destructive',
            onClick: (row) => {
                if (confirm(t('vendor_contracts.actions.delete_confirm', { name: row.title }))) {
                    router.delete(VendorContractController.destroy.url({ vendor_contract: row.id }));
                }
            },
            visible: () => true,
        },
    ];

    return (
        <>
            <Head title={t('vendor_contracts.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Heading variant="small" title={t('vendor_contracts.title')} description={t('vendor_contracts.description')} />
                    <Button onClick={() => router.visit(VendorContractController.create.url())}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t('vendor_contracts.actions.new')}
                    </Button>
                </div>

                <div className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 font-medium text-foreground">
                        <FileClock className="h-4 w-4" />
                        {t('vendor_contracts.show.description')}
                    </div>
                </div>

                <DataTable tableId="vendor-contracts-operational" data={items} columns={columns} rowActions={rowActions} routePrefix={vendorContractsIndex.url()} mobileView="cards" />
            </div>
        </>
    );
}

VendorContractsIndex.layout = {
    breadcrumbs: [{ title: 'vendor_contracts.title', href: vendorContractsIndex.url() }],
};
