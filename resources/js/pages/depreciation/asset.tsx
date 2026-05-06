import { Head, Link, router, usePage } from '@inertiajs/react';
import { Download, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

import AssetUsageLogController from '@/actions/App/Http/Controllers/AssetUsageLogController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/use-translation';
import { index as assetsIndex } from '@/routes/assets';
import { index as depreciationIndex } from '@/routes/depreciation';
import { exportMethod as assetDepreciationExport } from '@/routes/depreciation/assets';

type Entry = {
    id: number;
    period_start: string;
    period_end: string;
    method: string | null;
    book_value_start: string;
    depreciation_amount: string;
    accumulated_depreciation: string;
    book_value_end: string;
    units_in_period: string | null;
    units_total_estimate: string | null;
    units_unit: string | null;
};

type UsageLog = {
    id: number;
    recorded_at: string;
    units: string;
    unit: string | null;
    notes: string | null;
    created_at: string;
};

type Props = {
    asset: {
        id: number;
        code: string;
        name: string;
        depreciation_method: string | null;
        useful_life_months: number | null;
        cost: string | null;
        residual_value: string | null;
        production_units_total_estimate: string | null;
        production_units_unit: string | null;
        book_value_cached: string | null;
        branch: { id: number; name: string; code: string } | null;
        category: { id: number; name: string; code: string } | null;
    };
    entries: Entry[];
    yearly: Array<{ year: string; total_depreciation: number; book_value_end: string | null }>;
    usageLogs: UsageLog[];
    range: { from: string; to: string };
};

export default function DepreciationAsset({ asset, entries, yearly, usageLogs, range }: Props) {
    const { orgRole, permissions } = usePage().props as { orgRole: string | null; permissions: string[] };
    const { organization } = usePage().props as { organization: { currency_code: string } | null };
    const { t } = useTranslation();

    const canEdit =
        permissions.includes('asset_depreciation.create') ||
        ['Owner', 'Admin', 'Manager'].includes(orgRole || '');

    const currency = useMemo(() => {
        try {
            return new Intl.NumberFormat(undefined, { style: 'currency', currency: organization?.currency_code || 'IDR' });
        } catch {
            return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'IDR' });
        }
    }, [organization?.currency_code]);

    const exportHref = assetDepreciationExport(asset.id, { query: { from: range.from, to: range.to } }).url;

    const [recordedAt, setRecordedAt] = useState(() => new Date().toISOString().slice(0, 10));
    const [units, setUnits] = useState('');
    const [unit, setUnit] = useState(asset.production_units_unit || '');
    const [notes, setNotes] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function addUsage() {
        setSubmitting(true);
        setError(null);

        await new Promise<void>((resolve) => {
            router.post(
                AssetUsageLogController.store.url({ asset: asset.id }),
                { recorded_at: recordedAt, units, unit: unit || null, notes: notes || null },
                {
                    preserveScroll: true,
                    onError: (errors) => setError(errors.units || errors.recorded_at || t('common.validation_error')),
                    onFinish: () => resolve(),
                },
            );
        });

        setSubmitting(false);
        setUnits('');
        setNotes('');
    }

    const showUsage = asset.depreciation_method === 'units_of_production';

    return (
        <>
            <Head title={`${t('depreciation.title')} • ${asset.code}`} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <Heading
                            variant="small"
                            title={asset.name}
                            description={`${asset.code}${asset.branch ? ` • ${asset.branch.name}` : ''}${asset.category ? ` • ${asset.category.name}` : ''}`}
                        />
                        <div className="mt-2 flex flex-wrap gap-2">
                            {asset.depreciation_method ? <Badge>{t(`depreciation.methods.${asset.depreciation_method}`)}</Badge> : null}
                            {asset.book_value_cached ? (
                                <Badge variant="secondary">
                                    {t('depreciation.fields.book_value_end')}: {currency.format(Number(asset.book_value_cached))}
                                </Badge>
                            ) : null}
                        </div>
                    </div>
                    <a href={exportHref}>
                        <Button variant="outline" className="w-full sm:w-auto">
                            <Download className="mr-2 h-4 w-4" />
                            {t('depreciation.actions.export')}
                        </Button>
                    </a>
                </div>

                {yearly.length > 0 ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('depreciation.fields.period')}</CardTitle>
                            <CardDescription>{range.from} → {range.to}</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3 sm:grid-cols-3">
                            {yearly.map((row) => (
                                <div key={row.year} className="rounded-lg border p-3">
                                    <div className="text-sm font-medium">{row.year}</div>
                                    <div className="mt-1 text-xs text-muted-foreground">{t('depreciation.fields.depreciation_amount')}</div>
                                    <div className="text-sm font-semibold">{currency.format(Number(row.total_depreciation || 0))}</div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ) : null}

                <Card>
                    <CardHeader>
                        <CardTitle>{t('depreciation.title')}</CardTitle>
                        <CardDescription>{t('depreciation.description')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {entries.length === 0 ? (
                            <div className="text-sm text-muted-foreground">{t('datatable.no_results')}</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[800px] text-sm">
                                    <thead className="text-left text-muted-foreground">
                                        <tr className="border-b">
                                            <th className="py-2 pr-4">{t('depreciation.fields.period_end')}</th>
                                            <th className="py-2 pr-4">{t('depreciation.fields.method')}</th>
                                            <th className="py-2 pr-4">{t('depreciation.fields.book_value_start')}</th>
                                            <th className="py-2 pr-4">{t('depreciation.fields.depreciation_amount')}</th>
                                            <th className="py-2 pr-4">{t('depreciation.fields.accumulated_depreciation')}</th>
                                            <th className="py-2 pr-4">{t('depreciation.fields.book_value_end')}</th>
                                            <th className="py-2 pr-4">{t('depreciation.fields.units')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {entries.map((e) => (
                                            <tr key={e.id} className="border-b">
                                                <td className="py-2 pr-4">{e.period_end}</td>
                                                <td className="py-2 pr-4">{e.method ? t(`depreciation.methods.${e.method}`) : '-'}</td>
                                                <td className="py-2 pr-4">{currency.format(Number(e.book_value_start))}</td>
                                                <td className="py-2 pr-4">{currency.format(Number(e.depreciation_amount))}</td>
                                                <td className="py-2 pr-4">{currency.format(Number(e.accumulated_depreciation))}</td>
                                                <td className="py-2 pr-4">{currency.format(Number(e.book_value_end))}</td>
                                                <td className="py-2 pr-4">
                                                    {e.units_in_period ? `${e.units_in_period} ${e.units_unit || ''}` : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {showUsage ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('depreciation.fields.units')}</CardTitle>
                            <CardDescription>{t('depreciation.methods.units_of_production')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-3 md:grid-cols-4">
                                <div>
                                    <label className="mb-1 block text-sm text-muted-foreground">{t('assets.fields.purchase_date')}</label>
                                    <Input type="date" value={recordedAt} onChange={(e) => setRecordedAt(e.target.value)} />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm text-muted-foreground">{t('depreciation.fields.units_in_period')}</label>
                                    <Input value={units} onChange={(e) => setUnits(e.target.value)} placeholder="0" />
                                    <InputError message={error ?? undefined} />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm text-muted-foreground">{t('depreciation.fields.units')}</label>
                                    <Input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="hours" />
                                </div>
                                <div className="flex items-end">
                                    <Button disabled={!canEdit || submitting || !units} onClick={addUsage} className="w-full">
                                        <Plus className="mr-2 h-4 w-4" />
                                        {t('common.add')}
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm text-muted-foreground">{t('assets.fields.notes')}</label>
                                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                {usageLogs.length === 0 ? (
                                    <div className="text-sm text-muted-foreground">{t('datatable.no_results')}</div>
                                ) : (
                                    usageLogs.map((log) => (
                                        <div key={log.id} className="flex flex-col gap-1 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="min-w-0">
                                                <div className="text-sm font-medium">{log.recorded_at}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {log.units} {log.unit || ''}
                                                    {log.notes ? ` • ${log.notes}` : ''}
                                                </div>
                                            </div>
                                            <div className="text-xs text-muted-foreground">{new Date(log.created_at).toLocaleString()}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ) : null}

                <div className="text-sm">
                    <Link href={depreciationIndex()} className="text-primary underline-offset-4 hover:underline">
                        {t('common.back')}
                    </Link>
                </div>
            </div>
        </>
    );
}

DepreciationAsset.layout = {
    breadcrumbs: [
        { title: 'assets.title', href: assetsIndex() },
        { title: 'depreciation.title', href: depreciationIndex() },
    ],
};
