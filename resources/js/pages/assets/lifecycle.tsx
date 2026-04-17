import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';

import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/use-translation';
import { index as assetsIndex } from '@/routes/assets';
import { index as assetLifecycleIndex, show as assetLifecycleShow } from '@/routes/assets/lifecycle';

type AssetResult = {
    id: number;
    code: string;
    name: string;
    updated_at: string;
    branch?: { id: number; name: string; code: string } | null;
    status?: { id: number; name: string; code: string } | null;
    condition?: { id: number; name: string; code: string } | null;
};

type Props = {
    search: string;
    results: AssetResult[];
    asset: any | null;
    histories: any[];
    attachments: any[];
    meta: any;
    abilities: { canView: boolean; canUpdate: boolean };
};

export default function AssetLifecyclePage({ search, results, asset }: Props) {
    const { t } = useTranslation();
    const [q, setQ] = useState(search || '');

    const hasResults = results && results.length > 0;
    const selected = asset as null | { id: number; code: string; name: string };

    const pageTitle = useMemo(() => t('common.asset_lifecycle'), [t]);

    return (
        <>
            <Head title={pageTitle} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        variant="small"
                        title={pageTitle}
                        description={t('assets.lifecycle.page.description')}
                    />
                    <Link href={assetsIndex()} className="w-full sm:w-auto">
                        <Button variant="outline" className="w-full sm:w-auto">
                            {t('common.assets')}
                        </Button>
                    </Link>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="grid w-full gap-2 sm:max-w-xl">
                        <div className="text-sm font-medium">{t('assets.lifecycle.page.search_label')}</div>
                        <div className="flex gap-2">
                            <Input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder={t('assets.lifecycle.page.search_placeholder')}
                            />
                            <Button
                                onClick={() =>
                                    router.get(assetLifecycleIndex({ query: { q } }).url, {}, { preserveScroll: true })
                                }
                                disabled={q.trim() === ''}
                            >
                                <Search className="mr-2 h-4 w-4" />
                                {t('assets.lifecycle.page.search_action')}
                            </Button>
                        </div>
                    </div>
                </div>

                {selected ? (
                    <div className="rounded-lg border bg-background p-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="text-sm font-semibold">
                                {selected.code} — {selected.name}
                            </div>
                            <Badge variant="secondary">{t('assets.lifecycle.page.selected')}</Badge>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                            {t('assets.lifecycle.page.selected_hint')}
                        </div>
                    </div>
                ) : null}

                <div className="space-y-3">
                    <div className="text-sm font-medium">{t('assets.lifecycle.page.results')}</div>
                    {!hasResults ? (
                        <div className="rounded-lg border bg-background p-4 text-sm text-muted-foreground">
                            {t('assets.lifecycle.page.empty')}
                        </div>
                    ) : (
                        <div className="grid gap-2">
                            {results.map((row) => (
                                <button
                                    key={row.id}
                                    type="button"
                                    onClick={() => router.visit(assetLifecycleShow(row.id).url)}
                                    className="flex w-full items-start justify-between gap-3 rounded-lg border bg-background p-3 text-left hover:bg-muted/30"
                                >
                                    <div className="min-w-0">
                                        <div className="truncate text-sm font-medium">{row.name}</div>
                                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                            <span className="font-mono">{row.code}</span>
                                            {row.branch?.code ? <span>• {row.branch.code}</span> : null}
                                        </div>
                                    </div>
                                    <div className="shrink-0 text-xs text-muted-foreground">
                                        {new Date(row.updated_at).toLocaleString()}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

AssetLifecyclePage.layout = {
    breadcrumbs: [{ title: 'common.asset_lifecycle', href: assetLifecycleIndex() }],
};
