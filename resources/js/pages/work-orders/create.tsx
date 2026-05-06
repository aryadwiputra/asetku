import { Head, router, useForm } from '@inertiajs/react';
import { Camera, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import WorkOrderController from '@/actions/App/Http/Controllers/WorkOrderController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/hooks/use-translation';
import { byToken as workOrdersByToken, create as workOrdersCreate, index as workOrdersIndex } from '@/routes/work-orders';

type AssetResult = {
    id: number;
    code: string;
    name: string;
    updated_at: string;
    branch: { id: number; name: string; code: string } | null;
    status: { id: number; name: string; code: string } | null;
    condition: { id: number; name: string; code: string } | null;
    category?: { id: number; name: string; code: string; parent_id: number | null } | null;
};

type Props = {
    search: string | null;
    results: AssetResult[];
    selectedAsset: AssetResult | null;
    meta: {
        priorities: string[];
        types: string[];
        sources: string[];
        checklistTemplates: { id: number; name: string; asset_category_id: number | null; required_skill: string | null }[];
    };
};

export default function WorkOrdersCreate({ search, results, selectedAsset, meta }: Props) {
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
        description: '',
        performed_at: '',
        type: 'corrective',
        source: 'manual',
        priority: 'normal',
        checklist_template_id: '',
        sla_response_hours: '',
        sla_resolution_hours: '',
        notes: '',
        internal_notes: '',
    });

    const typeOptions = useMemo(
        () => meta.types.map((v) => ({ value: v, label: t(`work_orders.types.${v}`) })),
        [t, meta.types],
    );
    const sourceOptions = useMemo(
        () => meta.sources.map((v) => ({ value: v, label: t(`work_orders.sources.${v}`) })),
        [t, meta.sources],
    );
    const priorityOptions = useMemo(
        () => meta.priorities.map((v) => ({ value: v, label: t(`work_orders.priorities.${v}`) })),
        [t, meta.priorities],
    );

    function doSearch() {
        router.get(workOrdersCreate({ query: { search: q } }).url, {}, { preserveScroll: true });
    }

    function pickAsset(asset: AssetResult) {
        setPickedAsset(asset);
        form.setData('asset_id', String(asset.id));
    }

    function submit() {
        form.post(WorkOrderController.store.url(), {
            preserveScroll: true,
        });
    }

    const checklistOptions = meta.checklistTemplates.map((tplt) => ({ value: String(tplt.id), label: tplt.name }));

    return (
        <>
            <Head title={t('work_orders.actions.new')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <Heading variant="small" title={t('work_orders.actions.new')} description={t('work_orders.create_description')} />
                    <Button variant="outline" onClick={() => router.visit(workOrdersIndex())} className="w-full sm:w-auto">
                        {t('common.back')}
                    </Button>
                </div>

                <div className="space-y-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <div className="flex-1">
                            <Label htmlFor="asset-search">{t('work_orders.fields.asset_search')}</Label>
                            <div className="mt-1 flex gap-2">
                                <Input id="asset-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('datatable.search')} />
                                <Button type="button" variant="outline" onClick={doSearch}>
                                    <Search className="mr-2 h-4 w-4" />
                                    {t('common.search')}
                                </Button>
                            </div>
                        </div>
                        <ScanButton label={t('common.scan_qr')} onToken={(token) => router.visit(workOrdersByToken(token).url)} />
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
                        <div className="md:col-span-2">
                            <Label htmlFor="description">{t('work_orders.fields.description')}</Label>
                            <Input id="description" value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} />
                            <InputError message={form.errors.description} />
                        </div>

                        <div>
                            <Label>{t('work_orders.fields.type')}</Label>
                            <Select value={form.data.type} onValueChange={(v) => form.setData('type', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {typeOptions.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.type} />
                        </div>

                        <div>
                            <Label>{t('work_orders.fields.source')}</Label>
                            <Select value={form.data.source} onValueChange={(v) => form.setData('source', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {sourceOptions.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.source} />
                        </div>

                        <div>
                            <Label>{t('work_orders.fields.priority')}</Label>
                            <Select value={form.data.priority} onValueChange={(v) => form.setData('priority', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {priorityOptions.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.priority} />
                        </div>

                        <div>
                            <Label htmlFor="performed_at">{t('work_orders.fields.performed_at')}</Label>
                            <Input id="performed_at" type="datetime-local" value={form.data.performed_at} onChange={(e) => form.setData('performed_at', e.target.value)} />
                            <InputError message={form.errors.performed_at} />
                        </div>

                        <div className="md:col-span-2">
                            <Label>{t('work_orders.fields.checklist_template')}</Label>
                            <Select value={form.data.checklist_template_id || 'none'} onValueChange={(v) => form.setData('checklist_template_id', v === 'none' ? '' : v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('common.optional')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">{t('common.none')}</SelectItem>
                                    {checklistOptions.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.checklist_template_id} />
                        </div>

                        <div>
                            <Label htmlFor="sla_response_hours">{t('work_orders.fields.sla_response_hours')}</Label>
                            <Input id="sla_response_hours" inputMode="numeric" value={form.data.sla_response_hours} onChange={(e) => form.setData('sla_response_hours', e.target.value)} />
                            <InputError message={form.errors.sla_response_hours} />
                        </div>

                        <div>
                            <Label htmlFor="sla_resolution_hours">{t('work_orders.fields.sla_resolution_hours')}</Label>
                            <Input id="sla_resolution_hours" inputMode="numeric" value={form.data.sla_resolution_hours} onChange={(e) => form.setData('sla_resolution_hours', e.target.value)} />
                            <InputError message={form.errors.sla_resolution_hours} />
                        </div>

                        <div className="md:col-span-2">
                            <Label htmlFor="notes">{t('common.notes')}</Label>
                            <Input id="notes" value={form.data.notes} onChange={(e) => form.setData('notes', e.target.value)} />
                            <InputError message={form.errors.notes} />
                        </div>

                        <div className="md:col-span-2">
                            <Label htmlFor="internal_notes">{t('work_orders.fields.internal_notes')}</Label>
                            <Input id="internal_notes" value={form.data.internal_notes} onChange={(e) => form.setData('internal_notes', e.target.value)} />
                            <InputError message={form.errors.internal_notes} />
                        </div>
                    </div>

                    <Button onClick={submit} disabled={form.processing || !form.data.asset_id} className="w-full sm:w-auto">
                        {t('common.save')}
                    </Button>
                    <InputError message={form.errors.asset_id} />
                </div>
            </div>
        </>
    );
}

function ScanButton({ label, onToken }: { label: string; onToken: (token: string) => void }) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const detectorRef = useRef<any>(null);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        return () => cleanup();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function start() {
        setError(null);

        if (!(window as any).BarcodeDetector) {
            setError(t('common.browser_not_supported'));
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }

            detectorRef.current = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
            scanLoop();
        } catch (e) {
            setError(t('common.camera_permission_denied'));
        }
    }

    function cleanup() {
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }

        const video = videoRef.current;
        const stream = (video?.srcObject as MediaStream | null) || null;

        if (stream) {
            stream.getTracks().forEach((t) => t.stop());
        }

        if (video) {
            video.pause();
            video.srcObject = null;
        }

        detectorRef.current = null;
    }

    async function scanLoop() {
        const video = videoRef.current;
        const detector = detectorRef.current;

        if (!video || !detector) {
            return;
        }

        try {
            const barcodes = await detector.detect(video);
            const rawValue = barcodes?.[0]?.rawValue;

            if (rawValue && typeof rawValue === 'string') {
                cleanup();
                setOpen(false);
                const token = rawValue.includes('/q/') ? rawValue.split('/q/').pop() : rawValue;
                onToken((token || rawValue).trim());
                return;
            }
        } catch {
            // ignore
        }

        rafRef.current = requestAnimationFrame(scanLoop);
    }

    return (
        <>
            <Button type="button" variant="outline" onClick={() => { setOpen(true); start(); }} className="w-full sm:w-auto">
                <Camera className="mr-2 h-4 w-4" />
                {label}
            </Button>

            <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) cleanup(); }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t('common.scan_qr')}</DialogTitle>
                    </DialogHeader>
                    {error ? (
                        <div className="text-sm text-destructive">{error}</div>
                    ) : (
                        <div className="overflow-hidden rounded-lg border">
                            <video ref={videoRef} className="h-[280px] w-full object-cover" playsInline muted />
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
