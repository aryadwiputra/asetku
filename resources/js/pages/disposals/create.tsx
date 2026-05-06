import { Head, router, useForm } from '@inertiajs/react';
import { Camera, Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import AssetDisposalController from '@/actions/App/Http/Controllers/AssetDisposalController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/hooks/use-translation';
import { byToken as disposalsByToken, create as disposalsCreate, index as disposalsIndex } from '@/routes/disposals';

type AssetResult = {
    id: number;
    code: string;
    name: string;
    updated_at: string;
    branch: { id: number; name: string; code: string } | null;
    status: { id: number; name: string; code: string } | null;
    condition: { id: number; name: string; code: string } | null;
};

type Props = {
    search: string | null;
    results: AssetResult[];
    selectedAsset: AssetResult | null;
    types: string[];
};

export default function DisposalsCreate({ search, results, selectedAsset, types }: Props) {
    const { t } = useTranslation();

    const [q, setQ] = useState(search || '');
    const [pickedAsset, setPickedAsset] = useState<AssetResult | null>(selectedAsset);

    useEffect(() => {
        setPickedAsset(selectedAsset);
        if (selectedAsset) {
            form.setData('asset_id', String(selectedAsset.id));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedAsset]);

    const form = useForm({
        asset_id: '',
        type: 'sale',
        disposed_at: '',
        reason: '',
        notes: '',
        proceeds_amount: '',
        fees_amount: '',
        fair_value_amount: '',
    });

    const showSaleFields = form.data.type === 'sale' || form.data.type === 'scrap';
    const showDonationFields = form.data.type === 'donation';

    const typesOptions = useMemo(() => types.map((v) => ({ value: v, label: t(`disposals.types.${v}`) })), [t, types]);

    function doSearch() {
        router.get(disposalsCreate({ query: { search: q } }).url, {}, { preserveScroll: true });
    }

    function pickAsset(asset: AssetResult) {
        setPickedAsset(asset);
        form.setData('asset_id', String(asset.id));
    }

    function submit() {
        form.post(AssetDisposalController.store.url(), {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    }

    return (
        <>
            <Head title={t('disposals.actions.new')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <Heading variant="small" title={t('disposals.actions.new')} description={t('disposals.create_description')} />
                    <Button variant="outline" onClick={() => router.visit(disposalsIndex())} className="w-full sm:w-auto">
                        {t('common.back')}
                    </Button>
                </div>

                <div className="space-y-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <div className="flex-1">
                            <Label htmlFor="asset-search">{t('disposals.fields.asset_search')}</Label>
                            <div className="mt-1 flex gap-2">
                                <Input id="asset-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('datatable.search')} />
                                <Button type="button" variant="outline" onClick={doSearch}>
                                    <Search className="mr-2 h-4 w-4" />
                                    {t('common.search')}
                                </Button>
                            </div>
                        </div>
                        <ScanButton
                            label={t('common.scan_qr')}
                            onToken={(token) => router.visit(disposalsByToken(token))}
                        />
                    </div>

                    <div className="grid gap-2">
                        {results.length === 0 ? (
                            <div className="rounded-lg border p-4 text-sm text-muted-foreground">{t('datatable.no_results')}</div>
                        ) : (
                            results.map((asset) => (
                                <button
                                    key={asset.id}
                                    type="button"
                                    onClick={() => pickAsset(asset)}
                                    className={`flex w-full items-start justify-between gap-3 rounded-lg border p-3 text-left hover:bg-muted/40 ${
                                        pickedAsset?.id === asset.id ? 'border-primary' : ''
                                    }`}
                                >
                                    <div className="min-w-0">
                                        <div className="truncate font-medium">{asset.name}</div>
                                        <div className="truncate text-xs text-muted-foreground">{asset.code}</div>
                                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                            {asset.branch ? <span>{asset.branch.code}</span> : null}
                                            {asset.status ? <Badge variant="secondary">{asset.status.name}</Badge> : null}
                                            {asset.condition ? <Badge variant="secondary">{asset.condition.name}</Badge> : null}
                                        </div>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{asset.updated_at}</span>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                <div className="space-y-4 border-t pt-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <Label>{t('disposals.fields.type')}</Label>
                            <Select value={form.data.type} onValueChange={(v) => form.setData('type', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {typesOptions.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.type} />
                        </div>

                        <div>
                            <Label htmlFor="disposed_at">{t('disposals.fields.disposed_at')}</Label>
                            <Input id="disposed_at" type="date" value={form.data.disposed_at} onChange={(e) => form.setData('disposed_at', e.target.value)} />
                            <InputError message={form.errors.disposed_at} />
                        </div>

                        <div className="md:col-span-2">
                            <Label htmlFor="reason">{t('disposals.fields.reason')}</Label>
                            <Input id="reason" value={form.data.reason} onChange={(e) => form.setData('reason', e.target.value)} />
                            <InputError message={form.errors.reason} />
                        </div>

                        <div className="md:col-span-2">
                            <Label htmlFor="notes">{t('common.notes')}</Label>
                            <Input id="notes" value={form.data.notes} onChange={(e) => form.setData('notes', e.target.value)} />
                            <InputError message={form.errors.notes} />
                        </div>

                        {showSaleFields ? (
                            <>
                                <div>
                                    <Label htmlFor="proceeds_amount">{t('disposals.fields.proceeds')}</Label>
                                    <Input id="proceeds_amount" inputMode="decimal" value={form.data.proceeds_amount} onChange={(e) => form.setData('proceeds_amount', e.target.value)} />
                                    <InputError message={form.errors.proceeds_amount} />
                                </div>
                                <div>
                                    <Label htmlFor="fees_amount">{t('disposals.fields.fees')}</Label>
                                    <Input id="fees_amount" inputMode="decimal" value={form.data.fees_amount} onChange={(e) => form.setData('fees_amount', e.target.value)} />
                                    <InputError message={form.errors.fees_amount} />
                                </div>
                            </>
                        ) : null}

                        {showDonationFields ? (
                            <div className="md:col-span-2">
                                <Label htmlFor="fair_value_amount">{t('disposals.fields.fair_value')}</Label>
                                <Input id="fair_value_amount" inputMode="decimal" value={form.data.fair_value_amount} onChange={(e) => form.setData('fair_value_amount', e.target.value)} />
                                <InputError message={form.errors.fair_value_amount} />
                            </div>
                        ) : null}
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Button disabled={form.processing || !form.data.asset_id} onClick={submit} className="w-full sm:w-auto">
                            {t('disposals.actions.submit')}
                        </Button>
                        {!form.data.asset_id ? (
                            <span className="text-xs text-muted-foreground">{t('disposals.errors.select_asset')}</span>
                        ) : null}
                    </div>
                </div>
            </div>
        </>
    );
}

DisposalsCreate.layout = {
    breadcrumbs: [
        { title: 'disposals.title', href: disposalsIndex.url() },
        { title: 'disposals.actions.new', href: disposalsCreate.url() },
    ],
};

function ScanButton({ label, onToken }: { label: string; onToken: (token: string) => void }) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [supported, setSupported] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const detectorRef = useRef<BarcodeDetector | null>(null);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        setSupported(typeof window !== 'undefined' && 'BarcodeDetector' in window);
    }, []);

    function parseToken(raw: string): string | null {
        const trimmed = raw.trim();
        if (trimmed === '') {
            return null;
        }

        try {
            const url = new URL(trimmed);
            const match = url.pathname.match(/^\/q\/([^/]+)$/);
            if (match?.[1]) {
                return match[1];
            }
        } catch {
            // ignore
        }

        return trimmed.length >= 16 ? trimmed : null;
    }

    function stop() {
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
        setScanning(false);
    }

    async function start() {
        setError(null);

        if (!supported) {
            setError(t('assets.lifecycle.page.scan_not_supported'));
            return;
        }
        if (!videoRef.current) {
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
            streamRef.current = stream;
            videoRef.current.srcObject = stream;
            await videoRef.current.play();

            detectorRef.current = new BarcodeDetector({ formats: ['qr_code'] });
            setScanning(true);

            const tick = async () => {
                if (!videoRef.current || !detectorRef.current) {
                    return;
                }

                try {
                    const barcodes = await detectorRef.current.detect(videoRef.current);
                    const raw = barcodes[0]?.rawValue;
                    if (raw) {
                        const token = parseToken(raw);
                        if (token) {
                            stop();
                            setOpen(false);
                            onToken(token);
                            return;
                        }
                    }
                } catch {
                    // ignore frame errors
                }

                rafRef.current = window.requestAnimationFrame(tick);
            };

            rafRef.current = window.requestAnimationFrame(tick);
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        }
    }

    useEffect(() => {
        if (!open) {
            stop();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    return (
        <>
            <Button type="button" variant="outline" onClick={() => setOpen(true)} className="w-full sm:w-auto">
                <Camera className="mr-2 h-4 w-4" />
                {label}
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>{t('assets.lifecycle.page.scan_title')}</DialogTitle>
                    </DialogHeader>

                    {!supported ? (
                        <div className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
                            {t('assets.lifecycle.page.scan_not_supported')}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <video ref={videoRef} className="aspect-video w-full rounded-lg border bg-black" playsInline />
                            {error ? (
                                <div className="rounded-lg border bg-destructive/10 p-3 text-sm text-destructive">
                                    {error}
                                </div>
                            ) : null}
                            <div className="flex flex-col gap-2 sm:flex-row">
                                {!scanning ? (
                                    <Button onClick={start} className="w-full sm:w-auto">
                                        {t('assets.lifecycle.page.scan_start')}
                                    </Button>
                                ) : (
                                    <Button variant="outline" onClick={stop} className="w-full sm:w-auto">
                                        {t('assets.lifecycle.page.scan_stop')}
                                    </Button>
                                )}
                                <Button variant="ghost" onClick={() => setOpen(false)} className="w-full sm:w-auto">
                                    <X className="mr-2 h-4 w-4" />
                                    {t('common.close')}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
