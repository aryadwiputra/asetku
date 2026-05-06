import { Head, Link, usePage } from '@inertiajs/react';
import { AlertTriangle, ArrowUpRight, BarChart3, Import, MapPin, Plus, TrendingUp } from 'lucide-react';
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from 'recharts';
import AssetController from '@/actions/App/Http/Controllers/AssetController';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import type { ActivityItem } from '@/components/dashboard/recent-activity';
import { StatCard } from '@/components/dashboard/stat-card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
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
        assetsByStatus: Array<{
            status: { id: number; name: string; code: string };
            asset_count: number;
        }>;
        assetsByCondition: Array<{
            condition: { id: number; name: string; code: string };
            asset_count: number;
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

    const COLORS = ['var(--color-primary)', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#64748b'];

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

    const greeting = getGreeting(t);

    return (
        <>
            <Head title={t('dashboard.title')} />
            <div className="flex flex-1 flex-col gap-6 px-4 py-5 sm:px-6 sm:py-6 lg:gap-8">
                {/* Hero / Greeting Section */}
                <div className="relative overflow-hidden rounded-2xl bg-card ring-1 ring-border p-6 sm:p-8 shadow-card">
                    <div className="absolute inset-0 bg-linear-to-br from-foreground/[0.02] via-transparent to-foreground/[0.01]" />
                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-muted-foreground">{greeting}</p>
                            <h1 className="mt-1 truncate text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                                {userName}
                            </h1>
                            <p className="mt-2 text-sm text-muted-foreground/80 max-w-lg">
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
                </div>

                {/* KPI Stats Grid */}
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

                {/* Charts Section */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
                    {/* Bar Chart — Assets by Status */}
                    <div className="lg:col-span-2 card-gradient-border rounded-xl ring-1 ring-border bg-card p-6 shadow-card transition-shadow duration-200 hover:shadow-card-hover">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2.5">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-muted/60">
                                    <BarChart3 className="size-4 text-muted-foreground" />
                                </div>
                                <h2 className="text-base font-semibold text-foreground tracking-tight">{t('dashboard.charts.assets_by_status')}</h2>
                            </div>
                            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                                {page.assetsByStatus?.length ?? 0} {t('dashboard.labels.statuses')}
                            </span>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={page.assetsByStatus.map(s => ({ name: s.status.name, count: s.asset_count }))}>
                                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)' }} />
                                    <YAxis fontSize={12} tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)' }} />
                                    <RechartsTooltip
                                        cursor={{ fill: 'var(--muted)', radius: 4 }}
                                        contentStyle={{
                                            borderRadius: '10px',
                                            border: '1px solid var(--border)',
                                            background: 'var(--card)',
                                            boxShadow: 'var(--shadow-card-hover)',
                                            fontSize: '13px',
                                        }}
                                    />
                                    <Bar dataKey="count" fill="currentColor" radius={[6, 6, 0, 0]} className="fill-primary" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Pie Chart — Assets by Condition */}
                    <div className="card-gradient-border rounded-xl ring-1 ring-border bg-card p-6 shadow-card transition-shadow duration-200 hover:shadow-card-hover">
                        <div className="flex items-center gap-2.5 mb-5">
                            <div className="flex size-8 items-center justify-center rounded-lg bg-muted/60">
                                <TrendingUp className="size-4 text-muted-foreground" />
                            </div>
                            <h2 className="text-base font-semibold text-foreground tracking-tight">{t('dashboard.charts.assets_by_condition')}</h2>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={page.assetsByCondition.map(c => ({ name: c.condition.name, value: c.asset_count }))}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={85}
                                        paddingAngle={4}
                                        strokeWidth={0}
                                    >
                                        {page.assetsByCondition.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip
                                        contentStyle={{
                                            borderRadius: '10px',
                                            border: '1px solid var(--border)',
                                            background: 'var(--card)',
                                            boxShadow: 'var(--shadow-card-hover)',
                                            fontSize: '13px',
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        {/* Legend */}
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 justify-center">
                            {page.assetsByCondition.map((c, i) => (
                                <div key={c.condition.id} className="flex items-center gap-1.5">
                                    <span className="size-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                                    <span className="text-xs text-muted-foreground">{c.condition.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Attention Required + Recent Activity */}
                    <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                        <div className="card-gradient-border rounded-xl ring-1 ring-border bg-card p-6 shadow-card">
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10">
                                        <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <h2 className="text-base font-semibold text-foreground tracking-tight">{t('dashboard.attention_required')}</h2>
                                </div>
                                <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                    <Link href={assetsIndex()} prefetch className="inline-flex items-center">
                                        {t('dashboard.actions.view_all')}
                                        <ArrowUpRight className="ml-1 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>

                            {page.attention?.items?.length ? (
                                <div className="mt-4 divide-y divide-border/70">
                                    {page.attention.items.map((asset) => (
                                        <Link
                                            key={asset.id}
                                            href={AssetController.show.url({ asset: asset.id })}
                                            prefetch
                                            className="flex items-start justify-between gap-3 py-3.5 hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-colors duration-150"
                                        >
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                                    <span className="font-medium text-foreground">{asset.code}</span>
                                                    <span className="text-sm text-muted-foreground truncate">{asset.name}</span>
                                                </div>
                                                <div className="mt-1 text-xs text-muted-foreground/70">
                                                    {asset.branch ? `${asset.branch.code} • ${asset.branch.name}` : t('dashboard.labels.no_branch')}
                                                </div>
                                            </div>

                                            <div className="shrink-0 text-right">
                                                <div className="text-xs text-muted-foreground/70">
                                                    {asset.updated_at ? formatRelative(asset.updated_at, locale ?? 'en') : '—'}
                                                </div>
                                                <div className="mt-1.5 flex items-center justify-end gap-1.5">
                                                    {asset.status ? (
                                                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                                            {asset.status.name}
                                                        </span>
                                                    ) : null}
                                                    {asset.condition ? (
                                                        <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300">
                                                            {asset.condition.name}
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="mt-6 flex flex-col items-center justify-center py-6 text-center">
                                    <div className="size-10 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                                        <span className="text-lg">✅</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{t('dashboard.empty_states.attention')}</p>
                                </div>
                            )}
                        </div>

                        <RecentActivity items={activityItems} />
                    </div>

                    {/* Top Branches */}
                    <div className="space-y-6 lg:space-y-8">
                        <div className="card-gradient-border rounded-xl ring-1 ring-border bg-card p-6 shadow-card">
                            <div className="flex items-center gap-2.5">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-muted/60">
                                    <MapPin className="size-4 text-muted-foreground" />
                                </div>
                                <h2 className="text-base font-semibold text-foreground tracking-tight">{t('dashboard.top_branches')}</h2>
                            </div>
                            {page.topBranches?.length ? (
                                <div className="mt-5 space-y-3">
                                    {page.topBranches.map((item, index) => (
                                        <Link
                                            key={item.branch.id}
                                            href={assetsIndex({ query: { 'filters[branch_id]': String(item.branch.id) } })}
                                            prefetch
                                            className="block rounded-lg p-3 -mx-2 hover:bg-muted/30 transition-colors duration-150"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0 flex items-start gap-2.5">
                                                    <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted/60 text-xs font-semibold text-muted-foreground">
                                                        {index + 1}
                                                    </span>
                                                    <div className="min-w-0">
                                                        <div className="truncate font-medium text-foreground text-sm">
                                                            {item.branch.name}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground/70 mt-0.5">
                                                            {t('dashboard.labels.asset_count', { count: item.asset_count })}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="shrink-0 text-xs font-medium text-muted-foreground">
                                                    {currencyFormatter.format(item.total_value ?? 0)}
                                                </div>
                                            </div>

                                            <div className="mt-2.5 ml-8.5 h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
                                                <div
                                                    className={cn('h-full rounded-full bg-foreground/20 transition-all duration-500')}
                                                    style={{
                                                        width: `${Math.min(100, Math.round((item.asset_count / Math.max(1, page.kpis?.total_assets ?? 1)) * 100))}%`,
                                                    }}
                                                />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="mt-6 flex flex-col items-center justify-center py-6 text-center">
                                    <div className="size-10 rounded-full bg-muted/60 flex items-center justify-center mb-3">
                                        <MapPin className="size-5 text-muted-foreground" />
                                    </div>
                                    <p className="text-sm text-muted-foreground">{t('dashboard.empty_states.top_branches')}</p>
                                </div>
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

function getGreeting(t: (key: string) => string): string {
    const hour = new Date().getHours();

    if (hour < 12) {
        return t('dashboard.greeting.morning');
    }

    if (hour < 17) {
        return t('dashboard.greeting.afternoon');
    }

    return t('dashboard.greeting.evening');
}

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
