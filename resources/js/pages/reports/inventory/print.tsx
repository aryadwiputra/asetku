import { Head, Link } from '@inertiajs/react';
import { Printer } from 'lucide-react';
import { useMemo } from 'react';

import { useTranslation } from '@/hooks/use-translation';
import { toAbsoluteUrl } from '@/lib/utils';
import { show as qrShow } from '@/routes/qr';
import { index as inventoryIndex } from '@/routes/reports/inventory';

type Asset = {
    id: number;
    code: string;
    name: string;
    qr_token: string;
    branch?: { id: number; name: string; code?: string | null } | null;
    department?: { id: number; name: string; code?: string | null } | null;
    location?: { id: number; name: string; code?: string | null } | null;
    status?: { id: number; name: string; code?: string | null } | null;
    condition?: { id: number; name: string; code?: string | null } | null;
    person_in_charge?: { id: number; name: string } | null;
    user?: { id: number; name: string } | null;
};

type Props = {
    branch: { id: number; name: string; code?: string | null };
    search: string | null;
    filters: Record<string, string>;
    assets: Asset[];
    meta: { generated_at: string };
};

export default function InventoryStocktakePrint({ branch, assets, meta }: Props) {
    const { t } = useTranslation();

    const generatedAt = useMemo(() => new Date(meta.generated_at), [meta.generated_at]);

    return (
        <>
            <Head title={t('reports.inventory.stocktake.title')} />

            <div className="p-6 print:p-0">
                <div className="mb-4 flex items-start justify-between gap-4 print:hidden">
                    <div className="min-w-0">
                        <div className="text-sm font-semibold">{t('reports.inventory.stocktake.title')}</div>
                        <div className="mt-1 text-sm text-muted-foreground">
                            {branch.code ? `${branch.code} — ${branch.name}` : branch.name} •{' '}
                            {generatedAt.toLocaleString()}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">{t('reports.inventory.stocktake.hint_print')}</div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                        <Link href={inventoryIndex().url} className="text-sm text-muted-foreground hover:text-foreground">
                            {t('common.back')}
                        </Link>
                        <button className="inline-flex items-center rounded-md border px-3 py-2 text-sm" onClick={() => window.print()}>
                            <Printer className="mr-2 h-4 w-4" />
                            {t('reports.inventory.stocktake.actions.print')}
                        </button>
                    </div>
                </div>

                <div className="hidden print:block">
                    <div className="text-base font-semibold">{t('reports.inventory.stocktake.title')}</div>
                    <div className="mt-1 text-sm">
                        {branch.code ? `${branch.code} — ${branch.name}` : branch.name} • {generatedAt.toLocaleString()}
                    </div>
                </div>

                <table className="mt-4 w-full border-collapse text-xs">
                    <thead>
                        <tr>
                            <th className="w-[120px] border p-2 text-left">{t('reports.inventory.stocktake.columns.code')}</th>
                            <th className="border p-2 text-left">{t('reports.inventory.stocktake.columns.asset')}</th>
                            <th className="w-[120px] border p-2 text-left">{t('reports.inventory.stocktake.columns.location')}</th>
                            <th className="w-[120px] border p-2 text-left">{t('reports.inventory.stocktake.columns.pic')}</th>
                            <th className="w-[90px] border p-2 text-left">{t('reports.inventory.stocktake.columns.status')}</th>
                            <th className="w-[90px] border p-2 text-left">{t('reports.inventory.stocktake.columns.condition')}</th>
                            <th className="w-[60px] border p-2 text-left">{t('reports.inventory.stocktake.columns.found')}</th>
                            <th className="w-[120px] border p-2 text-left">{t('reports.inventory.stocktake.columns.condition_actual')}</th>
                            <th className="w-[160px] border p-2 text-left">{t('reports.inventory.stocktake.columns.notes')}</th>
                            <th className="w-[120px] border p-2 text-left">{t('reports.inventory.stocktake.columns.checked_by')}</th>
                            <th className="w-[120px] border p-2 text-left">{t('reports.inventory.stocktake.columns.signature')}</th>
                            <th className="w-[140px] border p-2 text-left">{t('reports.inventory.stocktake.columns.qr')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assets.map((asset) => (
                            <tr key={asset.id} className="align-top">
                                <td className="border p-2 font-semibold">{asset.code}</td>
                                <td className="border p-2">
                                    <div className="font-medium">{asset.name}</div>
                                    <div className="mt-1 text-[10px] text-muted-foreground">
                                        {asset.department?.name ? `${asset.department.name} • ` : ''}
                                        {asset.branch?.name ?? ''}
                                    </div>
                                </td>
                                <td className="border p-2">{asset.location?.name ?? ''}</td>
                                <td className="border p-2">{asset.person_in_charge?.name ?? asset.user?.name ?? ''}</td>
                                <td className="border p-2">{asset.status?.name ?? ''}</td>
                                <td className="border p-2">{asset.condition?.name ?? ''}</td>
                                <td className="border p-2" />
                                <td className="border p-2" />
                                <td className="border p-2" />
                                <td className="border p-2" />
                                <td className="border p-2" />
                                <td className="border p-2">
                                    <div className="text-[10px]">{toAbsoluteUrl(qrShow(asset.qr_token).url)}</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style>{`
                @page { size: A4; margin: 10mm; }
                table { page-break-inside: auto; }
                tr { page-break-inside: avoid; page-break-after: auto; }
                th { background: #f9fafb; }
                .text-muted-foreground { color: #6b7280; }
            `}</style>
        </>
    );
}

InventoryStocktakePrint.layout = null;
