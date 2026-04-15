import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, LogIn, QrCode } from 'lucide-react';

import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { show as assetShow } from '@/routes/assets';
import { index as scanIndex } from '@/routes/scan';

type Props = {
    asset: {
        id: number;
        code: string;
        name: string;
        status: string | null;
        condition: string | null;
        branch: string | null;
        department: string | null;
        location: string | null;
        updated_at: string;
    };
    canViewFull: boolean;
    assetId: number | null;
    isAuthenticated: boolean;
};

export default function QrShow({ asset, canViewFull, assetId, isAuthenticated }: Props) {
    const { organization } = usePage().props as { organization: { is_active: boolean } | null };
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('qr.title', { code: asset.code })} />

            <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6">
                <Heading variant="small" title={asset.name} description={t('qr.subtitle', { code: asset.code })} />

                <Card className="p-6">
                    <CardContent className="space-y-4 p-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="secondary">{asset.code}</Badge>
                            {asset.status ? <Badge>{asset.status}</Badge> : null}
                            {asset.condition ? <Badge variant="outline">{asset.condition}</Badge> : null}
                        </div>

                        <div className="grid gap-2 text-sm">
                            <Row label={t('assets.fields.branch')} value={asset.branch} />
                            <Row label={t('assets.fields.department')} value={asset.department} />
                            <Row label={t('assets.fields.location')} value={asset.location} />
                            <Row label={t('common.updated')} value={new Date(asset.updated_at).toLocaleString()} />
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <Link href={scanIndex()}>
                                <Button variant="outline" className="w-full sm:w-auto">
                                    <QrCode className="mr-2 h-4 w-4" />
                                    {t('qr.actions.scan_again')}
                                </Button>
                            </Link>

                            {canViewFull && assetId ? (
                                <Link href={assetShow(assetId).url}>
                                    <Button className="w-full sm:w-auto">
                                        {t('qr.actions.open_asset')}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            ) : isAuthenticated ? (
                                <Card className="w-full p-4 text-sm text-muted-foreground">
                                    {organization?.is_active === false ? t('qr.messages.org_inactive') : t('qr.messages.login_required_actions')}
                                </Card>
                            ) : (
                                <a href="/login" className="w-full sm:w-auto">
                                    <Button className="w-full sm:w-auto">
                                        <LogIn className="mr-2 h-4 w-4" />
                                        {t('qr.actions.login')}
                                    </Button>
                                </a>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

QrShow.layout = null;

function Row({ label, value }: { label: string; value: string | null }) {
    return (
        <div className="flex items-start justify-between gap-3">
            <div className="text-muted-foreground">{label}</div>
            <div className="min-w-0 break-words text-right">{value ?? '—'}</div>
        </div>
    );
}
