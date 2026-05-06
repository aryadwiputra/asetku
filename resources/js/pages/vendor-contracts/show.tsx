import { Form, Head, Link, router } from '@inertiajs/react';
import { FileUp, Pencil, RefreshCcw } from 'lucide-react';

import VendorContractController from '@/actions/App/Http/Controllers/VendorContractController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/use-translation';
import { show as assetsShow } from '@/routes/assets';
import { index as vendorContractsIndex } from '@/routes/vendor-contracts';

type Props = {
    contract: {
        id: number;
        title: string | null;
        vendor_name: string;
        contract_number: string | null;
        type: string;
        status: string;
        baseline_cost: string | null;
        start_date: string | null;
        end_date: string | null;
        sla_response_hours: number | null;
        sla_resolution_hours: number | null;
        notes: string | null;
        terms: string | null;
        vendor: { name: string; email: string | null; phone: string | null; service_category: string | null; is_blacklisted: boolean } | null;
        assets: Array<{ id: number; code: string; name: string }>;
        maintenance_cost_total: string;
    };
    documents: Array<{ id: number; title: string | null; url: string; mime: string | null; size: number | null; created_at: string | null }>;
    renewals: Array<{ id: number; status: string; renewed_contract_id: number | null; field_differences: Record<string, { before: unknown; after: unknown }> | null; created_at: string | null }>;
};

export default function VendorContractShow({ contract, documents, renewals }: Props) {
    const { t } = useTranslation();
    const diffFieldLabels: Record<string, string> = {
        vendor_name: t('vendor_contracts.fields.vendor_name'),
        title: t('vendor_contracts.fields.title'),
        type: t('vendor_contracts.fields.type'),
        contract_number: t('vendor_contracts.fields.contract_number'),
        status: t('vendor_contracts.fields.status'),
        baseline_cost: t('vendor_contracts.fields.baseline_cost'),
        start_date: t('vendor_contracts.fields.start_date'),
        end_date: t('vendor_contracts.fields.end_date'),
        sla_response_hours: t('vendor_contracts.fields.sla_response_hours'),
        sla_resolution_hours: t('vendor_contracts.fields.sla_resolution_hours'),
        terms: t('vendor_contracts.fields.terms'),
        notes: t('vendor_contracts.fields.notes'),
    };

    return (
        <>
            <Head title={contract.title ?? contract.vendor_name} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Heading variant="small" title={contract.title ?? contract.vendor_name} description={contract.contract_number ?? contract.vendor_name} />
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => router.post(VendorContractController.renew.url({ vendorContract: contract.id }))}>
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            {t('vendor_contracts.actions.renew')}
                        </Button>
                        <Link href={VendorContractController.edit.url({ vendor_contract: contract.id })}>
                            <Button>
                                <Pencil className="mr-2 h-4 w-4" />
                                {t('common.edit')}
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="space-y-4 p-6 lg:col-span-2">
                        <div className="flex flex-wrap gap-2">
                            <Badge>{t(`vendor_contracts.types.${contract.type}`)}</Badge>
                            <Badge variant={contract.status === 'expired' ? 'destructive' : 'secondary'}>{t(`vendor_contracts.statuses.${contract.status}`)}</Badge>
                            {contract.vendor?.is_blacklisted ? <Badge variant="destructive">{t('vendors.fields.is_blacklisted')}</Badge> : null}
                        </div>
                        <Detail label={t('vendor_contracts.fields.vendor')} value={contract.vendor?.name ?? contract.vendor_name} />
                        <Detail label={t('vendor_contracts.fields.contract_number')} value={contract.contract_number} />
                        <Detail label={t('vendor_contracts.fields.start_date')} value={contract.start_date} />
                        <Detail label={t('vendor_contracts.fields.end_date')} value={contract.end_date} />
                        <Detail label={t('vendor_contracts.fields.baseline_cost')} value={contract.baseline_cost} />
                        <Detail label={t('vendor_contracts.fields.maintenance_cost_total')} value={contract.maintenance_cost_total} />
                        <Detail label={t('vendor_contracts.fields.terms')} value={contract.terms} />
                        <Detail label={t('vendor_contracts.fields.notes')} value={contract.notes} />
                    </Card>

                    <Card className="space-y-4 p-6">
                        <div className="font-medium">{t('vendor_contracts.fields.assets')}</div>
                        <div className="space-y-3 text-sm">
                            {contract.assets.length === 0 ? <div className="text-muted-foreground">{t('vendor_contracts.show.assets_empty')}</div> : contract.assets.map((asset) => (
                                <Link key={asset.id} href={assetsShow({ asset: asset.id })} className="block rounded-lg border p-3 hover:bg-muted/40">
                                    <div className="font-medium">{asset.name}</div>
                                    <div className="text-xs text-muted-foreground">{asset.code}</div>
                                </Link>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="space-y-4 p-6">
                        <div className="flex items-center gap-2 font-medium">
                            <FileUp className="h-4 w-4" />
                            {t('vendor_contracts.fields.documents')}
                        </div>

                        <Form action={VendorContractController.storeDocument.url({ vendorContract: contract.id })} method="post" className="space-y-3">
                            {({ errors, processing }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="title">{t('common.name')}</Label>
                                        <Input id="title" name="title" />
                                        <InputError message={errors.title} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="file">{t('vendor_contracts.fields.documents')}</Label>
                                        <Input id="file" name="file" type="file" />
                                        <InputError message={errors.file} />
                                    </div>
                                    <Button disabled={processing}>{t('vendor_contracts.actions.upload_document')}</Button>
                                </>
                            )}
                        </Form>

                        <div className="space-y-3">
                            {documents.length === 0 ? <div className="text-sm text-muted-foreground">{t('vendor_contracts.show.documents_empty')}</div> : documents.map((document) => (
                                <a key={document.id} href={document.url} target="_blank" rel="noreferrer" className="block rounded-lg border p-3 hover:bg-muted/40">
                                    <div className="font-medium">{document.title ?? t('vendor_contracts.documents.fallback_title')}</div>
                                    <div className="text-xs text-muted-foreground">{document.mime ?? t('vendor_contracts.documents.fallback_type')}</div>
                                </a>
                            ))}
                        </div>
                    </Card>

                    <Card className="space-y-4 p-6">
                        <div className="font-medium">{t('vendor_contracts.renewals.title')}</div>
                        <div className="space-y-3">
                            {renewals.length === 0 ? <div className="text-sm text-muted-foreground">{t('vendor_contracts.show.renewals_empty')}</div> : renewals.map((renewal) => (
                                <div key={renewal.id} className="rounded-lg border p-3">
                                    <div className="font-medium">{t(`vendor_contracts.renewals.statuses.${renewal.status}`)}</div>
                                    <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                                        {renewal.field_differences ? Object.entries(renewal.field_differences).map(([field, diff]) => (
                                            <div key={field}>
                                                {diffFieldLabels[field] ?? field}: {String(diff.before ?? t('common.none'))} {'->'} {String(diff.after ?? t('common.none'))}
                                            </div>
                                        )) : t('common.none')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
}

function Detail({ label, value }: { label: string; value: string | number | null | undefined }) {
    return (
        <div className="grid gap-1">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
            <div className="text-sm">{value ?? '-'}</div>
        </div>
    );
}

VendorContractShow.layout = {
    breadcrumbs: [
        { title: 'vendor_contracts.title', href: vendorContractsIndex.url() },
        { title: 'vendor_contracts.show.title', href: vendorContractsIndex.url() },
    ],
};
