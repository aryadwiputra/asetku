import { Head, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';

import AssetLocationController from '@/actions/App/Http/Controllers/MasterData/AssetLocationController';
import Heading from '@/components/heading';
import { DataTable } from '@/components/data-table/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { index as masterDataIndex } from '@/routes/master-data';
import { index as assetLocationsIndex } from '@/routes/master-data/asset-locations';
import type { DataTableColumn, PaginatedData, RowAction } from '@/types/datatable';

type Row = {
    id: number;
    name: string;
    code: string;
    description: string | null;
    created_at: string;
    parent: { id: number; name: string; code: string } | null;
};

type Props = {
    items: PaginatedData<Row>;
};

export default function AssetLocationsIndex({ items }: Props) {
    const { masterDataAbilities } = usePage().props;
    const abilities = masterDataAbilities.asset_locations ?? { view: false, create: false, update: false, delete: false };
    const { t } = useTranslation();

    const columns: DataTableColumn<Row>[] = [
        { key: 'name', label: t('common.name'), sortable: true },
        { key: 'code', label: t('asset_locations.fields.code'), sortable: true },
        {
            key: 'parent',
            label: t('asset_locations.fields.parent'),
            sortable: false,
            render: (row) =>
                row.parent ? (
                    <div className="flex flex-wrap items-center gap-2">
                        <span>{row.parent.name}</span>
                        <Badge variant="secondary">{row.parent.code}</Badge>
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
            onClick: (row) => router.visit(AssetLocationController.edit.url({ asset_location: row.id })),
            visible: () => abilities.update,
        },
        {
            key: 'delete',
            label: t('common.delete'),
            icon: <Trash2 className="mr-2 h-4 w-4" />,
            variant: 'destructive',
            onClick: (row) => {
                if (confirm(t('asset_locations.actions.delete_confirm', { name: row.name }))) {
                    router.delete(AssetLocationController.destroy.url({ asset_location: row.id }));
                }
            },
            visible: () => abilities.delete,
        },
    ];

    return (
        <>
            <Head title={t('asset_locations.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Heading variant="small" title={t('asset_locations.title')} description={t('asset_locations.description')} />

                    {abilities.create ? (
                        <Button onClick={() => router.visit(AssetLocationController.create.url())}>
                            <Plus className="mr-2 h-4 w-4" />
                            {t('asset_locations.actions.new')}
                        </Button>
                    ) : null}
                </div>

                <DataTable
                    tableId="asset-locations"
                    data={items}
                    columns={columns}
                    rowActions={rowActions}
                    routePrefix={assetLocationsIndex.url()}
                    mobileView="cards"
                />
            </div>
        </>
    );
}

AssetLocationsIndex.layout = {
    breadcrumbs: [
        { title: 'common.master_data', href: masterDataIndex.url() },
        { title: 'asset_locations.title', href: assetLocationsIndex.url() },
    ],
};
