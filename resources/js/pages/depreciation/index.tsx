import { Head, Link, router, usePage } from '@inertiajs/react';
import { Download, Play } from 'lucide-react';
import { useMemo, useState } from 'react';

import DepreciationRunController from '@/actions/App/Http/Controllers/DepreciationRunController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/use-translation';
import { index as assetsIndex } from '@/routes/assets';
import { exportMethod as depreciationExport, index as depreciationIndex } from '@/routes/depreciation';
import type { PaginatedData } from '@/types';

type DepreciationRun = {
    id: number;
    period: string;
    period_start: string;
    period_end: string;
    status: 'queued' | 'running' | 'completed' | 'failed' | string;
    started_at: string | null;
    finished_at: string | null;
    meta: Record<string, unknown> | null;
    error_message: string | null;
    created_at: string;
};

type Props = {
    organization: {
        id: number;
        name: string;
        currency_code: string;
        timezone: string;
        depreciation_frequency: string;
        depreciation_auto_run_enabled: boolean;
    };
    kpis: {
        eligible_assets: number;
        latest_period_total_depreciation: number;
    };
    runs: PaginatedData<DepreciationRun>;
};

export default function DepreciationIndex({ organization, kpis, runs }: Props) {
    const { orgRole, permissions } = usePage().props as { orgRole: string | null; permissions: string[] };
    const { t } = useTranslation();

    const canRun =
        permissions.includes('asset_depreciation.create') ||
        ['Owner', 'Admin', 'Manager'].includes(orgRole || '');
    const canExport =
        permissions.includes('asset_depreciation.export') ||
        ['Owner', 'Admin', 'Manager'].includes(orgRole || '');

    const [month, setMonth] = useState(() => {
        const now = new Date();
        const year = now.getFullYear();
        const prevMonth = new Date(year, now.getMonth() - 1, 1);
        const ym = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}`;
        return ym;
    });
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const currencyFormatter = useMemo(() => {
        try {
            return new Intl.NumberFormat(undefined, { style: 'currency', currency: organization.currency_code || 'IDR' });
        } catch {
            return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'IDR' });
        }
    }, [organization.currency_code]);

    async function queueRun() {
        setSubmitting(true);
        setError(null);

        await new Promise<void>((resolve) => {
            router.post(
                DepreciationRunController.store.url(),
                { month },
                {
                    preserveScroll: true,
                    onError: (errors) => setError(errors.month || t('common.validation_error')),
                    onFinish: () => resolve(),
                },
            );
        });

        setSubmitting(false);
    }

    const exportHref = depreciationExport({
        query: {
            from: new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1).toISOString().slice(0, 10),
            to: new Date().toISOString().slice(0, 10),
        },
    }).url;

    return (
        <>
            <Head title={t('depreciation.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <Heading
                        variant="small"
                        title={t('depreciation.title')}
                        description={t('depreciation.description')}
                    />
                    {canExport ? (
                        <a href={exportHref}>
                            <Button variant="outline" className="w-full sm:w-auto">
                                <Download className="mr-2 h-4 w-4" />
                                {t('depreciation.actions.export')}
                            </Button>
                        </a>
                    ) : null}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">{t('depreciation.kpis.eligible_assets')}</CardTitle>
                            <CardDescription>{t('depreciation.fields.period')}</CardDescription>
                        </CardHeader>
                        <CardContent className="text-2xl font-semibold">{kpis.eligible_assets}</CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">{t('depreciation.kpis.latest_period_total_depreciation')}</CardTitle>
                            <CardDescription>{t('depreciation.fields.period')}</CardDescription>
                        </CardHeader>
                        <CardContent className="text-2xl font-semibold">
                            {currencyFormatter.format(Number(kpis.latest_period_total_depreciation || 0))}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('depreciation.actions.run')}</CardTitle>
                        <CardDescription>
                            {organization.depreciation_auto_run_enabled
                                ? `${t('common.enabled')} • ${organization.depreciation_frequency}`
                                : `${t('common.disabled')} • ${organization.depreciation_frequency}`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-end">
                        <div className="w-full sm:max-w-xs">
                            <label className="mb-1 block text-sm text-muted-foreground">{t('depreciation.fields.month')}</label>
                            <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
                            <InputError message={error ?? undefined} />
                        </div>
                        <Button disabled={!canRun || submitting} onClick={queueRun} className="w-full sm:w-auto">
                            <Play className="mr-2 h-4 w-4" />
                            {t('depreciation.actions.run')}
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('depreciation.fields.status')}</CardTitle>
                        <CardDescription>{organization.name}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {runs.data.length === 0 ? (
                            <div className="text-sm text-muted-foreground">{t('datatable.no_results')}</div>
                        ) : (
                            runs.data.map((run) => {
                                const meta = run.meta || {};
                                const created = (meta.created_count as number) ?? null;
                                const skipped = (meta.skipped_count as number) ?? null;

                                return (
                                    <div key={run.id} className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Badge variant="secondary">{run.period_end}</Badge>
                                                <Badge>{t(`depreciation.status.${run.status}`)}</Badge>
                                                <span className="text-xs text-muted-foreground">#{run.id}</span>
                                            </div>
                                            <div className="mt-1 text-xs text-muted-foreground">
                                                {created !== null ? `${t('depreciation.fields.created')}: ${created}` : ''}
                                                {skipped !== null ? ` • ${t('depreciation.fields.skipped')}: ${skipped}` : ''}
                                                {run.error_message ? ` • ${run.error_message}` : ''}
                                            </div>
                                        </div>
                                        <Link href={depreciationIndex()} className="hidden" />
                                    </div>
                                );
                            })
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

DepreciationIndex.layout = {
    breadcrumbs: [
        { title: 'assets.title', href: assetsIndex() },
        { title: 'depreciation.title', href: depreciationIndex() },
    ],
};
