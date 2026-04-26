import { Head, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, ShieldAlert, Trash2 } from 'lucide-react';

import VendorController from '@/actions/App/Http/Controllers/MasterData/VendorController';
import Heading from '@/components/heading';
import { DataTable } from '@/components/data-table/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { index as masterDataIndex } from '@/routes/master-data';
import { index as vendorsIndex } from '@/routes/master-data/vendors';
import type { DataTableColumn, PaginatedData, RowAction } from '@/types/datatable';

type Row = {
    id: number;
    name: string;
    tax_number: string | null;
    service_category: string | null;
    is_blacklisted: boolean;
    contracts_count: number;
    rating: { total: number | null };
    created_at: string;
};

type Props = {
    items: PaginatedData<Row>;
};

export default function VendorsIndex({ items }: Props) {
    const { masterDataAbilities } = usePage().props as { masterDataAbilities: Record<string, { create: boolean; update: boolean; delete: boolean }> };
    const abilities = masterDataAbilities.vendors ?? { create: false, update: false, delete: false };
    const { t } = useTranslation();

    const columns: DataTableColumn<Row>[] = [
        { key: 'name', label: t('vendors.fields.name'), sortable: true },
        { key: 'service_category', label: t('vendors.fields.service_category'), sortable: true },
        {
            key: 'is_blacklisted',
            label: t('vendors.fields.is_blacklisted'),
            sortable: true,
            render: (row) => row.is_blacklisted ? <Badge variant="destructive">{t('vendors.fields.is_blacklisted')}</Badge> : <Badge variant="secondary">{t('common.active')}</Badge>,
        },
        { key: 'contracts_count', label: t('vendors.fields.contracts_count'), sortable: false },
        {
            key: 'rating.total',
            label: t('vendors.fields.rating_total'),
            sortable: false,
            render: (row) => row.rating.total ?? '—',
        },
        { key: 'created_at', label: t('common.created'), sortable: true },
    ];

    const rowActions: RowAction<Row>[] = [
        {
            key: 'edit',
            label: t('common.edit'),
            icon: <Pencil className="mr-2 h-4 w-4" />,
            onClick: (row) => router.visit(VendorController.edit.url({ vendor: row.id })),
            visible: () => abilities.update,
        },
        {
            key: 'delete',
            label: t('common.delete'),
            icon: <Trash2 className="mr-2 h-4 w-4" />,
            variant: 'destructive',
            onClick: (row) => {
                if (confirm(t('vendors.actions.delete_confirm', { name: row.name }))) {
                    router.delete(VendorController.destroy.url({ vendor: row.id }));
                }
            },
            visible: () => abilities.delete,
        },
    ];

    return (
        <>
            <Head title={t('vendors.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Heading variant="small" title={t('vendors.title')} description={t('vendors.description')} />

                    {abilities.create ? (
                        <Button onClick={() => router.visit(VendorController.create.url())}>
                            <Plus className="mr-2 h-4 w-4" />
                            {t('vendors.actions.new')}
                        </Button>
                    ) : null}
                </div>

                <div className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 font-medium text-foreground">
                        <ShieldAlert className="h-4 w-4" />
                        {t('vendors.description')}
                    </div>
                </div>

                <DataTable tableId="vendors" data={items} columns={columns} rowActions={rowActions} routePrefix={vendorsIndex.url()} mobileView="cards" />
            </div>
        </>
    );
}

VendorsIndex.layout = {
    breadcrumbs: [
        { title: 'common.master_data', href: masterDataIndex.url() },
        { title: 'vendors.title', href: vendorsIndex.url() },
    ],
};
