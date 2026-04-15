import { Head, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';

import AssetClassController from '@/actions/App/Http/Controllers/MasterData/AssetClassController';
import Heading from '@/components/heading';
import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { index as assetClassesIndex } from '@/routes/master-data/asset-classes';
import { index as masterDataIndex } from '@/routes/master-data';
import type { DataTableColumn, PaginatedData, RowAction } from '@/types/datatable';

type Row = {
    id: number;
    name: string;
    code: string;
    description: string | null;
    created_at: string;
};

type Props = {
    items: PaginatedData<Row>;
};

export default function AssetClassesIndex({ items }: Props) {
    const { masterDataAbilities } = usePage().props;
    const abilities = masterDataAbilities.asset_classes ?? { view: false, create: false, update: false, delete: false };
    const { t } = useTranslation();

    const columns: DataTableColumn<Row>[] = [
        { key: 'name', label: t('common.name'), sortable: true },
        { key: 'code', label: t('asset_classes.fields.code'), sortable: true },
        { key: 'description', label: t('asset_classes.fields.description'), sortable: false },
        { key: 'created_at', label: t('common.created'), sortable: true },
    ];

    const rowActions: RowAction<Row>[] = [
        {
            key: 'edit',
            label: t('common.edit'),
            icon: <Pencil className="mr-2 h-4 w-4" />,
            onClick: (row) => router.visit(AssetClassController.edit.url({ asset_class: row.id })),
            visible: () => abilities.update,
        },
        {
            key: 'delete',
            label: t('common.delete'),
            icon: <Trash2 className="mr-2 h-4 w-4" />,
            variant: 'destructive',
            onClick: (row) => {
                if (confirm(t('asset_classes.actions.delete_confirm', { name: row.name }))) {
                    router.delete(AssetClassController.destroy.url({ asset_class: row.id }));
                }
            },
            visible: () => abilities.delete,
        },
    ];

    return (
        <>
            <Head title={t('asset_classes.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Heading variant="small" title={t('asset_classes.title')} description={t('asset_classes.description')} />

                    {abilities.create ? (
                        <Button onClick={() => router.visit(AssetClassController.create.url())}>
                            <Plus className="mr-2 h-4 w-4" />
                            {t('asset_classes.actions.new')}
                        </Button>
                    ) : null}
                </div>

                <DataTable
                    tableId="asset-classes"
                    data={items}
                    columns={columns}
                    rowActions={rowActions}
                    routePrefix={assetClassesIndex.url()}
                    mobileView="cards"
                />
            </div>
        </>
    );
}

AssetClassesIndex.layout = {
    breadcrumbs: [
        { title: 'common.master_data', href: masterDataIndex.url() },
        { title: 'asset_classes.title', href: assetClassesIndex.url() },
    ],
};
