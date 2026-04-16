import { Head, Link, usePage } from '@inertiajs/react';
import { AlertTriangle, ArrowUpRight, Import, Plus } from 'lucide-react';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import type { ActivityItem } from '@/components/dashboard/recent-activity';
import { StatCard } from '@/components/dashboard/stat-card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import AssetController from '@/actions/App/Http/Controllers/AssetController';
import { create as assetsCreate, index as assetsIndex } from '@/routes/assets';
import { index as assetsImportIndex } from '@/routes/assets/import';

export default function Dashboard() {
    const { auth, organization, locale } = usePage().props as any;
    const { t } = useTranslation();
    const userName = auth?.user?.name || t('dashboard.user_fallback');
    const page = usePage().props as unknown as {
        kpis: {
            total_assets: number;
            total_value: number;
            needs_attention: number;
            created_last_7_days: number;
            trend_created_last_7_days: number;
        };
        attention: {
            items: Array<{
                id: number;
                code: string;
                name: string;
                updated_at: string | null;
                branch: { id: number; name: string; code: string } | null;
                condition: { id: number; name: string; code: string } | null;
                status: { id: number; name: string; code: string } | null;
            }>;
        };
        topBranches: Array<{
            branch: { id: number; name: string; code: string };
            asset_count: number;
            total_value: number;
        }>;
        recentActivity: Array<{
            id: number;
            action: string;
            description: string | null;
            created_at: string;
            actor: { id: number; name: string } | null;
            asset: { id: number; code: string; name: string } | null;
        }>;
        quickActions: {
            canCreateAsset: boolean;
            canImportAssets: boolean;
            canViewAssets: boolean;
            canViewMasterData: boolean;
        };
    };

    const currencyFormatter = new Intl.NumberFormat(locale ?? 'en', {
        style: 'currency',
        currency: organization?.currency_code ?? 'IDR',
        maximumFractionDigits: 0,
    });

    const activityItems: ActivityItem[] = (page.recentActivity ?? []).map((item) => ({
        id: item.id,
        user: item.actor?.name ?? t('dashboard.activity.system'),
        action: item.description ?? item.action,
        target: item.asset ? `${item.asset.code} — ${item.asset.name}` : undefined,
        time: formatRelative(item.created_at, locale ?? 'en'),
    }));

    return (
        <>
            <Head title={t('dashboard.title')} />
            <div className="mx-auto flex h-full w-full max-w-[1280px] flex-1 flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 lg:gap-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="min-w-0">
                        <h1 className="truncate text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                            {t('dashboard.welcome_back', { name: userName })}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                            {organization?.name ? t('dashboard.org_subtitle', { organization: organization.name }) : t('dashboard.welcome_description')}
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                        {page.quickActions?.canImportAssets ? (
                            <Button asChild variant="outline" className="w-full sm:w-auto">
                                <Link href={assetsImportIndex()} prefetch className="inline-flex items-center">
                                    <Import className="mr-2 h-4 w-4" />
                                    {t('dashboard.quick_actions.import_assets')}
                                </Link>
                            </Button>
                        ) : null}
                        {page.quickActions?.canCreateAsset ? (
                            <Button asChild className="w-full sm:w-auto">
                                <Link href={assetsCreate()} prefetch className="inline-flex items-center">
                                    <Plus className="mr-2 h-4 w-4" />
                                    {t('dashboard.quick_actions.new_asset')}
                                </Link>
                            </Button>
                        ) : null}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                    <StatCard title={t('dashboard.kpis.total_assets')} value={page.kpis?.total_assets ?? 0} />
                    <StatCard
                        title={t('dashboard.kpis.total_value')}
                        value={currencyFormatter.format(page.kpis?.total_value ?? 0)}
                    />
                    <StatCard
                        title={t('dashboard.kpis.needs_attention')}
                        value={page.kpis?.needs_attention ?? 0}
                        icon={<AlertTriangle className="size-5" />}
                    />
                    <StatCard
                        title={t('dashboard.kpis.created_last_7_days')}
                        value={page.kpis?.created_last_7_days ?? 0}
                        trend={{
                            value: Math.round(Math.abs(page.kpis?.trend_created_last_7_days ?? 0)),
                            isPositive: (page.kpis?.trend_created_last_7_days ?? 0) >= 0,
                        }}
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
                    <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                        <div className="rounded-xl border border-border bg-card p-6">
                            <div className="flex items-center justify-between gap-2">
                                <h2 className="text-lg font-semibold text-foreground">{t('dashboard.attention_required')}</h2>
                                <Button asChild variant="ghost" size="sm">
                                    <Link href={assetsIndex()} prefetch className="inline-flex items-center">
                                        {t('dashboard.actions.view_all')}
                                        <ArrowUpRight className="ml-1 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>

                            {page.attention?.items?.length ? (
                                <div className="mt-4 divide-y divide-border">
                                    {page.attention.items.map((asset) => (
                                        <Link
                                            key={asset.id}
                                            href={AssetController.show.url({ asset: asset.id })}
                                            prefetch
                                            className="flex items-start justify-between gap-3 py-3 hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-colors"
                                        >
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                                    <span className="font-medium text-foreground">{asset.code}</span>
                                                    <span className="text-sm text-muted-foreground truncate">{asset.name}</span>
                                                </div>
                                                <div className="mt-1 text-xs text-muted-foreground">
                                                    {asset.branch ? `${asset.branch.code} • ${asset.branch.name}` : t('dashboard.labels.no_branch')}
                                                </div>
                                            </div>

                                            <div className="shrink-0 text-right">
                                                <div className="text-xs text-muted-foreground">
                                                    {asset.updated_at ? formatRelative(asset.updated_at, locale ?? 'en') : '—'}
                                                </div>
                                                <div className="mt-1 flex items-center justify-end gap-2">
                                                    {asset.status ? (
                                                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                                            {asset.status.name}
                                                        </span>
                                                    ) : null}
                                                    {asset.condition ? (
                                                        <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-700 dark:text-amber-300">
                                                            {asset.condition.name}
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="mt-4 text-sm text-muted-foreground">{t('dashboard.empty_states.attention')}</div>
                            )}
                        </div>

                        <RecentActivity items={activityItems} />
                    </div>

                    <div className="space-y-6 lg:space-y-8">
                        <div className="rounded-xl border border-border bg-card p-6">
                            <h2 className="text-lg font-semibold text-foreground">{t('dashboard.top_branches')}</h2>
                            {page.topBranches?.length ? (
                                <div className="mt-4 space-y-4">
                                    {page.topBranches.map((item) => (
                                        <Link
                                            key={item.branch.id}
                                            href={assetsIndex({ query: { 'filters[branch_id]': String(item.branch.id) } })}
                                            prefetch
                                            className="block rounded-lg p-2 -mx-2 hover:bg-muted/30 transition-colors"
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="min-w-0">
                                                    <div className="truncate font-medium text-foreground">
                                                        {item.branch.code} — {item.branch.name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {t('dashboard.labels.asset_count', { count: item.asset_count })}
                                                    </div>
                                                </div>
                                                <div className="shrink-0 text-sm text-muted-foreground">
                                                    {currencyFormatter.format(item.total_value ?? 0)}
                                                </div>
                                            </div>

                                            <div className="mt-2 h-2 w-full rounded-full bg-muted">
                                                <div
                                                    className={cn('h-2 rounded-full bg-foreground/30')}
                                                    style={{
                                                        width: `${Math.min(100, Math.round((item.asset_count / Math.max(1, page.kpis?.total_assets ?? 1)) * 100))}%`,
                                                    }}
                                                />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="mt-4 text-sm text-muted-foreground">{t('dashboard.empty_states.top_branches')}</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'dashboard.title',
            href: dashboard(),
        },
    ],
};

function formatRelative(iso: string, locale: string): string {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
        return '—';
    }

    const seconds = Math.round((date.getTime() - Date.now()) / 1000);
    const abs = Math.abs(seconds);

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    if (abs < 60) {
        return rtf.format(seconds, 'second');
    }
    if (abs < 3600) {
        return rtf.format(Math.round(seconds / 60), 'minute');
    }
    if (abs < 86400) {
        return rtf.format(Math.round(seconds / 3600), 'hour');
    }

    return rtf.format(Math.round(seconds / 86400), 'day');
}
