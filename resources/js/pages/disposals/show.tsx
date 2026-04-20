import { Head, router, usePage } from '@inertiajs/react';
import { Download, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useMemo, useState } from 'react';

import AssetDisposalApprovalController from '@/actions/App/Http/Controllers/AssetDisposalApprovalController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/use-translation';
import { ba as disposalBa, index as disposalsIndex } from '@/routes/disposals';

type Disposal = {
    id: number;
    status: string;
    type: string;
    disposed_at: string | null;
    executed_at: string | null;
    currency_code: string | null;
    proceeds_amount: string | null;
    fees_amount: string | null;
    fair_value_amount: string | null;
    net_proceeds_amount: string | null;
    book_value_at_disposal: string | null;
    gain_loss_amount: string | null;
    reason: string | null;
    notes: string | null;
    asset: {
        id: number;
        code: string;
        name: string;
        branch: { id: number; name: string; code: string } | null;
        department: { id: number; name: string; code: string } | null;
        location: { id: number; name: string; code: string } | null;
        status: { id: number; name: string; code: string } | null;
        condition: { id: number; name: string; code: string } | null;
    } | null;
    approval: {
        id: number;
        status: string;
        current_step: number;
        steps: Array<{
            id: number;
            step_number: number;
            status: string;
            decided_at: string | null;
            notes: string | null;
            decider: { id: number; name: string } | null;
        }>;
    } | null;
};

type Attachment = {
    id: number;
    document_type: string | null;
    media_asset: { id: number; title: string; url: string; mime: string | null; size: number | null } | null;
};

type Props = {
    disposal: Disposal;
    attachments: Attachment[];
    abilities?: { approve?: boolean; export?: boolean };
};

export default function DisposalsShow({ disposal, attachments, abilities }: Props) {
    const { t } = useTranslation();
    const { orgRole, permissions } = usePage().props as { orgRole: string | null; permissions: string[] };

    const canApprove =
        abilities?.approve === true ||
        permissions.includes('asset_disposal.approve') ||
        ['Owner', 'Admin'].includes(orgRole || '');
    const canExport =
        abilities?.export === true ||
        permissions.includes('asset_disposal.export') ||
        ['Owner', 'Admin', 'Manager'].includes(orgRole || '');

    const [notes, setNotes] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const currencyFormatter = useMemo(() => {
        try {
            return new Intl.NumberFormat(undefined, { style: 'currency', currency: disposal.currency_code || 'IDR' });
        } catch {
            return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'IDR' });
        }
    }, [disposal.currency_code]);

    async function decide(kind: 'approve' | 'reject') {
        setSubmitting(true);
        setError(null);

        await new Promise<void>((resolve) => {
            router.post(
                kind === 'approve'
                    ? AssetDisposalApprovalController.approve.url({ disposal: disposal.id })
                    : AssetDisposalApprovalController.reject.url({ disposal: disposal.id }),
                { notes },
                {
                    preserveScroll: true,
                    onError: (errors) => setError(errors.notes || t('common.validation_error')),
                    onFinish: () => resolve(),
                },
            );
        });

        setSubmitting(false);
    }

    const baHref = disposalBa(disposal.id).url;

    return (
        <>
            <Head title={t('disposals.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <Heading
                        variant="small"
                        title={disposal.asset?.name || t('disposals.title')}
                        description={disposal.asset?.code || ''}
                    />
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        {canExport ? (
                            <a href={baHref}>
                                <Button variant="outline" className="w-full sm:w-auto">
                                    <Download className="mr-2 h-4 w-4" />
                                    {t('disposals.actions.ba')}
                                </Button>
                            </a>
                        ) : null}
                        <Button variant="outline" onClick={() => router.visit(disposalsIndex())} className="w-full sm:w-auto">
                            {t('common.back')}
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{t(`disposals.types.${disposal.type}`)}</Badge>
                        <Badge>{t(`disposals.status.${disposal.status}`)}</Badge>
                        {disposal.disposed_at ? <Badge variant="secondary">{disposal.disposed_at}</Badge> : null}
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="rounded-lg border p-4">
                            <div className="text-xs text-muted-foreground">{t('disposals.fields.asset')}</div>
                            <div className="mt-1 font-medium">{disposal.asset?.name || '-'}</div>
                            <div className="text-xs text-muted-foreground">{disposal.asset?.code || '-'}</div>
                            <div className="mt-2 text-xs text-muted-foreground">
                                {disposal.asset?.branch ? `${t('common.branch')}: ${disposal.asset.branch.code}` : ''}
                            </div>
                        </div>

                        <div className="rounded-lg border p-4">
                            <div className="text-xs text-muted-foreground">{t('disposals.fields.summary')}</div>
                            <div className="mt-2 grid gap-1 text-sm">
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-muted-foreground">{t('disposals.fields.book_value')}</span>
                                    <span>{disposal.book_value_at_disposal ? currencyFormatter.format(Number(disposal.book_value_at_disposal)) : '-'}</span>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-muted-foreground">{t('disposals.fields.net_proceeds')}</span>
                                    <span>{disposal.net_proceeds_amount ? currencyFormatter.format(Number(disposal.net_proceeds_amount)) : '-'}</span>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-muted-foreground">{t('disposals.fields.gain_loss')}</span>
                                    <span>{disposal.gain_loss_amount ? currencyFormatter.format(Number(disposal.gain_loss_amount)) : '-'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border p-4">
                        <div className="text-sm font-medium">{t('disposals.fields.approval')}</div>
                        {disposal.approval ? (
                            <div className="mt-3 space-y-2">
                                <div className="text-xs text-muted-foreground">
                                    {t('disposals.fields.current_step')}: {disposal.approval.current_step}
                                </div>
                                <div className="space-y-2">
                                    {disposal.approval.steps.map((s) => (
                                        <div key={s.id} className="flex flex-col gap-1 rounded-md border px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="text-sm">
                                                {t('disposals.fields.step')} {s.step_number}
                                                <span className="ml-2 text-xs text-muted-foreground">
                                                    {t(`disposals.step_status.${s.status}`)}
                                                </span>
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {s.decider ? s.decider.name : ''}
                                                {s.decided_at ? ` • ${s.decided_at}` : ''}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {canApprove && disposal.approval.status === 'pending' ? (
                                    <div className="mt-4 grid gap-2 sm:grid-cols-3">
                                        <div className="sm:col-span-2">
                                            <Input
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                placeholder={t('common.notes')}
                                            />
                                            <InputError message={error ?? undefined} />
                                        </div>
                                        <div className="grid gap-2 sm:grid-cols-2">
                                            <Button disabled={submitting} onClick={() => decide('approve')}>
                                                <ThumbsUp className="mr-2 h-4 w-4" />
                                                {t('common.approve')}
                                            </Button>
                                            <Button variant="destructive" disabled={submitting} onClick={() => decide('reject')}>
                                                <ThumbsDown className="mr-2 h-4 w-4" />
                                                {t('common.reject')}
                                            </Button>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        ) : (
                            <div className="mt-2 text-sm text-muted-foreground">{t('disposals.errors.no_approval')}</div>
                        )}
                    </div>

                    <div className="rounded-lg border p-4">
                        <div className="text-sm font-medium">{t('disposals.fields.documents')}</div>
                        {attachments.length === 0 ? (
                            <div className="mt-2 text-sm text-muted-foreground">{t('disposals.empty.documents')}</div>
                        ) : (
                            <div className="mt-3 space-y-2">
                                {attachments.map((a) => (
                                    <div key={a.id} className="flex items-center justify-between gap-3 rounded-md border px-3 py-2">
                                        <div className="min-w-0">
                                            <div className="truncate text-sm font-medium">{a.media_asset?.title || '-'}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {a.document_type ? t(`assets.lifecycle.document_types.${a.document_type}`) : ''}
                                            </div>
                                        </div>
                                        {a.media_asset?.url ? (
                                            <a href={a.media_asset.url} className="text-sm underline" target="_blank" rel="noreferrer">
                                                {t('common.view')}
                                            </a>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

DisposalsShow.layout = {
    breadcrumbs: [
        { title: 'disposals.title', href: disposalsIndex.url() },
        { title: 'common.view', href: '#' },
    ],
};

