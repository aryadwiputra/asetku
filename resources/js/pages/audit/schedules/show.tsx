import { Form, Head, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Check, Pencil, Play, X } from 'lucide-react';

import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/use-translation';
import {
    complete as schedulesComplete,
    destroy as schedulesDestroy,
    edit as schedulesEdit,
    index as schedulesIndex,
    start as schedulesStart,
} from '@/actions/App/Http/Controllers/AuditScheduleController';

type AuditorRow = {
    id: number;
    name: string;
};

type AssetRow = {
    id: number;
    code: string;
    name: string;
    branch: { id: number; name: string } | null;
    pivot: {
        status: string;
    };
};

type FindingRow = {
    id: number;
    asset: { id: number; code: string; name: string } | null;
    auditor: { id: number; name: string } | null;
    status: string;
    approval_status: string;
    current_location: { id: number; name: string } | null;
    expected_location: { id: number; name: string } | null;
    current_condition: { id: number; name: string } | null;
    notes: string | null;
    audited_at: string | null;
    created_at: string;
};

type LocationRow = {
    id: number;
    name: string;
    code: string;
};

type ConditionRow = {
    id: number;
    name: string;
    code: string;
};

type Props = {
    schedule: {
        id: number;
        name: string;
        description: string | null;
        start_date: string;
        end_date: string;
        status: string;
        notes: string | null;
        created_by: { id: number; name: string } | null;
        created_at: string;
    };
    auditors: AuditorRow[];
    assets: AssetRow[];
    findings: FindingRow[];
    meta: {
        canApprove: boolean;
        locations: LocationRow[];
        conditions: ConditionRow[];
    };
};

export default function AuditSchedulesShow({ schedule, auditors, assets, findings, meta }: Props) {
    const { t } = useTranslation();
    const { moduleAbilities } = usePage().props as {
        moduleAbilities: { audit: { update: boolean; delete: boolean } };
    };

    const canUpdate = moduleAbilities.audit.update;
    const canDelete = moduleAbilities.audit.delete;

    const completedCount = assets.filter((a) => a.pivot?.status === 'completed').length;
    const progress = assets.length > 0 ? (completedCount / assets.length) * 100 : 0;

    function handleStart() {
        router.post(schedulesStart(schedule.id).url);
    }

    function handleComplete() {
        router.post(schedulesComplete(schedule.id).url);
    }

    function handleDelete() {
        if (confirm(t('audit.actions.delete_confirm'))) {
            router.delete(schedulesDestroy(schedule.id).url, {
                onSuccess: () => router.visit(schedulesIndex().url),
            });
        }
    }

    return (
        <>
            <Head title={`${t('audit.title')}: ${schedule.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" onClick={() => router.visit(schedulesIndex().url)}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                        </Button>
                        <Heading
                            variant="small"
                            title={schedule.name}
                            description={`${t('audit.fields.period')}: ${schedule.start_date} — ${schedule.end_date}`}
                        />
                        <Badge
                            variant={
                                schedule.status === 'completed'
                                    ? 'default'
                                    : schedule.status === 'in_progress'
                                      ? 'secondary'
                                      : 'outline'
                            }
                        >
                            {t(`audit.status.${schedule.status}`)}
                        </Badge>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {schedule.status === 'draft' && canUpdate && (
                            <>
                                <Button variant="outline" onClick={handleStart}>
                                    <Play className="mr-2 h-4 w-4" />
                                    {t('audit.actions.start_audit')}
                                </Button>
                                <Button variant="outline" onClick={() => router.visit(schedulesEdit(schedule.id).url)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    {t('common.edit')}
                                </Button>
                            </>
                        )}
                        {schedule.status === 'in_progress' && canUpdate && (
                            <>
                                <Button variant="outline" onClick={handleComplete}>
                                    <Check className="mr-2 h-4 w-4" />
                                    {t('audit.actions.complete_audit')}
                                </Button>
                            </>
                        )}
                        {canDelete && (
                            <Button variant="destructive" onClick={handleDelete}>
                                <X className="mr-2 h-4 w-4" />
                                {t('common.delete')}
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('audit.sections.asset_list')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span>
                                            {completedCount} / {assets.length} {t('audit.fields.completed_assets')}
                                        </span>
                                        <span>{Math.round(progress)}%</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-muted">
                                        <div
                                            className="h-2 rounded-full bg-primary transition-all"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {assets.map((asset) => (
                                        <div key={asset.id} className="flex items-center justify-between rounded-lg border p-3">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{asset.code}</span>
                                                    <span className="text-muted-foreground">— {asset.name}</span>
                                                </div>
                                                {asset.branch ? (
                                                    <div className="text-xs text-muted-foreground">{asset.branch.name}</div>
                                                ) : null}
                                            </div>
                                            <Badge variant={asset.pivot?.status === 'completed' ? 'default' : 'outline'}>
                                                {asset.pivot?.status === 'completed' ? t('common.completed') : t('common.pending')}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>{t('audit.sections.findings')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {findings.length === 0 ? (
                                    <p className="py-8 text-center text-sm text-muted-foreground">{t('audit.empty_findings')}</p>
                                ) : (
                                    <div className="space-y-3">
                                        {findings.map((finding) => (
                                            <div key={finding.id} className="rounded-lg border p-4">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium">{finding.asset?.code}</span>
                                                            <span className="text-muted-foreground">— {finding.asset?.name}</span>
                                                        </div>
                                                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                                            {finding.auditor && <span>{finding.auditor.name}</span>}
                                                            {finding.audited_at && <span>• {new Date(finding.audited_at).toLocaleDateString()}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1">
                                                        <Badge variant={finding.status === 'matched' ? 'default' : 'destructive'}>
                                                            {t(`audit.status_values.${finding.status}`)}
                                                        </Badge>
                                                        <Badge variant="outline" className="text-xs">
                                                            {t(`audit.approval_status.${finding.approval_status}`)}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                                                    {finding.current_location && (
                                                        <div>
                                                            <span className="text-muted-foreground">{t('audit.fields.current_location')}: </span>
                                                            <span>{finding.current_location.name}</span>
                                                        </div>
                                                    )}
                                                    {finding.expected_location && (
                                                        <div>
                                                            <span className="text-muted-foreground">{t('audit.fields.expected_location')}: </span>
                                                            <span>{finding.expected_location.name}</span>
                                                        </div>
                                                    )}
                                                    {finding.current_condition && (
                                                        <div>
                                                            <span className="text-muted-foreground">{t('audit.fields.current_condition')}: </span>
                                                            <span>{finding.current_condition.name}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {finding.notes && (
                                                    <div className="mt-3 text-sm">
                                                        <span className="text-muted-foreground">{t('audit.fields.notes')}: </span>
                                                        <span>{finding.notes}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('audit.sections.schedule_info')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {schedule.description && (
                                    <div>
                                        <div className="text-xs text-muted-foreground">{t('audit.fields.description')}</div>
                                        <div className="text-sm">{schedule.description}</div>
                                    </div>
                                )}
                                <div>
                                    <div className="text-xs text-muted-foreground">{t('audit.fields.period')}</div>
                                    <div className="text-sm">
                                        {schedule.start_date} — {schedule.end_date}
                                    </div>
                                </div>
                                {schedule.created_by && (
                                    <div>
                                        <div className="text-xs text-muted-foreground">{t('common.created_by')}</div>
                                        <div className="text-sm">{schedule.created_by.name}</div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>{t('audit.sections.auditors')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {auditors.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">{t('audit.empty_auditors')}</p>
                                ) : (
                                    <div className="space-y-2">
                                        {auditors.map((auditor) => (
                                            <div key={auditor.id} className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                                                    {auditor.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-sm">{auditor.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
