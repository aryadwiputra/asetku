import { Head, Link, router, usePage } from '@inertiajs/react';
import { Copy, Download, Pencil, Printer, QrCode, Trash2, Upload } from 'lucide-react';
import { useMemo, useState } from 'react';

import AssetAttachmentController from '@/actions/App/Http/Controllers/AssetAttachmentController';
import AssetController from '@/actions/App/Http/Controllers/AssetController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { chunk, complete, destroy as destroyUpload, store as storeUpload } from '@/routes/media-uploads';
import { print as printLabels } from '@/routes/assets/labels';
import { show as qrShow } from '@/routes/qr';
import { index as assetsIndex } from '@/routes/assets';
import { useTranslation } from '@/hooks/use-translation';

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
    changed_by: number | null;
    payload: unknown;
    created_at: string;
};

type Asset = {
    id: number;
    code: string;
    name: string;
    description: string | null;
    qr_token: string;
    purchase_date: string | null;
    cost: string | null;
    book_value_cached: string | null;
    depreciation_method: string | null;
    useful_life_months: number | null;
    residual_value: string | null;
    latitude: number | null;
    longitude: number | null;
    branch: { id: number; name: string; code: string } | null;
    department: { id: number; name: string; code: string } | null;
    status: { id: number; name: string; code: string } | null;
    condition: { id: number; name: string; code: string } | null;
    category: { id: number; name: string; code: string } | null;
    location: { id: number; name: string; code: string } | null;
    person_in_charge: { id: number; name: string } | null;
    user: { id: number; name: string } | null;
    metadata: Record<string, unknown> | null;
    updated_at: string;
    created_at: string;
};

type Props = {
    asset: Asset;
    histories: HistoryRow[];
    attachments: Attachment[];
};

export default function AssetShow({ asset, histories, attachments }: Props) {
    const { permissions, orgRole } = usePage().props as { permissions: string[]; orgRole: string | null };
    const { t } = useTranslation();

    const canUpdate = permissions.includes('asset.update') || ['Owner', 'Admin', 'Manager'].includes(orgRole || '');
    const canDelete = permissions.includes('asset.delete') || ['Owner', 'Admin', 'Manager'].includes(orgRole || '');

    const qrUrl = qrShow(asset.qr_token).url;

    return (
        <>
            <Head title={t('assets.show.title', { code: asset.code })} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        variant="small"
                        title={asset.name}
                        description={t('assets.show.subtitle', { code: asset.code })}
                    />

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Button
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={() => window.open(printLabels({ query: { ids: [asset.id] } }).url, '_blank', 'noopener,noreferrer')}
                        >
                            <Printer className="mr-2 h-4 w-4" />
                            {t('labels.actions.print')}
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={async () => {
                                await navigator.clipboard.writeText(qrUrl);
                            }}
                        >
                            <Copy className="mr-2 h-4 w-4" />
                            {t('assets.actions.copy_qr_link')}
                        </Button>

                        <Link href={qrUrl}>
                            <Button variant="secondary" className="w-full sm:w-auto">
                                <QrCode className="mr-2 h-4 w-4" />
                                {t('assets.actions.open_qr')}
                            </Button>
                        </Link>

                        {canUpdate ? (
                            <Link href={AssetController.edit.url({ asset: asset.id })}>
                                <Button className="w-full sm:w-auto">
                                    <Pencil className="mr-2 h-4 w-4" />
                                    {t('common.edit')}
                                </Button>
                            </Link>
                        ) : null}

                        {canDelete ? (
                            <Button
                                variant="destructive"
                                className="w-full sm:w-auto"
                                onClick={() => {
                                    if (confirm(t('assets.actions.delete_confirm', { code: asset.code }))) {
                                        router.delete(AssetController.destroy.url({ asset: asset.id }));
                                    }
                                }}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {t('common.delete')}
                            </Button>
                        ) : null}
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('assets.sections.details')}</CardTitle>
                                <CardDescription>{t('assets.sections.details_desc')}</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2">
                                <Detail label={t('assets.fields.code')} value={asset.code} />
                                <Detail label={t('assets.fields.name')} value={asset.name} />
                                <Detail label={t('assets.fields.branch')} value={asset.branch?.name} />
                                <Detail label={t('assets.fields.department')} value={asset.department?.name} />
                                <Detail label={t('assets.fields.location')} value={asset.location?.name} />
                                <Detail label={t('assets.fields.category')} value={asset.category?.name} />
                                <Detail label={t('assets.fields.status')} value={asset.status?.name} />
                                <Detail label={t('assets.fields.condition')} value={asset.condition?.name} />
                                <Detail label={t('assets.fields.pic')} value={asset.person_in_charge?.name} />
                                <Detail label={t('assets.fields.asset_user')} value={asset.user?.name} />
                                <Detail label={t('assets.fields.purchase_date')} value={asset.purchase_date} />
                                <Detail label={t('assets.fields.cost')} value={asset.cost} />
                            </CardContent>
                        </Card>

                        <AttachmentsCard assetId={asset.id} attachments={attachments} canManage={canUpdate} />

                        <Card>
                            <CardHeader>
                                <CardTitle>{t('assets.sections.history')}</CardTitle>
                                <CardDescription>{t('assets.sections.history_desc')}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {histories.length === 0 ? (
                                    <div className="text-sm text-muted-foreground">{t('assets.history.empty')}</div>
                                ) : (
                                    histories.map((h) => (
                                        <div key={h.id} className="flex items-start justify-between gap-3 rounded-lg border p-3">
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Badge variant="secondary">{h.action}</Badge>
                                                    <div className="truncate text-sm font-medium">{h.description || '—'}</div>
                                                </div>
                                                <div className="mt-1 text-xs text-muted-foreground">
                                                    {new Date(h.created_at).toLocaleString()}
                                                </div>
                                            </div>
                                            <div className="shrink-0 text-xs text-muted-foreground">
                                                {h.changed_by ? `#${h.changed_by}` : '—'}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('assets.sections.qr')}</CardTitle>
                                <CardDescription>{t('assets.sections.qr_desc')}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="break-all rounded-md bg-muted p-3 text-xs">{qrUrl}</div>
                                <Link href={qrUrl}>
                                    <Button variant="outline" className="w-full">
                                        <QrCode className="mr-2 h-4 w-4" />
                                        {t('assets.actions.open_qr')}
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {asset.metadata && Object.keys(asset.metadata).length > 0 ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('assets.sections.metadata')}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    {Object.entries(asset.metadata).map(([k, v]) => (
                                        <div key={k} className="flex items-start justify-between gap-3">
                                            <div className="text-muted-foreground">{k}</div>
                                            <div className="min-w-0 break-words text-right">{String(v)}</div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        ) : null}

                        <Link href={assetsIndex()}>
                            <Button variant="ghost" className="w-full">
                                {t('common.back')}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

AssetShow.layout = {
    breadcrumbs: [{ title: 'assets.title', href: assetsIndex() }],
};

function Detail({ label, value }: { label: string; value?: string | number | null }) {
    return (
        <div className="min-w-0">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
            <div className="truncate text-sm">{value ?? '—'}</div>
        </div>
    );
}

function AttachmentsCard({ assetId, attachments, canManage }: { assetId: number; attachments: Attachment[]; canManage: boolean }) {
    const { t } = useTranslation();
    const [file, setFile] = useState<File | null>(null);
    const [kind, setKind] = useState<'photo' | 'document'>('photo');
    const [isPrimary, setIsPrimary] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const photos = useMemo(() => attachments.filter((a) => a.kind === 'photo'), [attachments]);
    const documents = useMemo(() => attachments.filter((a) => a.kind === 'document'), [attachments]);

    async function uploadAndAttach() {
        if (!file) {
            return;
        }

        setUploading(true);
        setError(null);
        setProgress(null);

        const csrf = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '';

        try {
            const initRes = await fetch(storeUpload().url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf, Accept: 'application/json' },
                body: JSON.stringify({
                    title: file.name,
                    original_name: file.name,
                    mime_type: file.type || null,
                    size: file.size,
                }),
            });

            if (!initRes.ok) {
                throw new Error(await initRes.text());
            }

            const init = (await initRes.json()) as { upload_id: string; chunk_size: number; total_chunks: number };

            try {
                for (let index = 0; index < init.total_chunks; index++) {
                    const start = index * init.chunk_size;
                    const end = Math.min(file.size, start + init.chunk_size);
                    const blob = file.slice(start, end);

                    const form = new FormData();
                    form.append('index', String(index));
                    form.append('chunk', blob, file.name);

                    const chunkRes = await fetch(chunk(init.upload_id).url, {
                        method: 'POST',
                        headers: { 'X-CSRF-TOKEN': csrf, Accept: 'application/json' },
                        body: form,
                    });

                    if (!chunkRes.ok) {
                        throw new Error(await chunkRes.text());
                    }

                    setProgress(Math.round(((index + 1) / init.total_chunks) * 100));
                }

                const completeRes = await fetch(complete(init.upload_id).url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf, Accept: 'application/json' },
                    body: JSON.stringify({ title: file.name }),
                });

                if (!completeRes.ok) {
                    throw new Error(await completeRes.text());
                }

                const completeJson = (await completeRes.json()) as { asset_id: number };

                await new Promise<void>((resolve) => {
                    router.post(
                        AssetAttachmentController.store.url({ asset: assetId }),
                        { media_asset_id: completeJson.asset_id, kind, is_primary: kind === 'photo' ? isPrimary : false },
                        { preserveScroll: true, onFinish: () => resolve() },
                    );
                });

                setFile(null);
                setIsPrimary(false);
            } catch (e) {
                await fetch(destroyUpload(init.upload_id).url, { method: 'DELETE', headers: { 'X-CSRF-TOKEN': csrf, Accept: 'application/json' } });
                throw e;
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setUploading(false);
            setTimeout(() => setProgress(null), 800);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('assets.sections.attachments')}</CardTitle>
                <CardDescription>{t('assets.sections.attachments_desc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {canManage ? (
                    <div className="rounded-lg border p-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label>{t('assets.attachments.fields.file')}</Label>
                                <Input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                            </div>
                            <div className="grid gap-2">
                                <Label>{t('assets.attachments.fields.kind')}</Label>
                                <Select value={kind} onValueChange={(v) => setKind(v === 'document' ? 'document' : 'photo')}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="photo">{t('assets.attachments.kinds.photo')}</SelectItem>
                                        <SelectItem value="document">{t('assets.attachments.kinds.document')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {kind === 'photo' ? (
                            <div className="mt-3 flex items-center gap-2">
                                <input
                                    id="primary"
                                    type="checkbox"
                                    checked={isPrimary}
                                    onChange={(e) => setIsPrimary(e.target.checked)}
                                />
                                <Label htmlFor="primary">{t('assets.attachments.fields.primary')}</Label>
                            </div>
                        ) : null}

                        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                            <Button disabled={!file || uploading} onClick={uploadAndAttach} className="w-full sm:w-auto">
                                <Upload className="mr-2 h-4 w-4" />
                                {t('assets.attachments.actions.upload')}
                            </Button>
                            {progress !== null ? <div className="text-sm text-muted-foreground">{progress}%</div> : null}
                            {error ? <InputError message={error} /> : null}
                        </div>
                    </div>
                ) : null}

                <div className="space-y-3">
                    <div className="text-sm font-medium">{t('assets.attachments.kinds.photo')}</div>
                    {photos.length === 0 ? (
                        <div className="text-sm text-muted-foreground">{t('assets.attachments.empty')}</div>
                    ) : (
                        <div className="grid gap-3 sm:grid-cols-2">
                            {photos.map((a) => (
                                <div key={a.id} className="rounded-lg border p-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <div className="truncate text-sm font-medium">{a.media_asset?.title || `#${a.media_asset?.id}`}</div>
                                            {a.is_primary ? <Badge className="mt-1">{t('assets.attachments.primary')}</Badge> : null}
                                        </div>
                                        <div className="shrink-0 flex items-center gap-2">
                                            {a.media_asset?.url ? (
                                                <a href={a.media_asset.url} target="_blank" rel="noreferrer">
                                                    <Button variant="outline" size="sm">
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                </a>
                                            ) : null}
                                            {canManage ? (
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => router.delete(AssetAttachmentController.destroy.url({ asset: assetId, assetMedia: a.id }), { preserveScroll: true })}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            ) : null}
                                        </div>
                                    </div>
                                    {a.media_asset?.thumb_url ? (
                                        <img src={a.media_asset.thumb_url} alt={a.media_asset.title || ''} className="mt-3 h-40 w-full rounded-md object-cover" />
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <div className="text-sm font-medium">{t('assets.attachments.kinds.document')}</div>
                    {documents.length === 0 ? (
                        <div className="text-sm text-muted-foreground">{t('assets.attachments.empty')}</div>
                    ) : (
                        <div className="space-y-2">
                            {documents.map((a) => (
                                <div key={a.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                                    <div className="min-w-0 truncate text-sm">{a.media_asset?.title || `#${a.media_asset?.id}`}</div>
                                    <div className="shrink-0 flex items-center gap-2">
                                        {a.media_asset?.url ? (
                                            <a href={a.media_asset.url} target="_blank" rel="noreferrer">
                                                <Button variant="outline" size="sm">
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </a>
                                        ) : null}
                                        {canManage ? (
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => router.delete(AssetAttachmentController.destroy.url({ asset: assetId, assetMedia: a.id }), { preserveScroll: true })}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        ) : null}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
