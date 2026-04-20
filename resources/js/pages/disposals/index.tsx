import { Head, router, usePage } from '@inertiajs/react';
import { Eye, Plus } from 'lucide-react';

import Heading from '@/components/heading';
import { DataTable } from '@/components/data-table/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { create as disposalsCreate, index as disposalsIndex, show as disposalsShow } from '@/routes/disposals';
import type { DataTableColumn, PaginatedData, RowAction } from '@/types/datatable';

type Branch = { id: number; name: string; code: string };

type Row = {
    id: number;
    type: string;
    status: string;
    disposed_at: string | null;
    executed_at: string | null;
    currency_code: string | null;
    net_proceeds_amount: string | null;
    book_value_at_disposal: string | null;
    gain_loss_amount: string | null;
    created_at: string;
    asset: {
        id: number;
        code: string;
        name: string;
        branch: Branch | null;
        status: { id: number; name: string; code: string } | null;
        condition: { id: number; name: string; code: string } | null;
    };
};

type Props = {
    items: PaginatedData<Row>;
    filtersMeta: {
        branches: Branch[];
        statuses: string[];
        types: string[];
    };
};

export default function DisposalsIndex({ items, filtersMeta }: Props) {
    const { t } = useTranslation();
    const { orgRole, permissions } = usePage().props as { orgRole: string | null; permissions: string[] };

    const canCreate =
        permissions.includes('asset_disposal.create') || ['Owner', 'Admin', 'Manager'].includes(orgRole || '');

    const columns: DataTableColumn<Row>[] = [
        {
            key: 'asset',
            label: t('disposals.fields.asset'),
            sortable: false,
            render: (row) => (
                <div className="min-w-0">
                    <div className="truncate font-medium">{row.asset?.name || '-'}</div>
                    <div className="truncate text-xs text-muted-foreground">{row.asset?.code || '-'}</div>
                </div>
            ),
        },
        {
            key: 'type',
            label: t('disposals.fields.type'),
            sortable: false,
            render: (row) => <Badge variant="secondary">{t(`disposals.types.${row.type}`)}</Badge>,
        },
        {
            key: 'status',
            label: t('disposals.fields.status'),
            sortable: false,
            render: (row) => <Badge>{t(`disposals.status.${row.status}`)}</Badge>,
        },
        {
            key: 'branch',
            label: t('common.branch'),
            sortable: false,
            render: (row) => <span className="text-sm">{row.asset?.branch ? row.asset.branch.code : '-'}</span>,
        },
        {
            key: 'disposed_at',
            label: t('disposals.fields.disposed_at'),
            sortable: false,
            render: (row) => <span className="text-sm">{row.disposed_at || '-'}</span>,
        },
        {
            key: 'gain_loss_amount',
            label: t('disposals.fields.gain_loss'),
            sortable: false,
            render: (row) => (
                <span className="text-sm">
                    {row.gain_loss_amount !== null ? row.gain_loss_amount : '-'}
                </span>
            ),
        },
    ];

    const rowActions: RowAction<Row>[] = [
        {
            key: 'view',
            label: t('common.view'),
            icon: <Eye className="mr-2 h-4 w-4" />,
            onClick: (row) => router.visit(disposalsShow(row.id).url),
            visible: () => true,
        },
    ];

    const branchOptions = filtersMeta.branches.map((b) => ({ value: String(b.id), label: `${b.code} • ${b.name}` }));
    const statusOptions = filtersMeta.statuses.map((s) => ({ value: s, label: t(`disposals.status.${s}`) }));
    const typeOptions = filtersMeta.types.map((s) => ({ value: s, label: t(`disposals.types.${s}`) }));

    return (
        <>
            <Head title={t('disposals.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Heading variant="small" title={t('disposals.title')} description={t('disposals.description')} />

                    {canCreate ? (
                        <Button onClick={() => router.visit(disposalsCreate())} className="w-full sm:w-auto">
                            <Plus className="mr-2 h-4 w-4" />
                            {t('disposals.actions.new')}
                        </Button>
                    ) : null}
                </div>

                <DataTable
                    tableId="disposals"
                    data={items}
                    columns={columns}
                    rowActions={rowActions}
                    mobileView="cards"
                    routePrefix={disposalsIndex.url()}
                    filters={[
                        { key: 'branch_id', label: t('common.branch'), options: branchOptions },
                        { key: 'status', label: t('disposals.fields.status'), options: statusOptions },
                        { key: 'type', label: t('disposals.fields.type'), options: typeOptions },
                    ]}
                />
            </div>
        </>
    );
}

DisposalsIndex.layout = {
    breadcrumbs: [{ title: 'disposals.title', href: disposalsIndex.url() }],
};
