import { Head, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';

import AssetUserController from '@/actions/App/Http/Controllers/MasterData/AssetUserController';
import Heading from '@/components/heading';
import { DataTable } from '@/components/data-table/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { index as masterDataIndex } from '@/routes/master-data';
import { index as assetUsersIndex } from '@/routes/master-data/asset-users';
import type { DataTableColumn, PaginatedData, RowAction } from '@/types/datatable';

type Row = {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    created_at: string;
    department: { id: number; name: string; code: string } | null;
};

type Props = {
    items: PaginatedData<Row>;
};

export default function AssetUsersIndex({ items }: Props) {
    const { masterDataAbilities } = usePage().props;
    const abilities = masterDataAbilities.asset_users ?? { view: false, create: false, update: false, delete: false };
    const { t } = useTranslation();

    const columns: DataTableColumn<Row>[] = [
        { key: 'name', label: t('common.name'), sortable: true },
        { key: 'email', label: t('asset_users.fields.email'), sortable: true },
        { key: 'phone', label: t('asset_users.fields.phone'), sortable: false },
        {
            key: 'department',
            label: t('asset_users.fields.department'),
            sortable: false,
            render: (row) =>
                row.department ? (
                    <div className="flex flex-wrap items-center gap-2">
                        <span>{row.department.name}</span>
                        <Badge variant="secondary">{row.department.code}</Badge>
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
            onClick: (row) => router.visit(AssetUserController.edit.url({ asset_user: row.id })),
            visible: () => abilities.update,
        },
        {
            key: 'delete',
            label: t('common.delete'),
            icon: <Trash2 className="mr-2 h-4 w-4" />,
            variant: 'destructive',
            onClick: (row) => {
                if (confirm(t('asset_users.actions.delete_confirm', { name: row.name }))) {
                    router.delete(AssetUserController.destroy.url({ asset_user: row.id }));
                }
            },
            visible: () => abilities.delete,
        },
    ];

    return (
        <>
            <Head title={t('asset_users.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Heading variant="small" title={t('asset_users.title')} description={t('asset_users.description')} />

                    {abilities.create ? (
                        <Button onClick={() => router.visit(AssetUserController.create.url())}>
                            <Plus className="mr-2 h-4 w-4" />
                            {t('asset_users.actions.new')}
                        </Button>
                    ) : null}
                </div>

                <DataTable
                    tableId="asset-users"
                    data={items}
                    columns={columns}
                    rowActions={rowActions}
                    routePrefix={assetUsersIndex.url()}
                    mobileView="cards"
                />
            </div>
        </>
    );
}

AssetUsersIndex.layout = {
    breadcrumbs: [
        { title: 'common.master_data', href: masterDataIndex.url() },
        { title: 'asset_users.title', href: assetUsersIndex.url() },
    ],
};
