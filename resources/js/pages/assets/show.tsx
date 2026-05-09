import { Form, Head, Link, router, usePage } from '@inertiajs/react';
import {
    Archive,
    Copy,
    Download,
    FileText,
    History,
    MapPin,
    Paperclip,
    Pencil,
    Printer,
    QrCode,
    Receipt,
    Trash2,
    Truck,
    Upload,
    Wrench,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import AssetAttachmentController from '@/actions/App/Http/Controllers/AssetAttachmentController';
import AssetController from '@/actions/App/Http/Controllers/AssetController';
import AssetLifecycleEventController from '@/actions/App/Http/Controllers/AssetLifecycleEventController';
import AssetMovementController from '@/actions/App/Http/Controllers/AssetMovementController';
import AssetWarrantyClaimController from '@/actions/App/Http/Controllers/AssetWarrantyClaimController';
import VendorContractController from '@/actions/App/Http/Controllers/VendorContractController';
import BranchLocationPicker from '@/components/branch-location-picker';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { chunk, complete, destroy as destroyUpload, store as storeUpload } from '@/routes/media-uploads';
import { print as printLabels } from '@/routes/assets/labels';
import { show as qrShow } from '@/routes/qr';
import { index as assetsIndex } from '@/routes/assets';
import { useTranslation } from '@/hooks/use-translation';

type Attachment = {
    id: number;
    kind: 'photo' | 'document';
    stage: string | null;
    document_type: string | null;
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
    performed_at: string | null;
    description: string | null;
    changed_by: number | null;
    actor: { id: number; name: string } | null;
    payload: unknown;
    created_at: string;
};

type MovementRow = {
    id: number;
    type: string;
    status: string;
    notes: string | null;
    performed_at: string | null;
    from_branch: { id: number; name: string } | null;
    to_branch: { id: number; name: string } | null;
    from_location: { id: number; name: string } | null;
    to_location: { id: number; name: string } | null;
    from_department: { id: number; name: string } | null;
    to_department: { id: number; name: string } | null;
    from_user: { id: number; name: string } | null;
    to_user: { id: number; name: string } | null;
    created_at: string;
};

type MaintenanceRow = {
    id: number;
    type: string;
    source: string | null;
    priority: string | null;
    status: string;
    description: string | null;
    cost: string | null;
    vendor: { id: number; name: string } | null;
    technician: { id: number; name: string } | null;
    branch: { id: number; name: string } | null;
    performed_at: string | null;
    created_at: string;
};

type AuditRow = {
    id: number;
    status: string;
    notes: string | null;
    audited_at: string | null;
    location: { id: number; name: string } | null;
    created_at: string;
};

type DepreciationEntryRow = {
    id: number;
    period_start: string | null;
    period_end: string | null;
    method: string;
    cost: string;
    residual_value: string;
    book_value_start: string;
    depreciation_amount: string;
    accumulated_depreciation: string;
    book_value_end: string;
    units_in_period: string | null;
    units_total_estimate: string | null;
    units_unit: string | null;
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
    warranty: { id: number; name: string; duration_months: number } | null;
    vendor_contract: { id: number; vendor_name: string; contract_number: string | null; title: string | null; vendor: { id: number; name: string; is_blacklisted: boolean } | null } | null;
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
    movements: MovementRow[];
    maintenances: MaintenanceRow[];
    audits: AuditRow[];
    depreciationEntries: DepreciationEntryRow[];
    formMeta: {
        branches: Array<{ id: number; name: string; code: string }>;
        departments: Array<{ id: number; name: string; code: string; branch_id: number }>;
        locations: Array<{ id: number; name: string; code: string; branch_id: number; parent_id: number | null; type: string | null }>;
        assetUsers: Array<{ id: number; name: string }>;
    };
    computedBookValue: number;
    warrantyStatus: { status: string; warranty_end: string | null; days_remaining: number | null };
    warrantyClaims: Array<{
        id: number;
        claim_reference: string | null;
        status: string;
        result: string | null;
        notes: string | null;
        submitted_at: string | null;
        resolved_at: string | null;
        vendor: { id: number; name: string } | null;
        vendor_contract: { id: number; title: string | null; contract_number: string | null } | null;
    }>;
};

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

export default function AssetShow({
    asset,
    histories,
    attachments,
    movements,
    maintenances,
    audits,
    depreciationEntries,
    formMeta,
    computedBookValue,
    warrantyStatus,
    warrantyClaims,
}: Props) {
    const { moduleAbilities, organization, locale } = usePage().props as {
        moduleAbilities: {
            assets: { update: boolean; delete: boolean };
        };
        organization: { currency_code: string; timezone: string } | null;
        locale: string;
    };
    const { t } = useTranslation();

    const canUpdate = moduleAbilities.assets.update;
    const canDelete = moduleAbilities.assets.delete;

    const qrUrl = qrShow(asset.qr_token).url;
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [lifecycleOpen, setLifecycleOpen] = useState(false);
    const [movementOpen, setMovementOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    const [lifecycleStage, setLifecycleStage] = useState<string>('receiving');
    const [lifecyclePerformedAt, setLifecyclePerformedAt] = useState<string>('');
    const [lifecycleNotes, setLifecycleNotes] = useState<string>('');

    const [movementType, setMovementType] = useState<'transfer' | 'borrow' | 'return' | 'placement'>('transfer');
    const [toBranchId, setToBranchId] = useState<string>('');
    const [toDepartmentId, setToDepartmentId] = useState<string>('');
    const [toLocationId, setToLocationId] = useState<string>('');
    const [toAssetUserId, setToAssetUserId] = useState<string>('');
    const [movementPerformedAt, setMovementPerformedAt] = useState<string>('');
    const [movementNotes, setMovementNotes] = useState<string>('');

    const movementHasDestination = Boolean(toBranchId || toDepartmentId || toLocationId || toAssetUserId);
    const movementCanSubmit =
        movementType === 'borrow'
            ? Boolean(toAssetUserId)
            : movementType === 'transfer' || movementType === 'placement'
              ? movementHasDestination
              : true;

    const currencyCode = organization?.currency_code || 'IDR';
    const currencyFormatter = useMemo(
        () => new Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode, maximumFractionDigits: 0 }),
        [currencyCode, locale],
    );

    const dateTimeFormatter = useMemo(
        () =>
            new Intl.DateTimeFormat(locale, {
                dateStyle: 'medium',
                timeStyle: 'short',
                timeZone: organization?.timezone || undefined,
            }),
        [locale, organization?.timezone],
    );

    return (
        <>
            <Head title={t('assets.show.title', { code: asset.code })} />

            <div className="flex h-full flex-1 flex-col rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        <Heading variant="small" title={asset.name} description={t('assets.show.subtitle', { code: asset.code })} />
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                            {asset.status ? <Badge variant="secondary">{asset.status.name}</Badge> : null}
                            {asset.condition ? <Badge>{asset.condition.name}</Badge> : null}
                        </div>
                    </div>

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
                                onClick={() => setDeleteOpen(true)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {t('common.delete')}
                            </Button>
                        ) : null}
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6 flex-1 flex-col">
                    <TabsList className="grid w-full grid-cols-8">
                        <TabsTrigger value="overview" className="flex items-center gap-2 text-xs sm:text-sm">
                            <FileText className="h-4 w-4" />
                            <span className="hidden sm:inline">{t('assets.tabs.overview')}</span>
                        </TabsTrigger>
                        <TabsTrigger value="history" className="flex items-center gap-2 text-xs sm:text-sm">
                            <History className="h-4 w-4" />
                            <span className="hidden sm:inline">{t('assets.tabs.history')}</span>
                        </TabsTrigger>
                        <TabsTrigger value="movements" className="flex items-center gap-2 text-xs sm:text-sm">
                            <Truck className="h-4 w-4" />
                            <span className="hidden sm:inline">{t('assets.tabs.movements')}</span>
                        </TabsTrigger>
                        <TabsTrigger value="maintenance" className="flex items-center gap-2 text-xs sm:text-sm">
                            <Wrench className="h-4 w-4" />
                            <span className="hidden sm:inline">{t('assets.tabs.maintenance')}</span>
                        </TabsTrigger>
                        <TabsTrigger value="warranty" className="flex items-center gap-2 text-xs sm:text-sm">
                            <Receipt className="h-4 w-4" />
                            <span className="hidden sm:inline">{t('assets.tabs.warranty')}</span>
                        </TabsTrigger>
                        <TabsTrigger value="attachments" className="flex items-center gap-2 text-xs sm:text-sm">
                            <Paperclip className="h-4 w-4" />
                            <span className="hidden sm:inline">{t('assets.tabs.attachments')}</span>
                        </TabsTrigger>
                        <TabsTrigger value="depreciation" className="flex items-center gap-2 text-xs sm:text-sm">
                            <MapPin className="h-4 w-4" />
                            <span className="hidden sm:inline">{t('assets.tabs.depreciation')}</span>
                        </TabsTrigger>
                        <TabsTrigger value="audits" className="flex items-center gap-2 text-xs sm:text-sm">
                            <Archive className="h-4 w-4" />
                            <span className="hidden sm:inline">{t('assets.tabs.audits')}</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-6">
                        <OverviewTab
                            asset={asset}
                            formMeta={formMeta}
                            computedBookValue={computedBookValue}
                            currencyFormatter={currencyFormatter}
                            dateTimeFormatter={dateTimeFormatter}
                            qrUrl={qrUrl}
                            canUpdate={canUpdate}
                        />
                    </TabsContent>

                    <TabsContent value="history" className="mt-6">
                        <HistoryTab
                            histories={histories}
                            dateTimeFormatter={dateTimeFormatter}
                            canUpdate={canUpdate}
                            onRecordEvent={() => setLifecycleOpen(true)}
                            onRecordMovement={() => setMovementOpen(true)}
                        />
                    </TabsContent>

                    <TabsContent value="movements" className="mt-6">
                        <MovementsTab movements={movements} dateTimeFormatter={dateTimeFormatter} />
                    </TabsContent>

                    <TabsContent value="maintenance" className="mt-6">
                        <MaintenanceTab maintenances={maintenances} currencyFormatter={currencyFormatter} dateTimeFormatter={dateTimeFormatter} />
                    </TabsContent>

                    <TabsContent value="warranty" className="mt-6">
                        <WarrantyTab
                            asset={asset}
                            warrantyStatus={warrantyStatus}
                            warrantyClaims={warrantyClaims}
                            canUpdate={canUpdate}
                        />
                    </TabsContent>

                    <TabsContent value="attachments" className="mt-6">
                        <AttachmentsTab assetId={asset.id} attachments={attachments} canManage={canUpdate} />
                    </TabsContent>

                    <TabsContent value="depreciation" className="mt-6">
                        <DepreciationTab
                            asset={asset}
                            entries={depreciationEntries}
                            currencyFormatter={currencyFormatter}
                        />
                    </TabsContent>

                    <TabsContent value="audits" className="mt-6">
                        <AuditsTab audits={audits} dateTimeFormatter={dateTimeFormatter} />
                    </TabsContent>
                </Tabs>
            </div>

            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('common.confirm')}</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm text-muted-foreground">{t('assets.actions.delete_confirm', { code: asset.code })}</div>
                    <DialogFooter className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <Button variant="outline" onClick={() => setDeleteOpen(false)} className="w-full sm:w-auto">
                            {t('common.cancel')}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => router.delete(AssetController.destroy.url({ asset: asset.id }))}
                            className="w-full sm:w-auto"
                        >
                            {t('common.delete')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={lifecycleOpen} onOpenChange={setLifecycleOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('assets.lifecycle.actions.record_event')}</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label>{t('assets.lifecycle.fields.stage')}</Label>
                            <Select value={lifecycleStage} onValueChange={setLifecycleStage}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {allowedStages.map((stage) => (
                                        <SelectItem key={stage} value={stage}>
                                            {t(`assets.lifecycle.stages.${stage}`)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label>{t('assets.lifecycle.fields.performed_at')}</Label>
                            <Input type="datetime-local" value={lifecyclePerformedAt} onChange={(e) => setLifecyclePerformedAt(e.target.value)} />
                        </div>

                        <div className="grid gap-2">
                            <Label>{t('assets.lifecycle.fields.notes')}</Label>
                            <Input value={lifecycleNotes} onChange={(e) => setLifecycleNotes(e.target.value)} />
                        </div>
                    </div>

                    <DialogFooter className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <Button variant="outline" onClick={() => setLifecycleOpen(false)} className="w-full sm:w-auto">
                            {t('common.cancel')}
                        </Button>
                        <Button
                            onClick={() => {
                                router.post(
                                    AssetLifecycleEventController.store.url({ asset: asset.id }),
                                    {
                                        stage: lifecycleStage,
                                        performed_at: lifecyclePerformedAt || null,
                                        notes: lifecycleNotes || null,
                                    },
                                    {
                                        preserveScroll: true,
                                        onSuccess: () => {
                                            setLifecycleOpen(false);
                                            setLifecycleNotes('');
                                        },
                                    },
                                );
                            }}
                            className="w-full sm:w-auto"
                        >
                            {t('common.save')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={movementOpen} onOpenChange={setMovementOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('assets.lifecycle.actions.record_movement')}</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label>{t('assets.lifecycle.fields.movement_type')}</Label>
                            <Select value={movementType} onValueChange={(v) => setMovementType(v as typeof movementType)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {allowedMovementTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {t(`assets.lifecycle.movement_types.${type}`)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label>{t('assets.fields.branch')}</Label>
                                <Select value={toBranchId} onValueChange={setToBranchId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('assets.placeholders.branch')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {formMeta.branches.map((b) => (
                                            <SelectItem key={b.id} value={String(b.id)}>
                                                {b.code} — {b.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>{t('assets.fields.department')}</Label>
                                <Select value={toDepartmentId} onValueChange={setToDepartmentId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('assets.placeholders.department')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {formMeta.departments
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
                                <Select value={toLocationId} onValueChange={setToLocationId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('assets.placeholders.location')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {formMeta.locations
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
                                <Select value={toAssetUserId} onValueChange={setToAssetUserId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('assets.placeholders.asset_user')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {movementType === 'return' ? (
                                            <SelectItem value="">{t('common.none')}</SelectItem>
                                        ) : null}
                                        {formMeta.assetUsers.map((u) => (
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
                                <Input type="datetime-local" value={movementPerformedAt} onChange={(e) => setMovementPerformedAt(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label>{t('assets.lifecycle.fields.notes')}</Label>
                                <Input value={movementNotes} onChange={(e) => setMovementNotes(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <Button variant="outline" onClick={() => setMovementOpen(false)} className="w-full sm:w-auto">
                            {t('common.cancel')}
                        </Button>
                        <Button
                            disabled={!movementCanSubmit}
                            onClick={() => {
                                router.post(
                                    AssetMovementController.store.url({ asset: asset.id }),
                                    {
                                        type: movementType,
                                        to_branch_id: toBranchId || null,
                                        to_department_id: toDepartmentId || null,
                                        to_location_id: toLocationId || null,
                                        to_asset_user_id: toAssetUserId || null,
                                        performed_at: movementPerformedAt || null,
                                        notes: movementNotes || null,
                                    },
                                    {
                                        preserveScroll: true,
                                        onSuccess: () => {
                                            setMovementOpen(false);
                                            setMovementNotes('');
                                        },
                                    },
                                );
                            }}
                            className="w-full sm:w-auto"
                        >
                            {t('common.save')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
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

function OverviewTab({
    asset,
    computedBookValue,
    currencyFormatter,
    qrUrl,
}: {
    asset: Asset;
    formMeta: Props['formMeta'];
    computedBookValue: number;
    currencyFormatter: Intl.NumberFormat;
    dateTimeFormatter: Intl.DateTimeFormat;
    qrUrl: string;
    canUpdate: boolean;
}) {
    const { t } = useTranslation();

    return (
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
                        <Detail label={t('assets.fields.pic')} value={asset.person_in_charge?.name} />
                        <Detail label={t('assets.fields.asset_user')} value={asset.user?.name} />
                        <Detail label={t('assets.fields.purchase_date')} value={asset.purchase_date} />
                        <Detail label={t('assets.fields.cost')} value={asset.cost ? currencyFormatter.format(Number(asset.cost)) : null} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('assets.sections.financial')}</CardTitle>
                        <CardDescription>{t('assets.sections.financial_desc')}</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <Detail
                            label={t('assets.fields.book_value')}
                            value={currencyFormatter.format(Number.isFinite(computedBookValue) ? computedBookValue : 0)}
                        />
                        <Detail label={t('assets.fields.depreciation_method')} value={asset.depreciation_method} />
                        <Detail label={t('assets.fields.useful_life_months')} value={asset.useful_life_months} />
                        <Detail
                            label={t('assets.fields.residual_value')}
                            value={asset.residual_value ? currencyFormatter.format(Number(asset.residual_value)) : null}
                        />
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('assets.sections.vendor_contract')}</CardTitle>
                        <CardDescription>{t('assets.sections.vendor_contract_desc')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Detail label={t('assets.fields.vendor_contract')} value={asset.vendor_contract?.title ?? asset.vendor_contract?.contract_number ?? asset.vendor_contract?.vendor_name} />
                        <Detail label={t('vendor_contracts.fields.vendor')} value={asset.vendor_contract?.vendor?.name ?? asset.vendor_contract?.vendor_name} />
                        {asset.vendor_contract?.id ? (
                            <Link href={VendorContractController.show.url({ vendor_contract: asset.vendor_contract.id })}>
                                <Button variant="outline" className="w-full">{t('common.view')}</Button>
                            </Link>
                        ) : null}
                    </CardContent>
                </Card>

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

                <Card>
                    <CardHeader>
                        <CardTitle>{t('assets.sections.map')}</CardTitle>
                        <CardDescription>{t('assets.sections.map_desc')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {asset.latitude !== null && asset.longitude !== null ? (
                            <BranchLocationPicker latitude={asset.latitude} longitude={asset.longitude} onChange={() => {}} readOnly />
                        ) : (
                            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                                {t('assets.map.empty')}
                            </div>
                        )}
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
    );
}

function HistoryTab({
    histories,
    dateTimeFormatter,
    canUpdate,
    onRecordEvent,
    onRecordMovement,
}: {
    histories: HistoryRow[];
    dateTimeFormatter: Intl.DateTimeFormat;
    canUpdate: boolean;
    onRecordEvent: () => void;
    onRecordMovement: () => void;
}) {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('assets.sections.history')}</CardTitle>
                <CardDescription>{t('assets.sections.history_desc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {canUpdate ? (
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                        <Button variant="outline" className="w-full sm:w-auto" onClick={onRecordEvent}>
                            {t('assets.lifecycle.actions.record_event')}
                        </Button>
                        <Button variant="outline" className="w-full sm:w-auto" onClick={onRecordMovement}>
                            {t('assets.lifecycle.actions.record_movement')}
                        </Button>
                    </div>
                ) : null}
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
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground">
                                {dateTimeFormatter.format(new Date(h.performed_at ?? h.created_at))}
                                {h.actor?.name ? ` • ${h.actor.name}` : ''}
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}

function MovementsTab({ movements, dateTimeFormatter }: { movements: MovementRow[]; dateTimeFormatter: Intl.DateTimeFormat }) {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('assets.sections.movements')}</CardTitle>
                <CardDescription>{t('assets.sections.movements_desc')}</CardDescription>
            </CardHeader>
            <CardContent>
                {movements.length === 0 ? (
                    <div className="text-sm text-muted-foreground">{t('assets.movements.empty')}</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left">
                                    <th className="pb-2">{t('assets.movements.fields.type')}</th>
                                    <th className="pb-2">{t('assets.movements.fields.from')}</th>
                                    <th className="pb-2">{t('assets.movements.fields.to')}</th>
                                    <th className="pb-2">{t('assets.movements.fields.performed_at')}</th>
                                    <th className="pb-2">{t('assets.movements.fields.status')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {movements.map((m) => (
                                    <tr key={m.id} className="border-b last:border-0">
                                        <td className="py-2">
                                            <Badge variant="secondary">{t(`assets.lifecycle.movement_types.${m.type}`)}</Badge>
                                        </td>
                                        <td className="py-2">
                                            <div className="text-xs text-muted-foreground">
                                                {m.from_branch?.name ?? '—'}
                                                {m.from_location?.name ? ` / ${m.from_location.name}` : ''}
                                                {m.from_department?.name ? ` / ${m.from_department.name}` : ''}
                                                {m.from_user?.name ? ` / ${m.from_user.name}` : ''}
                                            </div>
                                        </td>
                                        <td className="py-2">
                                            <div className="text-xs text-muted-foreground">
                                                {m.to_branch?.name ?? '—'}
                                                {m.to_location?.name ? ` / ${m.to_location.name}` : ''}
                                                {m.to_department?.name ? ` / ${m.to_department.name}` : ''}
                                                {m.to_user?.name ? ` / ${m.to_user.name}` : ''}
                                            </div>
                                        </td>
                                        <td className="py-2">
                                            <div className="text-xs text-muted-foreground">
                                                {m.performed_at ? dateTimeFormatter.format(new Date(m.performed_at)) : '—'}
                                            </div>
                                        </td>
                                        <td className="py-2">
                                            <Badge variant="outline">{m.status}</Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function MaintenanceTab({
    maintenances,
    currencyFormatter,
    dateTimeFormatter,
}: {
    maintenances: MaintenanceRow[];
    currencyFormatter: Intl.NumberFormat;
    dateTimeFormatter: Intl.DateTimeFormat;
}) {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('assets.sections.maintenance')}</CardTitle>
                <CardDescription>{t('assets.sections.maintenance_desc')}</CardDescription>
            </CardHeader>
            <CardContent>
                {maintenances.length === 0 ? (
                    <div className="text-sm text-muted-foreground">{t('assets.maintenance.empty')}</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left">
                                    <th className="pb-2">{t('assets.maintenance.fields.type')}</th>
                                    <th className="pb-2">{t('assets.maintenance.fields.description')}</th>
                                    <th className="pb-2">{t('assets.maintenance.fields.vendor')}</th>
                                    <th className="pb-2">{t('assets.maintenance.fields.cost')}</th>
                                    <th className="pb-2">{t('assets.maintenance.fields.status')}</th>
                                    <th className="pb-2">{t('assets.maintenance.fields.performed_at')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {maintenances.map((m) => (
                                    <tr key={m.id} className="border-b last:border-0">
                                        <td className="py-2">
                                            <Badge variant="secondary">{m.type}</Badge>
                                        </td>
                                        <td className="py-2 max-w-[200px] truncate">{m.description ?? '—'}</td>
                                        <td className="py-2">{m.vendor?.name ?? m.technician?.name ?? '—'}</td>
                                        <td className="py-2">
                                            {m.cost ? currencyFormatter.format(Number(m.cost)) : '—'}
                                        </td>
                                        <td className="py-2">
                                            <Badge variant="outline">{m.status}</Badge>
                                        </td>
                                        <td className="py-2">
                                            <div className="text-xs text-muted-foreground">
                                                {m.performed_at ? dateTimeFormatter.format(new Date(m.performed_at)) : '—'}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function WarrantyTab({
    asset,
    warrantyStatus,
    warrantyClaims,
    canUpdate,
}: {
    asset: Asset;
    warrantyStatus: Props['warrantyStatus'];
    warrantyClaims: Props['warrantyClaims'];
    canUpdate: boolean;
}) {
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t('assets.sections.warranty')}</CardTitle>
                    <CardDescription>{t('assets.sections.warranty_desc')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        <Badge variant={warrantyStatus.status === 'expired' ? 'destructive' : 'secondary'}>
                            {t(`assets.warranty.${warrantyStatus.status}`)}
                        </Badge>
                        {warrantyStatus.days_remaining !== null ? (
                            <Badge variant="outline">{t('assets.warranty.days_remaining', { count: warrantyStatus.days_remaining })}</Badge>
                        ) : null}
                    </div>
                    <Detail label={t('assets.fields.warranty')} value={asset.warranty?.name} />
                    <Detail label={t('vendor_contracts.fields.end_date')} value={warrantyStatus.warranty_end} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t('assets.warranty.claims')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {canUpdate ? (
                        <Form action={AssetWarrantyClaimController.store.url({ asset: asset.id })} method="post" className="space-y-3">
                            {({ errors, processing }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="claim_reference">{t('assets.warranty.fields.claim_reference')}</Label>
                                        <Input id="claim_reference" name="claim_reference" />
                                        <InputError message={errors.claim_reference} />
                                    </div>
                                    <input type="hidden" name="status" value="submitted" />
                                    <Button disabled={processing}>{t('common.save')}</Button>
                                </>
                            )}
                        </Form>
                    ) : null}

                    <div className="space-y-3">
                        {warrantyClaims.length === 0 ? (
                            <div className="text-sm text-muted-foreground">{t('assets.warranty.no_claims')}</div>
                        ) : (
                            warrantyClaims.map((claim) => (
                                <div key={claim.id} className="rounded-lg border p-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="font-medium">{claim.claim_reference ?? `#${claim.id}`}</div>
                                        <Badge variant="outline">{claim.status}</Badge>
                                    </div>
                                    <div className="mt-2 text-xs text-muted-foreground">
                                        {claim.vendor?.name ?? claim.vendor_contract?.title ?? '—'}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function AttachmentsTab({ assetId, attachments, canManage }: { assetId: number; attachments: Attachment[]; canManage: boolean }) {
    const { t } = useTranslation();
    const [file, setFile] = useState<File | null>(null);
    const [kind, setKind] = useState<'photo' | 'document'>('photo');
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
                        AssetAttachmentController.store.url({ asset: assetId }),
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
        <div className="space-y-6">
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
                                                    <SelectValue />
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
                                ) : null}
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
        </div>
    );
}

function DepreciationTab({
    asset,
    entries,
    currencyFormatter,
}: {
    asset: Asset;
    entries: DepreciationEntryRow[];
    currencyFormatter: Intl.NumberFormat;
}) {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('assets.sections.depreciation')}</CardTitle>
                <CardDescription>{t('assets.sections.depreciation_desc')}</CardDescription>
            </CardHeader>
            <CardContent>
                {entries.length === 0 ? (
                    <div className="text-sm text-muted-foreground">{t('assets.depreciation.empty')}</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left">
                                    <th className="pb-2">{t('assets.depreciation.fields.period')}</th>
                                    <th className="pb-2 text-right">{t('assets.depreciation.fields.cost')}</th>
                                    <th className="pb-2 text-right">{t('assets.depreciation.fields.residual_value')}</th>
                                    <th className="pb-2 text-right">{t('assets.depreciation.fields.book_value_start')}</th>
                                    <th className="pb-2 text-right">{t('assets.depreciation.fields.depreciation')}</th>
                                    <th className="pb-2 text-right">{t('assets.depreciation.fields.accumulated')}</th>
                                    <th className="pb-2 text-right">{t('assets.depreciation.fields.book_value_end')}</th>
                                    {asset.depreciation_method === 'units_of_production' ? (
                                        <th className="pb-2 text-right">{t('assets.depreciation.fields.units')}</th>
                                    ) : null}
                                </tr>
                            </thead>
                            <tbody>
                                {entries.map((e) => (
                                    <tr key={e.id} className="border-b last:border-0">
                                        <td className="py-2">
                                            {e.period_start} — {e.period_end}
                                        </td>
                                        <td className="py-2 text-right">{currencyFormatter.format(Number(e.cost))}</td>
                                        <td className="py-2 text-right">{currencyFormatter.format(Number(e.residual_value))}</td>
                                        <td className="py-2 text-right">{currencyFormatter.format(Number(e.book_value_start))}</td>
                                        <td className="py-2 text-right">{currencyFormatter.format(Number(e.depreciation_amount))}</td>
                                        <td className="py-2 text-right">{currencyFormatter.format(Number(e.accumulated_depreciation))}</td>
                                        <td className="py-2 text-right">{currencyFormatter.format(Number(e.book_value_end))}</td>
                                        {asset.depreciation_method === 'units_of_production' ? (
                                            <td className="py-2 text-right">
                                                {e.units_in_period ? `${e.units_in_period} / ${e.units_total_estimate ?? '?'} ${e.units_unit ?? ''}` : '—'}
                                            </td>
                                        ) : null}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function AuditsTab({ audits, dateTimeFormatter }: { audits: AuditRow[]; dateTimeFormatter: Intl.DateTimeFormat }) {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('assets.sections.audits')}</CardTitle>
                <CardDescription>{t('assets.sections.audits_desc')}</CardDescription>
            </CardHeader>
            <CardContent>
                {audits.length === 0 ? (
                    <div className="text-sm text-muted-foreground">{t('assets.audits.empty')}</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left">
                                    <th className="pb-2">{t('assets.audits.fields.audited_at')}</th>
                                    <th className="pb-2">{t('assets.audits.fields.status')}</th>
                                    <th className="pb-2">{t('assets.audits.fields.location')}</th>
                                    <th className="pb-2">{t('assets.audits.fields.notes')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {audits.map((a) => (
                                    <tr key={a.id} className="border-b last:border-0">
                                        <td className="py-2">
                                            <div className="text-xs text-muted-foreground">
                                                {a.audited_at ? dateTimeFormatter.format(new Date(a.audited_at)) : '—'}
                                            </div>
                                        </td>
                                        <td className="py-2">
                                            <Badge variant="outline">{a.status}</Badge>
                                        </td>
                                        <td className="py-2">{a.location?.name ?? '—'}</td>
                                        <td className="py-2 max-w-[200px] truncate">{a.notes ?? '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
