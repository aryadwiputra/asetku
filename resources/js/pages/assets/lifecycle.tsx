import { Head, Link, router } from '@inertiajs/react';
import { Camera, Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useTranslation } from '@/hooks/use-translation';
import { index as assetsIndex } from '@/routes/assets';
import { store as storeAttachment, destroy as destroyAttachment } from '@/routes/assets/attachments';
import { store as storeLifecycleEvent } from '@/routes/assets/lifecycle-events';
import lifecycle, { byToken as lifecycleByToken, index as lifecycleIndex, show as lifecycleShow } from '@/routes/assets/lifecycle';
import { store as storeMovement } from '@/routes/assets/movements';
import { chunk, complete, destroy as destroyUpload, store as storeUpload } from '@/routes/media-uploads';
import { cn } from '@/lib/utils';

type Lookup = { id: number; name: string; code?: string; branch_id?: number | null; is_active?: boolean };

type AssetResult = {
    id: number;
    code: string;
    name: string;
    updated_at: string;
    branch?: { id: number; name: string; code: string } | null;
    status?: { id: number; name: string; code: string } | null;
    condition?: { id: number; name: string; code: string } | null;
};

type AssetDetail = {
    id: number;
    code: string;
    name: string;
    branch?: { id: number; name: string; code: string } | null;
    department?: { id: number; name: string; code: string; branch_id: number } | null;
    location?: { id: number; name: string; code: string; branch_id: number; parent_id: number | null; type: string | null } | null;
    status?: { id: number; name: string; code: string } | null;
    condition?: { id: number; name: string; code: string } | null;
    user?: { id: number; name: string } | null;
    updated_at: string;
};

type HistoryRow = {
    id: number;
    action: string;
    performed_at: string | null;
    description: string | null;
    created_at: string;
    actor?: { id: number; name: string } | null;
};

type Attachment = {
    id: number;
    kind: 'photo' | 'document';
    stage: string | null;
    document_type: string | null;
    sort_order: number;
    is_primary: boolean;
    media_asset: null | {
        id: number;
        title: string | null;
        url: string | null;
        thumb_url: string | null;
        mime: string | null;
        size: number | null;
    };
};

type Props = {
    search: string;
    results: AssetResult[];
    asset: AssetDetail | null;
    histories: HistoryRow[];
    attachments: Attachment[];
    meta: {
        assetStatuses: Lookup[];
        assetConditions: Lookup[];
        branches: Array<Lookup & { code: string; is_active?: boolean }>;
        departments: Array<Lookup & { code: string; branch_id: number }>;
        locations: Array<Lookup & { branch_id: number; parent_id: number | null; type: string | null }>;
        assetUsers: Lookup[];
    };
    abilities: { canView: boolean; canUpdate: boolean };
};

type ActionKey = 'movement' | 'event' | 'status' | 'condition' | 'documents' | 'timeline';

export default function AssetLifecyclePage({ search, results, asset, histories, attachments, meta, abilities }: Props) {
    const { t } = useTranslation();
    const pageTitle = t('common.asset_lifecycle');
    const [q, setQ] = useState(search || '');
    const selected = asset;

    const [activeAction, setActiveAction] = useState<ActionKey>('movement');

    const canUpdate = abilities?.canUpdate === true;

    return (
        <>
            <Head title={pageTitle} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Heading variant="small" title={pageTitle} description={t('assets.lifecycle.page.description')} />
                    <Link href={assetsIndex()} className="w-full sm:w-auto">
                        <Button variant="outline" className="w-full sm:w-auto">
                            {t('common.assets')}
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-6 lg:grid-cols-[360px,1fr]">
                    <aside className="space-y-4">
                        <div className="rounded-lg border bg-background p-4">
                            <div className="grid gap-2">
                                <Label>{t('assets.lifecycle.page.search_label')}</Label>
                                <div className="flex gap-2">
                                    <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('assets.lifecycle.page.search_placeholder')} />
                                    <Button
                                        onClick={() => router.get(lifecycleIndex({ query: { q } }).url, {}, { preserveScroll: true })}
                                        disabled={q.trim() === ''}
                                    >
                                        <Search className="mr-2 h-4 w-4" />
                                        {t('assets.lifecycle.page.search_action')}
                                    </Button>
                                </div>
                                <div className="pt-1">
                                    <ScanButton
                                        label={t('assets.lifecycle.page.scan_action')}
                                        onToken={(token) => router.visit(lifecycleByToken(token).url)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="text-sm font-medium">{t('assets.lifecycle.page.results')}</div>
                            {results.length === 0 ? (
                                <div className="rounded-lg border bg-background p-4 text-sm text-muted-foreground">
                                    {t('assets.lifecycle.page.empty')}
                                </div>
                            ) : (
                                <div className="grid gap-2">
                                    {results.map((row) => (
                                        <button
                                            key={row.id}
                                            type="button"
                                            onClick={() => router.visit(lifecycleShow(row.id).url)}
                                            className={cn(
                                                'flex w-full items-start justify-between gap-3 rounded-lg border bg-background p-3 text-left hover:bg-muted/30',
                                                selected?.id === row.id && 'border-primary/40 ring-1 ring-primary/20',
                                            )}
                                        >
                                            <div className="min-w-0">
                                                <div className="truncate text-sm font-medium">{row.name}</div>
                                                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                                    <span className="font-mono">{row.code}</span>
                                                    {row.branch?.code ? <span>• {row.branch.code}</span> : null}
                                                </div>
                                            </div>
                                            <div className="shrink-0 text-xs text-muted-foreground">
                                                {new Date(row.updated_at).toLocaleDateString()}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </aside>

                    <main className="min-w-0">
                        {!selected ? (
                            <div className="rounded-lg border bg-background p-6 text-sm text-muted-foreground">
                                {t('assets.lifecycle.page.select_asset_hint')}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="rounded-lg border bg-background p-4">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <div className="text-sm font-semibold">
                                            {selected.code} — {selected.name}
                                        </div>
                                        {selected.status?.name ? <Badge variant="secondary">{selected.status.name}</Badge> : null}
                                        {selected.condition?.name ? <Badge variant="outline">{selected.condition.name}</Badge> : null}
                                    </div>
                                    <div className="mt-2 text-xs text-muted-foreground">
                                        {selected.branch?.name ? `${t('assets.fields.branch')}: ${selected.branch.name}` : null}
                                        {selected.department?.name ? ` • ${t('assets.fields.department')}: ${selected.department.name}` : null}
                                        {selected.location?.name ? ` • ${t('assets.fields.location')}: ${selected.location.name}` : null}
                                        {selected.user?.name ? ` • ${t('assets.fields.asset_user')}: ${selected.user.name}` : null}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 rounded-lg border bg-background p-4">
                                    <div className="text-sm font-medium">{t('assets.lifecycle.page.actions')}</div>
                                    <ToggleGroup type="single" value={activeAction} onValueChange={(v) => v && setActiveAction(v as ActionKey)} className="flex flex-wrap justify-start">
                                        <ToggleGroupItem value="movement">{t('assets.lifecycle.actions.record_movement')}</ToggleGroupItem>
                                        <ToggleGroupItem value="event">{t('assets.lifecycle.actions.record_event')}</ToggleGroupItem>
                                        <ToggleGroupItem value="status">{t('assets.lifecycle.page.tabs.status')}</ToggleGroupItem>
                                        <ToggleGroupItem value="condition">{t('assets.lifecycle.page.tabs.condition')}</ToggleGroupItem>
                                        <ToggleGroupItem value="documents">{t('assets.lifecycle.page.tabs.documents')}</ToggleGroupItem>
                                        <ToggleGroupItem value="timeline">{t('assets.sections.history')}</ToggleGroupItem>
                                    </ToggleGroup>

                                    <Separator />

                                    {activeAction === 'movement' ? (
                                        <MovementForm assetId={selected.id} meta={meta} canUpdate={canUpdate} />
                                    ) : null}
                                    {activeAction === 'event' ? (
                                        <LifecycleEventForm assetId={selected.id} canUpdate={canUpdate} />
                                    ) : null}
                                    {activeAction === 'status' ? (
                                        <StatusForm assetId={selected.id} statuses={meta.assetStatuses} canUpdate={canUpdate} />
                                    ) : null}
                                    {activeAction === 'condition' ? (
                                        <ConditionForm assetId={selected.id} conditions={meta.assetConditions} canUpdate={canUpdate} />
                                    ) : null}
                                    {activeAction === 'documents' ? (
                                        <LifecycleAttachments assetId={selected.id} attachments={attachments} canManage={canUpdate} />
                                    ) : null}
                                    {activeAction === 'timeline' ? (
                                        <Timeline histories={histories} />
                                    ) : null}

                                    {!canUpdate ? (
                                        <div className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
                                            {t('assets.lifecycle.page.read_only_notice')}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </>
    );
}

AssetLifecyclePage.layout = {
    breadcrumbs: [{ title: 'common.asset_lifecycle', href: lifecycleIndex() }],
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
            <Button variant="outline" className="w-full" onClick={() => setOpen(true)}>
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

function LifecycleEventForm({ assetId, canUpdate }: { assetId: number; canUpdate: boolean }) {
    const { t } = useTranslation();
    const [stage, setStage] = useState<string>('receiving');
    const [performedAt, setPerformedAt] = useState('');
    const [notes, setNotes] = useState('');

    return (
        <div className="grid gap-4">
            <div className="grid gap-2">
                <Label>{t('assets.lifecycle.fields.stage')}</Label>
                <Select value={stage} onValueChange={setStage} disabled={!canUpdate}>
                    <SelectTrigger>
                        <SelectValue placeholder={t('assets.lifecycle.placeholders.stage')} />
                    </SelectTrigger>
                    <SelectContent>
                        {allowedStages.map((s) => (
                            <SelectItem key={s} value={s}>
                                {t(`assets.lifecycle.stages.${s}`)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-2">
                <Label>{t('assets.lifecycle.fields.performed_at')}</Label>
                <Input type="datetime-local" value={performedAt} onChange={(e) => setPerformedAt(e.target.value)} disabled={!canUpdate} />
            </div>
            <div className="grid gap-2">
                <Label>{t('assets.lifecycle.fields.notes')}</Label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} disabled={!canUpdate} />
            </div>
            <Button
                disabled={!canUpdate}
                onClick={() =>
                    router.post(
                        storeLifecycleEvent.url({ asset: assetId }),
                        { stage, performed_at: performedAt || null, notes: notes || null },
                        { preserveScroll: true },
                    )
                }
                className="w-full sm:w-auto"
            >
                {t('common.save')}
            </Button>
        </div>
    );
}

function MovementForm({ assetId, meta, canUpdate }: { assetId: number; meta: Props['meta']; canUpdate: boolean }) {
    const { t } = useTranslation();
    const [type, setType] = useState<'placement' | 'transfer' | 'borrow' | 'return'>('transfer');

    const [toBranchId, setToBranchId] = useState<string>('');
    const [toDepartmentId, setToDepartmentId] = useState<string>('');
    const [toLocationId, setToLocationId] = useState<string>('');
    const [toAssetUserId, setToAssetUserId] = useState<string>('');
    const [performedAt, setPerformedAt] = useState('');
    const [notes, setNotes] = useState('');

    const hasDestination = Boolean(toBranchId || toDepartmentId || toLocationId || toAssetUserId);
    const canSubmit =
        type === 'borrow' ? Boolean(toAssetUserId) : type === 'transfer' || type === 'placement' ? hasDestination : true;

    return (
        <div className="grid gap-4">
            <div className="grid gap-2">
                <Label>{t('assets.lifecycle.fields.movement_type')}</Label>
                <Select value={type} onValueChange={(v) => setType(v as any)} disabled={!canUpdate}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {allowedMovementTypes.map((mt) => (
                            <SelectItem key={mt} value={mt}>
                                {t(`assets.lifecycle.movement_types.${mt}`)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                    <Label>{t('assets.fields.branch')}</Label>
                    <Select value={toBranchId} onValueChange={setToBranchId} disabled={!canUpdate}>
                        <SelectTrigger>
                            <SelectValue placeholder={t('assets.placeholders.branch')} />
                        </SelectTrigger>
                        <SelectContent>
                            {meta.branches.map((b) => (
                                <SelectItem key={b.id} value={String(b.id)}>
                                    {b.code} — {b.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label>{t('assets.fields.department')}</Label>
                    <Select value={toDepartmentId} onValueChange={setToDepartmentId} disabled={!canUpdate}>
                        <SelectTrigger>
                            <SelectValue placeholder={t('assets.placeholders.department')} />
                        </SelectTrigger>
                        <SelectContent>
                            {meta.departments
                                .filter((d) => !toBranchId || String(d.branch_id) === toBranchId)
                                .map((d) => (
                                    <SelectItem key={d.id} value={String(d.id)}>
                                        {d.code} — {d.name}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                    <Label>{t('assets.fields.location')}</Label>
                    <Select value={toLocationId} onValueChange={setToLocationId} disabled={!canUpdate}>
                        <SelectTrigger>
                            <SelectValue placeholder={t('assets.placeholders.location')} />
                        </SelectTrigger>
                        <SelectContent>
                            {meta.locations
                                .filter((l) => !toBranchId || String(l.branch_id) === toBranchId)
                                .map((l) => (
                                    <SelectItem key={l.id} value={String(l.id)}>
                                        {l.name}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label>{t('assets.fields.asset_user')}</Label>
                    <Select value={toAssetUserId} onValueChange={setToAssetUserId} disabled={!canUpdate}>
                        <SelectTrigger>
                            <SelectValue placeholder={t('assets.placeholders.asset_user')} />
                        </SelectTrigger>
                        <SelectContent>
                            {type === 'return' ? <SelectItem value="">{t('common.none')}</SelectItem> : null}
                            {meta.assetUsers.map((u) => (
                                <SelectItem key={u.id} value={String(u.id)}>
                                    {u.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                    <Label>{t('assets.lifecycle.fields.performed_at')}</Label>
                    <Input type="datetime-local" value={performedAt} onChange={(e) => setPerformedAt(e.target.value)} disabled={!canUpdate} />
                </div>
                <div className="grid gap-2">
                    <Label>{t('assets.lifecycle.fields.notes')}</Label>
                    <Input value={notes} onChange={(e) => setNotes(e.target.value)} disabled={!canUpdate} />
                </div>
            </div>

            {!canSubmit ? (
                <div className="text-sm text-destructive">{t('assets.lifecycle.validation.destination_required')}</div>
            ) : null}

            <Button
                disabled={!canUpdate || !canSubmit}
                onClick={() =>
                    router.post(
                        storeMovement.url({ asset: assetId }),
                        {
                            type,
                            to_branch_id: toBranchId || null,
                            to_department_id: toDepartmentId || null,
                            to_location_id: toLocationId || null,
                            to_asset_user_id: toAssetUserId || null,
                            performed_at: performedAt || null,
                            notes: notes || null,
                        },
                        { preserveScroll: true },
                    )
                }
                className="w-full sm:w-auto"
            >
                {t('common.save')}
            </Button>
        </div>
    );
}

function StatusForm({ assetId, statuses, canUpdate }: { assetId: number; statuses: Lookup[]; canUpdate: boolean }) {
    const { t } = useTranslation();
    const [statusId, setStatusId] = useState('');
    const [performedAt, setPerformedAt] = useState('');
    const [notes, setNotes] = useState('');

    return (
        <div className="grid gap-4">
            <div className="grid gap-2">
                <Label>{t('assets.fields.status')}</Label>
                <Select value={statusId} onValueChange={setStatusId} disabled={!canUpdate}>
                    <SelectTrigger>
                        <SelectValue placeholder={t('assets.placeholders.status')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">{t('common.none')}</SelectItem>
                        {statuses.map((s) => (
                            <SelectItem key={s.id} value={String(s.id)}>
                                {s.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-2">
                <Label>{t('assets.lifecycle.fields.performed_at')}</Label>
                <Input type="datetime-local" value={performedAt} onChange={(e) => setPerformedAt(e.target.value)} disabled={!canUpdate} />
            </div>
            <div className="grid gap-2">
                <Label>{t('assets.lifecycle.fields.notes')}</Label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} disabled={!canUpdate} />
            </div>
            <Button
                disabled={!canUpdate}
                onClick={() =>
                    router.post(
                        lifecycle.status.url({ asset: assetId }),
                        { asset_status_id: statusId ? Number(statusId) : null, performed_at: performedAt || null, notes: notes || null },
                        { preserveScroll: true },
                    )
                }
                className="w-full sm:w-auto"
            >
                {t('common.save')}
            </Button>
        </div>
    );
}

function ConditionForm({ assetId, conditions, canUpdate }: { assetId: number; conditions: Lookup[]; canUpdate: boolean }) {
    const { t } = useTranslation();
    const [conditionId, setConditionId] = useState('');
    const [performedAt, setPerformedAt] = useState('');
    const [notes, setNotes] = useState('');

    return (
        <div className="grid gap-4">
            <div className="grid gap-2">
                <Label>{t('assets.fields.condition')}</Label>
                <Select value={conditionId} onValueChange={setConditionId} disabled={!canUpdate}>
                    <SelectTrigger>
                        <SelectValue placeholder={t('assets.placeholders.condition')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">{t('common.none')}</SelectItem>
                        {conditions.map((c) => (
                            <SelectItem key={c.id} value={String(c.id)}>
                                {c.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-2">
                <Label>{t('assets.lifecycle.fields.performed_at')}</Label>
                <Input type="datetime-local" value={performedAt} onChange={(e) => setPerformedAt(e.target.value)} disabled={!canUpdate} />
            </div>
            <div className="grid gap-2">
                <Label>{t('assets.lifecycle.fields.notes')}</Label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} disabled={!canUpdate} />
            </div>
            <Button
                disabled={!canUpdate}
                onClick={() =>
                    router.post(
                        lifecycle.condition.url({ asset: assetId }),
                        { asset_condition_id: conditionId ? Number(conditionId) : null, performed_at: performedAt || null, notes: notes || null },
                        { preserveScroll: true },
                    )
                }
                className="w-full sm:w-auto"
            >
                {t('common.save')}
            </Button>
        </div>
    );
}

function Timeline({ histories }: { histories: HistoryRow[] }) {
    const { t } = useTranslation();

    if (!histories || histories.length === 0) {
        return <div className="text-sm text-muted-foreground">{t('assets.history.empty')}</div>;
    }

    return (
        <div className="space-y-2">
            {histories.map((h) => (
                <div key={h.id} className="flex items-start justify-between gap-3 rounded-lg border p-3">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="secondary">{h.action}</Badge>
                            <div className="truncate text-sm font-medium">{h.description || '—'}</div>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                            {new Date(h.performed_at ?? h.created_at).toLocaleString()}
                            {h.actor?.name ? ` • ${h.actor.name}` : ''}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function LifecycleAttachments({ assetId, attachments, canManage }: { assetId: number; attachments: Attachment[]; canManage: boolean }) {
    const { t } = useTranslation();
    const [file, setFile] = useState<File | null>(null);
    const [kind, setKind] = useState<'photo' | 'document'>('document');
    const [isPrimary, setIsPrimary] = useState(false);
    const [stage, setStage] = useState<string>('');
    const [documentType, setDocumentType] = useState<string>('other');
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
                        storeAttachment.url({ asset: assetId }),
                        {
                            media_asset_id: completeJson.asset_id,
                            kind,
                            is_primary: kind === 'photo' ? isPrimary : false,
                            stage: kind === 'document' && stage ? stage : null,
                            document_type: kind === 'document' ? documentType : null,
                        },
                        { preserveScroll: true, onFinish: () => resolve() },
                    );
                });

                setFile(null);
                setIsPrimary(false);
                setStage('');
                setDocumentType('other');
            } catch (e) {
                await fetch(destroyUpload(init.upload_id).url, {
                    method: 'DELETE',
                    headers: { 'X-CSRF-TOKEN': csrf, Accept: 'application/json' },
                });
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
        <div className="space-y-4">
            {canManage ? (
                <div className="rounded-lg border p-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label>{t('assets.attachments.fields.file')}</Label>
                            <Input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                        </div>
                        <div className="grid gap-2">
                            <Label>{t('assets.attachments.fields.kind')}</Label>
                            <Select value={kind} onValueChange={(v) => setKind(v === 'photo' ? 'photo' : 'document')}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="document">{t('assets.attachments.kinds.document')}</SelectItem>
                                    <SelectItem value="photo">{t('assets.attachments.kinds.photo')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {kind === 'document' ? (
                            <>
                                <div className="grid gap-2">
                                    <Label>{t('assets.lifecycle.fields.stage')}</Label>
                                    <Select value={stage} onValueChange={setStage}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('assets.lifecycle.placeholders.stage')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {allowedStages.map((s) => (
                                                <SelectItem key={s} value={s}>
                                                    {t(`assets.lifecycle.stages.${s}`)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>{t('assets.lifecycle.fields.document_type')}</Label>
                                    <Select value={documentType} onValueChange={setDocumentType}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('assets.lifecycle.placeholders.document_type')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {allowedDocumentTypes.map((dt) => (
                                                <SelectItem key={dt} value={dt}>
                                                    {t(`assets.lifecycle.document_types.${dt}`)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-end gap-2">
                                <label className="flex items-center gap-2 text-sm">
                                    <input type="checkbox" checked={isPrimary} onChange={(e) => setIsPrimary(e.target.checked)} />
                                    {t('assets.attachments.fields.primary')}
                                </label>
                            </div>
                        )}
                    </div>

                    {error ? <InputError message={error} /> : null}
                    {progress !== null ? <div className="text-sm text-muted-foreground">{t('common.loading')} {progress}%</div> : null}

                    <div className="mt-4">
                        <Button onClick={uploadAndAttach} disabled={!file || uploading} className="w-full sm:w-auto">
                            {t('assets.attachments.actions.upload')}
                        </Button>
                    </div>
                </div>
            ) : null}

            <div className="space-y-3">
                <div className="text-sm font-medium">{t('assets.attachments.kinds.document')}</div>
                {documents.length === 0 ? (
                    <div className="text-sm text-muted-foreground">{t('assets.attachments.empty')}</div>
                ) : (
                    <div className="space-y-2">
                        {documents.map((a) => (
                            <div key={a.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                                <div className="min-w-0">
                                    <div className="truncate text-sm">{a.media_asset?.title || `#${a.media_asset?.id}`}</div>
                                    {a.stage || a.document_type ? (
                                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                            {a.stage ? <span>{t(`assets.lifecycle.stages.${a.stage}`)}</span> : null}
                                            {a.document_type ? <span>• {t(`assets.lifecycle.document_types.${a.document_type}`)}</span> : null}
                                        </div>
                                    ) : null}
                                </div>
                                <div className="shrink-0 flex items-center gap-2">
                                    {a.media_asset?.url ? (
                                        <a href={a.media_asset.url} target="_blank" rel="noreferrer">
                                            <Button variant="outline" size="sm">{t('common.view')}</Button>
                                        </a>
                                    ) : null}
                                    {canManage ? (
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => router.delete(destroyAttachment({ asset: assetId, assetMedia: a.id }).url, { preserveScroll: true })}
                                        >
                                            {t('common.delete')}
                                        </Button>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

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
                                                <Button variant="outline" size="sm">{t('common.view')}</Button>
                                            </a>
                                        ) : null}
                                        {canManage ? (
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => router.delete(destroyAttachment({ asset: assetId, assetMedia: a.id }).url, { preserveScroll: true })}
                                            >
                                                {t('common.delete')}
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
        </div>
    );
}

const allowedStages = ['acquisition', 'receiving', 'placement', 'usage', 'maintenance', 'mutation', 'disposal'] as const;
const allowedDocumentTypes = [
    'invoice',
    'po',
    'bast',
    'receipt',
    'work_order',
    'service_report',
    'assignment_letter',
    'loan_form',
    'disposal_report',
    'sale_proof',
    'other',
] as const;
const allowedMovementTypes = ['placement', 'transfer', 'borrow', 'return'] as const;
