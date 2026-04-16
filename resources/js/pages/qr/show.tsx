import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    CalendarDays,
    Download,
    FileText,
    ImageIcon,
    LogIn,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/hooks/use-translation';
import { show as assetShow } from '@/routes/assets';
import { login } from '@/routes';
import { index as scanIndex } from '@/routes/scan';

type AssetRelation = {
    id: number;
    name: string;
    code?: string | null;
    type?: string | null;
    symbol?: string | null;
    email?: string | null;
    phone?: string | null;
};

type Warranty = {
    id: number;
    name: string;
    duration_months: number | null;
    provider_name: string | null;
    description: string | null;
};

type VendorContract = {
    id: number;
    vendor_name: string;
    contract_number: string | null;
    description: string | null;
    start_date: string | null;
    end_date: string | null;
};

type Attachment = {
    id: number;
    kind: 'photo' | 'document';
    sort_order: number;
    is_primary: boolean;
    media_asset: {
        id: number;
        title: string | null;
        url: string;
        thumb_url: string | null;
        mime: string | null;
        size: number | null;
    } | null;
};

type HistoryRow = {
    id: number;
    action: string;
    description: string | null;
    actor: { id: number; name: string } | null;
    created_at: string | null;
};

type Asset = {
    id: number;
    organization_id: number;
    code: string;
    name: string;
    description: string | null;
    brand: string | null;
    model: string | null;
    series: string | null;
    serial_number: string | null;
    imei: string | null;
    purchase_date: string | null;
    warranty_end: string | null;
    cost: string | null;
    depreciation_method: string | null;
    useful_life_months: number | null;
    residual_value: string | null;
    book_value_cached: string | null;
    computed_book_value: number;
    capex_opex: string | null;
    metadata: Record<string, unknown> | null;
    latitude: number | string | null;
    longitude: number | string | null;
    rfid_tag: string | null;
    nfc_tag: string | null;
    label_template: string | null;
    is_consumable: boolean;
    quantity: number | null;
    available_quantity: number | null;
    is_pool: boolean;
    archived_at: string | null;
    retention_until: string | null;
    updated_at: string | null;
    created_at: string | null;
    status: AssetRelation | null;
    condition: AssetRelation | null;
    class: AssetRelation | null;
    category: AssetRelation | null;
    unit: AssetRelation | null;
    branch: AssetRelation | null;
    department: AssetRelation | null;
    location: AssetRelation | null;
    person_in_charge: AssetRelation | null;
    user: AssetRelation | null;
    warranty: Warranty | null;
    vendor_contract: VendorContract | null;
};

type Props = {
    asset: Asset;
    attachments: Attachment[];
    histories: HistoryRow[];
    organization: {
        id: number;
        name: string;
        slug: string;
        currency_code: string | null;
        timezone: string | null;
        is_active: boolean;
    } | null;
    canViewFull: boolean;
    assetId: number | null;
    isAuthenticated: boolean;
};

export default function QrShow({ asset, attachments, histories, organization, canViewFull, assetId, isAuthenticated }: Props) {
    const { t } = useTranslation();
    const { locale } = usePage().props as { locale: string };
    const [previewImage, setPreviewImage] = useState<Attachment['media_asset'] | null>(null);

    const photos = useMemo(() => attachments.filter((attachment) => attachment.kind === 'photo'), [attachments]);
    const documents = useMemo(() => attachments.filter((attachment) => attachment.kind === 'document'), [attachments]);
    const metadataEntries = useMemo(() => Object.entries(asset.metadata ?? {}), [asset.metadata]);

    const currencyFormatter = useMemo(
        () =>
            new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: organization?.currency_code || 'IDR',
                maximumFractionDigits: 0,
            }),
        [locale, organization?.currency_code],
    );

    const dateFormatter = useMemo(
        () =>
            new Intl.DateTimeFormat(locale, {
                dateStyle: 'medium',
                timeStyle: 'short',
                timeZone: organization?.timezone || undefined,
            }),
        [locale, organization?.timezone],
    );

    const basicDetails = [
        { label: t('assets.fields.code'), value: asset.code },
        { label: t('assets.fields.name'), value: asset.name },
        { label: t('assets.fields.brand'), value: asset.brand },
        { label: t('assets.fields.model'), value: asset.model },
        { label: t('assets.fields.series'), value: asset.series },
        { label: t('assets.fields.serial_number'), value: asset.serial_number },
        { label: t('assets.fields.imei'), value: asset.imei },
        { label: t('assets.fields.description'), value: asset.description },
        { label: t('assets.fields.status'), value: asset.status?.name },
        { label: t('assets.fields.condition'), value: asset.condition?.name },
        { label: t('qr.fields.class'), value: asset.class?.name },
        { label: t('qr.fields.unit'), value: asset.unit ? `${asset.unit.name}${asset.unit.symbol ? ` (${asset.unit.symbol})` : ''}` : null },
    ];

    const financialDetails = [
        { label: t('assets.fields.purchase_date'), value: formatDate(asset.purchase_date, dateFormatter) },
        { label: t('assets.fields.cost'), value: formatCurrency(asset.cost, currencyFormatter) },
        { label: t('assets.fields.book_value'), value: currencyFormatter.format(Number(asset.computed_book_value || 0)) },
        { label: t('assets.fields.depreciation_method'), value: formatDepreciation(asset.depreciation_method, t) },
        { label: t('assets.fields.useful_life_months'), value: asset.useful_life_months },
        { label: t('assets.fields.residual_value'), value: formatCurrency(asset.residual_value, currencyFormatter) },
        { label: t('qr.fields.capex_opex'), value: asset.capex_opex },
        { label: t('qr.fields.warranty_end'), value: formatDate(asset.warranty_end, dateFormatter) },
    ];

    const technicalDetails = [
        { label: t('assets.fields.latitude'), value: asset.latitude },
        { label: t('assets.fields.longitude'), value: asset.longitude },
        { label: t('qr.fields.rfid_tag'), value: asset.rfid_tag },
        { label: t('qr.fields.nfc_tag'), value: asset.nfc_tag },
        { label: t('qr.fields.label_template'), value: asset.label_template },
        { label: t('qr.fields.is_consumable'), value: asset.is_consumable ? t('qr.labels.yes') : t('qr.labels.no') },
        { label: t('qr.fields.quantity'), value: asset.quantity },
        { label: t('qr.fields.available_quantity'), value: asset.available_quantity },
        { label: t('qr.fields.is_pool'), value: asset.is_pool ? t('qr.labels.yes') : t('qr.labels.no') },
        { label: t('common.created'), value: formatDate(asset.created_at, dateFormatter) },
        { label: t('common.updated'), value: formatDate(asset.updated_at, dateFormatter) },
        { label: t('qr.fields.retention_until'), value: formatDate(asset.retention_until, dateFormatter) },
    ];

    return (
        <>
            <Head title={t('qr.title', { code: asset.code })} />

            <div className="space-y-8 pb-24">
                <section className="space-y-4">
                    <GalleryHeader
                        asset={asset}
                        organizationName={organization?.name ?? null}
                        photos={photos}
                        onPreview={setPreviewImage}
                        t={t}
                    />

                    <div className="grid gap-3 sm:grid-cols-2">
                        <QuickFact label={t('assets.fields.branch')} value={asset.branch?.name} />
                        <QuickFact label={t('assets.fields.department')} value={asset.department?.name} />
                        <QuickFact label={t('assets.fields.location')} value={asset.location?.name} />
                        <QuickFact label={t('assets.fields.category')} value={asset.category?.name} />
                        <QuickFact label={t('assets.fields.pic')} value={asset.person_in_charge?.name} />
                        <QuickFact label={t('assets.fields.asset_user')} value={asset.user?.name} />
                    </div>

                    <div className="rounded-lg border bg-background p-4 text-sm text-muted-foreground">
                        {t('qr.messages.public_read_only_description')}
                    </div>
                </section>

                <Section title={t('qr.sections.basic')} description={t('qr.sections.basic_desc')}>
                    <DefinitionList items={basicDetails} />
                </Section>

                <Section title={t('qr.sections.financial')} description={t('qr.sections.financial_desc')}>
                    <DefinitionList items={financialDetails} />
                </Section>

                <Section title={t('qr.sections.technical')} description={t('qr.sections.technical_desc')}>
                    <DefinitionList items={technicalDetails} />
                </Section>

                <Section title={t('assets.sections.metadata')} description={t('qr.sections.metadata_desc')}>
                    {metadataEntries.length === 0 ? (
                        <div className="text-sm text-muted-foreground">{t('qr.empty.metadata')}</div>
                    ) : (
                        <DefinitionList
                            items={metadataEntries.map(([key, value]) => ({
                                label: humanizeKey(key),
                                value: formatMetadataValue(value, t),
                            }))}
                        />
                    )}
                </Section>

                <Section title={t('assets.sections.attachments')} description={t('qr.sections.attachments_desc')}>
                    <div className="space-y-5">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                {t('assets.attachments.kinds.photo')}
                            </div>
                            {photos.length === 0 ? (
                                <div className="text-sm text-muted-foreground">{t('qr.empty.photos')}</div>
                            ) : (
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {photos.slice(0, 6).map((attachment) => (
                                        <button
                                            key={attachment.id}
                                            type="button"
                                            onClick={() => setPreviewImage(attachment.media_asset)}
                                            className="group overflow-hidden rounded-lg border bg-background text-left transition hover:border-primary/40"
                                        >
                                            <div className="aspect-[4/3] w-full bg-muted">
                                                {attachment.media_asset?.thumb_url || attachment.media_asset?.url ? (
                                                    <img
                                                        src={attachment.media_asset.thumb_url || attachment.media_asset.url}
                                                        alt={attachment.media_asset?.title || asset.name}
                                                        className="h-full w-full object-cover transition duration-200 group-hover:scale-[1.02]"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center text-muted-foreground">
                                                        <ImageIcon className="h-10 w-10" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-1 p-3">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {attachment.is_primary ? <Badge>{t('assets.attachments.primary')}</Badge> : null}
                                                    <Badge variant="outline">{attachment.media_asset?.mime || t('qr.labels.unknown_file')}</Badge>
                                                </div>
                                                <div className="line-clamp-1 text-sm font-medium">
                                                    {attachment.media_asset?.title || t('qr.labels.untitled_file')}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                {t('assets.attachments.kinds.document')}
                            </div>
                            {documents.length === 0 ? (
                                <div className="text-sm text-muted-foreground">{t('qr.empty.documents')}</div>
                            ) : (
                                <div className="divide-y overflow-hidden rounded-lg border bg-background">
                                    {documents.map((attachment) => (
                                        <div key={attachment.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="min-w-0 space-y-1">
                                                <div className="break-words text-sm font-medium">
                                                    {attachment.media_asset?.title || t('qr.labels.untitled_file')}
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                                    <span>{attachment.media_asset?.mime || t('qr.labels.unknown_file')}</span>
                                                    {attachment.media_asset?.size ? <span>• {formatBytes(attachment.media_asset.size)}</span> : null}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2 sm:flex-row">
                                                {attachment.media_asset?.url ? (
                                                    <>
                                                        <a href={attachment.media_asset.url} target="_blank" rel="noreferrer">
                                                            <Button variant="outline" className="w-full sm:w-auto">
                                                                {t('common.view')}
                                                            </Button>
                                                        </a>
                                                        <a href={attachment.media_asset.url} download>
                                                            <Button className="w-full sm:w-auto">
                                                                <Download className="mr-2 h-4 w-4" />
                                                                {t('qr.actions.download')}
                                                            </Button>
                                                        </a>
                                                    </>
                                                ) : (
                                                    <div className="text-sm text-muted-foreground">{t('qr.messages.file_unavailable')}</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </Section>

                <Section title={t('assets.sections.history')} description={t('qr.sections.history_desc')}>
                    {histories.length === 0 ? (
                        <div className="text-sm text-muted-foreground">{t('assets.history.empty')}</div>
                    ) : (
                        <div className="space-y-3">
                            {histories.map((history) => (
                                <div key={history.id} className="rounded-lg border bg-background p-4">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge variant="secondary">{history.action}</Badge>
                                        <span className="text-sm font-medium">{history.description || '—'}</span>
                                    </div>
                                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                        <CalendarDays className="h-3.5 w-3.5" />
                                        <span>{formatDate(history.created_at, dateFormatter)}</span>
                                        {history.actor?.name ? <span>• {history.actor.name}</span> : null}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Section>
            </div>

            <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/90 backdrop-blur">
                <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <Link href={scanIndex()}>
                        <Button variant="outline" className="w-full sm:w-auto">
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
                    ) : !isAuthenticated ? (
                        <Link href={login()}>
                            <Button className="w-full sm:w-auto">
                                <LogIn className="mr-2 h-4 w-4" />
                                {t('qr.actions.login')}
                            </Button>
                        </Link>
                    ) : null}
                </div>
            </div>

            <Dialog open={previewImage !== null} onOpenChange={(open) => (! open ? setPreviewImage(null) : null)}>
                <DialogContent className="w-[calc(100vw-1rem)] max-w-4xl overflow-hidden p-0">
                    <DialogTitle className="sr-only">{previewImage?.title || asset.name}</DialogTitle>
                    <div className="bg-black">
                        {previewImage?.url ? (
                            <img src={previewImage.url} alt={previewImage.title || asset.name} className="max-h-[85svh] w-full object-contain" />
                        ) : (
                            <div className="flex h-72 items-center justify-center text-white/70">{t('qr.messages.file_unavailable')}</div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

// Uses PublicLayout via inertia layout resolver.

function GalleryHeader({
    asset,
    organizationName,
    photos,
    onPreview,
    t,
}: {
    asset: Asset;
    organizationName: string | null;
    photos: Attachment[];
    onPreview: (mediaAsset: Attachment['media_asset'] | null) => void;
    t: (key: string, replacements?: Record<string, string | number>) => string;
}) {
    return (
        <div className="overflow-hidden rounded-xl border bg-background">
            <div className="relative">
                <div className="flex snap-x snap-mandatory overflow-x-auto">
                    {photos.length === 0 ? (
                        <div className="flex h-64 w-full flex-none items-center justify-center bg-muted text-muted-foreground">
                            <div className="flex flex-col items-center gap-2">
                                <ImageIcon className="h-10 w-10" />
                                <div className="text-sm">{t('qr.empty.photos')}</div>
                            </div>
                        </div>
                    ) : (
                        photos.map((attachment) => (
                            <button
                                key={attachment.id}
                                type="button"
                                className="relative h-64 w-full flex-none snap-start bg-black/5"
                                onClick={() => onPreview(attachment.media_asset)}
                            >
                                {attachment.media_asset?.url ? (
                                    <img
                                        src={attachment.media_asset.url}
                                        alt={attachment.media_asset?.title || asset.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-muted-foreground">
                                        <ImageIcon className="h-10 w-10" />
                                    </div>
                                )}
                            </button>
                        ))
                    )}
                </div>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 text-white">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{asset.code}</Badge>
                        {asset.status ? <Badge>{asset.status.name}</Badge> : null}
                        {asset.condition ? <Badge variant="outline">{asset.condition.name}</Badge> : null}
                        {organizationName ? <Badge variant="outline">{organizationName}</Badge> : null}
                    </div>
                    <div className="mt-2 text-lg font-semibold leading-tight">{asset.name}</div>
                    <div className="mt-1 line-clamp-2 text-sm text-white/80">{asset.description || t('qr.messages.no_description')}</div>
                </div>
            </div>
        </div>
    );
}

function QuickFact({ label, value }: { label: string; value: string | null | undefined }) {
    return (
        <div className="rounded-lg border bg-background px-4 py-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
            <div className="mt-1 break-words text-sm font-medium">{value ?? '—'}</div>
        </div>
    );
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
    return (
        <section className="space-y-3">
            <div className="space-y-1">
                <h2 className="text-base font-semibold tracking-tight">{title}</h2>
                <div className="text-sm text-muted-foreground">{description}</div>
            </div>
            <Separator />
            {children}
        </section>
    );
}

function DefinitionList({ items }: { items: Array<{ label: string; value: string | number | null | undefined }> }) {
    return (
        <dl className="grid gap-4 sm:grid-cols-2">
            {items.map((item) => (
                <div key={item.label} className="min-w-0">
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</dt>
                    <dd className="mt-1 break-words text-sm font-medium">{item.value ?? '—'}</dd>
                </div>
            ))}
        </dl>
    );
}

function formatDate(value: string | null, formatter: Intl.DateTimeFormat): string {
    if (! value) {
        return '—';
    }

    return formatter.format(new Date(value));
}

function formatCurrency(value: string | null, formatter: Intl.NumberFormat): string {
    if (! value) {
        return '—';
    }

    return formatter.format(Number(value));
}

function formatBytes(value: number): string {
    if (value < 1024) {
        return `${value} B`;
    }

    if (value < 1024 * 1024) {
        return `${(value / 1024).toFixed(1)} KB`;
    }

    return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function humanizeKey(value: string): string {
    return value
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatMetadataValue(
    value: unknown,
    t: (key: string, replacements?: Record<string, string | number>) => string,
): string {
    if (Array.isArray(value)) {
        return value.map((item) => String(item)).join(', ');
    }

    if (value === null || value === undefined || value === '') {
        return '—';
    }

    if (typeof value === 'object') {
        return JSON.stringify(value);
    }

    if (typeof value === 'boolean') {
        return value ? t('qr.labels.yes') : t('qr.labels.no');
    }

    return String(value);
}

function formatDepreciation(method: string | null, t: (key: string, replacements?: Record<string, string | number>) => string): string {
    if (! method) {
        return '—';
    }

    const labels: Record<string, string> = {
        straight_line: t('qr.depreciation.straight_line'),
        diminishing: t('qr.depreciation.diminishing'),
        syd: t('qr.depreciation.syd'),
        units_of_production: t('qr.depreciation.units_of_production'),
    };

    return labels[method] ?? method;
}
