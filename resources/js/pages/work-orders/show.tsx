import { Head, router, useForm } from '@inertiajs/react';
import { CheckCircle2, Download, Paperclip, Plus, UserCog } from 'lucide-react';
import { useMemo, useState } from 'react';

import WorkOrderAttachmentController from '@/actions/App/Http/Controllers/WorkOrderAttachmentController';
import WorkOrderController from '@/actions/App/Http/Controllers/WorkOrderController';
import WorkOrderCostLineController from '@/actions/App/Http/Controllers/WorkOrderCostLineController';
import WorkOrderTaskController from '@/actions/App/Http/Controllers/WorkOrderTaskController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { chunk, complete, destroy as destroyUpload, store as storeUpload } from '@/routes/media-uploads';
import { index as workOrdersIndex } from '@/routes/work-orders';
import { useTranslation } from '@/hooks/use-translation';

type MediaAsset = {
    id: number;
    title: string | null;
    url: string | null;
    thumb_url?: string | null;
    mime?: string | null;
    size?: number | null;
};

type WorkOrder = {
    id: number;
    work_order_number: string;
    type: string;
    source: string;
    priority: string;
    status: string;
    progress_percent: number;
    description: string;
    notes: string | null;
    internal_notes: string | null;
    performed_at: string | null;
    sla_response_hours: number | null;
    sla_resolution_hours: number | null;
    response_due_at: string | null;
    resolution_due_at: string | null;
    escalation_level: number;
    assigned_to: number | null;
    assigned_at: string | null;
    acknowledged_at: string | null;
    started_at: string | null;
    completed_at: string | null;
    branch: { id: number; name: string; code: string } | null;
    technician: { id: number; name: string; email: string | null } | null;
    schedule: { id: number; name: string; required_skill: string | null } | null;
    checklist_template: { id: number; name: string; required_skill: string | null } | null;
    cost: string | null;
    asset: {
        id: number;
        code: string;
        name: string;
        branch: { id: number; name: string; code: string } | null;
        category: { id: number; name: string; code: string; parent_id: number | null } | null;
        status: { id: number; name: string; code: string } | null;
        condition: { id: number; name: string; code: string } | null;
        person_in_charge: { id: number; name: string; email: string | null } | null;
        user: { id: number; name: string; email: string | null } | null;
    } | null;
    tasks: {
        id: number;
        title: string;
        is_required: boolean;
        completed_at: string | null;
        completed_by: number | null;
        notes: string | null;
        completed_by_user: { id: number; name: string } | null;
    }[];
    cost_lines: {
        id: number;
        kind: string;
        description: string;
        quantity: string;
        unit_cost: string;
        total_cost: string;
        vendor: { id: number; name: string } | null;
    }[];
    media: {
        id: number;
        kind: string;
        document_type: string | null;
        is_primary: boolean;
        media_asset: MediaAsset | null;
    }[];
};

type Props = {
    workOrder: WorkOrder;
    abilities: { update: boolean; updateProgress: boolean };
    meta: {
        statuses: string[];
        priorities: string[];
        technicians: { user_id: number; name: string | null; branch_id: number | null; is_available: boolean; skills: string[] }[];
    };
};

export default function WorkOrderShow({ workOrder, abilities, meta }: Props) {
    const { t } = useTranslation();
    const canManage = abilities.update;
    const canProgress = abilities.updateProgress;
    const canAssign = canManage;

    const technicianOptions = meta.technicians
        .filter((p) => p.name)
        .map((p) => ({ value: String(p.user_id), label: p.name as string }));

    const photos = useMemo(() => workOrder.media.filter((m) => m.kind === 'photo'), [workOrder.media]);
    const documents = useMemo(() => workOrder.media.filter((m) => m.kind === 'document'), [workOrder.media]);

    const assignForm = useForm({
        assigned_to: workOrder.assigned_to ? String(workOrder.assigned_to) : '',
    });

    const progressForm = useForm({
        status: workOrder.status,
        progress_percent: String(workOrder.progress_percent ?? 0),
        internal_notes: workOrder.internal_notes || '',
    });
    const [statusDialog, setStatusDialog] = useState<'completed' | 'cancelled' | null>(null);
    const [statusReason, setStatusReason] = useState('');

    function patch(data: Record<string, any>) {
        router.patch(WorkOrderController.update.url({ workOrder: workOrder.id }), data, { preserveScroll: true });
    }

    function submitStatusChange() {
        if (!statusDialog) {
            return;
        }

        patch({
            status: statusDialog,
            internal_notes: statusReason,
        });
        setStatusDialog(null);
        setStatusReason('');
    }

    return (
        <>
            <Head title={t('work_orders.show_title', { number: workOrder.work_order_number })} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <Heading
                            variant="small"
                            title={workOrder.asset?.name || t('work_orders.title')}
                            description={`${workOrder.asset?.code || ''} • ${workOrder.work_order_number}`}
                        />
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                            <Badge>{t(`work_orders.status.${workOrder.status}`)}</Badge>
                            <Badge variant="secondary">{t(`work_orders.types.${workOrder.type}`)}</Badge>
                            <Badge variant="outline">{t(`work_orders.priorities.${workOrder.priority}`)}</Badge>
                            {workOrder.escalation_level > 0 ? (
                                <Badge variant="destructive">{t('work_orders.labels.escalated', { level: workOrder.escalation_level })}</Badge>
                            ) : null}
                        </div>
                    </div>
                    <Button variant="outline" onClick={() => router.visit(workOrdersIndex().url)} className="w-full sm:w-auto">
                        {t('common.back')}
                    </Button>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>{t('work_orders.sections.overview')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="grid gap-3 md:grid-cols-2">
                                <Detail label={t('work_orders.fields.description')} value={workOrder.description} />
                                <Detail label={t('work_orders.fields.number')} value={workOrder.work_order_number} />
                                <Detail label={t('work_orders.fields.source')} value={t(`work_orders.sources.${workOrder.source}`)} />
                                <Detail label={t('common.branch')} value={workOrder.branch ? `${workOrder.branch.code} • ${workOrder.branch.name}` : '-'} />
                                <Detail label={t('work_orders.fields.assigned_to')} value={workOrder.technician?.name || '-'} />
                                <Detail label={t('work_orders.fields.response_due_at')} value={workOrder.response_due_at || '-'} />
                                <Detail label={t('work_orders.fields.resolution_due_at')} value={workOrder.resolution_due_at || '-'} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t('work_orders.sections.actions')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid gap-2">
                                <Button
                                    variant="outline"
                                    disabled={!canProgress}
                                    onClick={() => patch({ status: 'acknowledged' })}
                                    className="w-full"
                                >
                                    {t('work_orders.actions.acknowledge')}
                                </Button>
                                <Button
                                    variant="outline"
                                    disabled={!canProgress}
                                    onClick={() => patch({ status: 'in_progress' })}
                                    className="w-full"
                                >
                                    {t('work_orders.actions.start')}
                                </Button>
                                <Button
                                    disabled={!canProgress}
                                    onClick={() => setStatusDialog('completed')}
                                    className="w-full"
                                >
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    {t('work_orders.actions.complete')}
                                </Button>
                                <Button
                                    variant="destructive"
                                    disabled={!canProgress}
                                    onClick={() => setStatusDialog('cancelled')}
                                    className="w-full"
                                >
                                    {t('work_orders.actions.cancel')}
                                </Button>
                            </div>

                            {canAssign ? (
                                <div className="space-y-2 border-t pt-3">
                                    <div className="text-sm font-medium">{t('work_orders.actions.assign')}</div>
                                    <Select value={assignForm.data.assigned_to || 'none'} onValueChange={(v) => assignForm.setData('assigned_to', v === 'none' ? '' : v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('work_orders.fields.assigned_to')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">{t('common.none')}</SelectItem>
                                            {technicianOptions.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        disabled={!assignForm.data.assigned_to}
                                        onClick={() => patch({ assigned_to: Number(assignForm.data.assigned_to) })}
                                    >
                                        <UserCog className="mr-2 h-4 w-4" />
                                        {t('common.save')}
                                    </Button>
                                </div>
                            ) : null}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <TasksSection workOrderId={workOrder.id} tasks={workOrder.tasks} canUpdate={canProgress} />
                    <AttachmentsSection workOrderId={workOrder.id} photos={photos} documents={documents} canUpdate={canProgress} />
                </div>

                <CostSection workOrderId={workOrder.id} costLines={workOrder.cost_lines} canUpdate={canManage} totalCost={workOrder.cost} />

                <Card>
                    <CardHeader>
                        <CardTitle>{t('work_orders.sections.internal_notes')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Input
                            value={progressForm.data.internal_notes}
                            onChange={(e) => progressForm.setData('internal_notes', e.target.value)}
                            disabled={!canProgress}
                        />
                        <Button
                            variant="outline"
                            disabled={!canProgress}
                            onClick={() => patch({ internal_notes: progressForm.data.internal_notes })}
                        >
                            {t('common.save')}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={statusDialog !== null} onOpenChange={(open) => (!open ? setStatusDialog(null) : null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {statusDialog === 'completed' ? t('work_orders.dialogs.complete_title') : t('work_orders.dialogs.cancel_title')}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-2">
                        <Label htmlFor="status-reason">{t('work_orders.dialogs.reason_label')}</Label>
                        <Textarea
                            id="status-reason"
                            value={statusReason}
                            onChange={(e) => setStatusReason(e.target.value)}
                            placeholder={t('work_orders.dialogs.reason_placeholder')}
                        />
                        <InputError message={progressForm.errors.internal_notes} />
                    </div>
                    <DialogFooter className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <Button variant="outline" onClick={() => setStatusDialog(null)}>
                            {t('common.cancel')}
                        </Button>
                        <Button onClick={submitStatusChange} disabled={statusReason.trim() === ''}>
                            {t('common.confirm')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

function Detail({ label, value }: { label: string; value: string }) {
    return (
        <div className="min-w-0">
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="truncate">{value}</div>
        </div>
    );
}

function TasksSection({ workOrderId, tasks, canUpdate }: { workOrderId: number; tasks: WorkOrder['tasks']; canUpdate: boolean }) {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('work_orders.sections.checklist')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {tasks.length === 0 ? (
                    <div className="text-sm text-muted-foreground">{t('work_orders.empty.checklist')}</div>
                ) : (
                    tasks.map((task) => (
                        <label key={task.id} className="flex items-start gap-3 rounded-lg border p-3">
                            <input
                                type="checkbox"
                                className="mt-1"
                                checked={Boolean(task.completed_at)}
                                disabled={!canUpdate}
                                onChange={(e) =>
                                    router.patch(
                                        WorkOrderTaskController.update.url({ workOrder: workOrderId, task: task.id }),
                                        { completed: e.target.checked },
                                        { preserveScroll: true },
                                    )
                                }
                            />
                            <div className="min-w-0 flex-1">
                                <div className="truncate text-sm font-medium">{task.title}</div>
                                {task.completed_at ? (
                                    <div className="mt-1 text-xs text-muted-foreground">
                                            {t('work_orders.labels.completed_by', { name: task.completed_by_user?.name || '-' })}
                                    </div>
                                ) : null}
                            </div>
                        </label>
                    ))
                )}
            </CardContent>
        </Card>
    );
}

function CostSection({
    workOrderId,
    costLines,
    canUpdate,
    totalCost,
}: {
    workOrderId: number;
    costLines: WorkOrder['cost_lines'];
    canUpdate: boolean;
    totalCost: string | null;
}) {
    const { t } = useTranslation();
    const [kind, setKind] = useState<'parts' | 'labor'>('parts');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState('1');
    const [unitCost, setUnitCost] = useState('');

    function add() {
        router.post(
            WorkOrderCostLineController.store.url({ workOrder: workOrderId }),
            { kind, description, quantity, unit_cost: unitCost },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDescription('');
                    setQuantity('1');
                    setUnitCost('');
                },
            },
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('work_orders.sections.costs')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground">{t('work_orders.labels.total_cost', { cost: totalCost || '0' })}</div>

                {costLines.length === 0 ? (
                    <div className="text-sm text-muted-foreground">{t('work_orders.empty.costs')}</div>
                ) : (
                    <div className="space-y-2">
                        {costLines.map((c) => (
                            <div key={c.id} className="flex items-start justify-between gap-3 rounded-lg border p-3">
                                <div className="min-w-0">
                                    <div className="truncate text-sm font-medium">{c.description}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {t(`work_orders.cost_kind.${c.kind}`)} • {c.quantity} × {c.unit_cost}
                                    </div>
                                </div>
                                <div className="shrink-0 text-sm">{c.total_cost}</div>
                            </div>
                        ))}
                    </div>
                )}

                {canUpdate ? (
                    <div className="grid gap-3 border-t pt-3 md:grid-cols-4">
                        <div>
                            <Label>{t('work_orders.fields.kind')}</Label>
                            <Select value={kind} onValueChange={(v) => setKind(v as any)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="parts">{t('work_orders.cost_kind.parts')}</SelectItem>
                                    <SelectItem value="labor">{t('work_orders.cost_kind.labor')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="md:col-span-2">
                            <Label>{t('common.description')}</Label>
                            <Input value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        <div>
                            <Label>{t('work_orders.fields.total_cost')}</Label>
                            <div className="flex gap-2">
                                <Input value={quantity} onChange={(e) => setQuantity(e.target.value)} inputMode="decimal" />
                                <Input value={unitCost} onChange={(e) => setUnitCost(e.target.value)} inputMode="decimal" />
                            </div>
                        </div>
                        <Button onClick={add} disabled={!description} className="md:col-span-4 w-full sm:w-auto">
                            <Plus className="mr-2 h-4 w-4" />
                            {t('work_orders.actions.add_cost')}
                        </Button>
                    </div>
                ) : null}
            </CardContent>
        </Card>
    );
}

function AttachmentsSection({
    workOrderId,
    photos,
    documents,
    canUpdate,
}: {
    workOrderId: number;
    photos: WorkOrder['media'];
    documents: WorkOrder['media'];
    canUpdate: boolean;
}) {
    const { t } = useTranslation();
    const [file, setFile] = useState<File | null>(null);
    const [kind, setKind] = useState<'photo' | 'document'>('photo');
    const [documentType, setDocumentType] = useState('work_order');
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

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
                        WorkOrderAttachmentController.store.url({ workOrder: workOrderId }),
                        {
                            media_asset_id: completeJson.asset_id,
                            kind,
                            document_type: kind === 'document' ? documentType : null,
                        },
                        { preserveScroll: true, onFinish: () => resolve() },
                    );
                });

                setFile(null);
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
                <CardTitle>{t('work_orders.sections.attachments')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {canUpdate ? (
                    <div className="rounded-lg border p-4">
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="md:col-span-3">
                                <Label>{t('work_orders.fields.file')}</Label>
                                <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                            </div>
                            <div>
                                <Label>{t('work_orders.fields.kind')}</Label>
                                <Select value={kind} onValueChange={(v) => setKind(v as any)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="photo">{t('work_orders.attachments.photo')}</SelectItem>
                                        <SelectItem value="document">{t('work_orders.attachments.document')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {kind === 'document' ? (
                                <div className="md:col-span-2">
                                    <Label>{t('work_orders.fields.document_type')}</Label>
                                    <Input value={documentType} onChange={(e) => setDocumentType(e.target.value)} />
                                </div>
                            ) : null}
                        </div>
                        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                            <Button onClick={uploadAndAttach} disabled={!file || uploading}>
                                <Paperclip className="mr-2 h-4 w-4" />
                                {t('work_orders.actions.upload')}
                            </Button>
                            {progress !== null ? (
                                <span className="text-sm text-muted-foreground">{t('common.progress', { value: progress })}</span>
                            ) : null}
                            {error ? <span className="text-sm text-destructive">{error}</span> : null}
                        </div>
                    </div>
                ) : null}

                <div className="space-y-3">
                    <div className="text-sm font-medium">{t('work_orders.attachments.photo')}</div>
                    {photos.length === 0 ? (
                        <div className="text-sm text-muted-foreground">{t('work_orders.empty.photos')}</div>
                    ) : (
                        <div className="grid gap-2 md:grid-cols-2">
                            {photos.map((m) => (
                                <div key={m.id} className="rounded-lg border p-3">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="truncate text-sm font-medium">{m.media_asset?.title || `#${m.media_asset?.id}`}</div>
                                        {m.media_asset?.url ? (
                                            <a href={m.media_asset.url} target="_blank" rel="noreferrer">
                                                <Button variant="outline" size="sm">
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </a>
                                        ) : null}
                                    </div>
                                    {m.media_asset?.thumb_url ? (
                                        <img src={m.media_asset.thumb_url} alt={m.media_asset.title || ''} className="mt-3 h-40 w-full rounded-md object-cover" />
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <div className="text-sm font-medium">{t('work_orders.attachments.document')}</div>
                    {documents.length === 0 ? (
                        <div className="text-sm text-muted-foreground">{t('work_orders.empty.documents')}</div>
                    ) : (
                        <div className="space-y-2">
                            {documents.map((m) => (
                                <div key={m.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                                    <div className="min-w-0">
                                        <div className="truncate text-sm">{m.media_asset?.title || `#${m.media_asset?.id}`}</div>
                                        {m.document_type ? (
                                            <div className="text-xs text-muted-foreground">{m.document_type}</div>
                                        ) : null}
                                    </div>
                                    {m.media_asset?.url ? (
                                        <a href={m.media_asset.url} target="_blank" rel="noreferrer">
                                            <Button variant="outline" size="sm">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </a>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
