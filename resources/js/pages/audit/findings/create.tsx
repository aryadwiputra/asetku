import { Form, Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { SignaturePad } from '@/components/signature-pad';

import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/use-translation';
import { store as findingsStore } from '@/actions/App/Http/Controllers/AuditFindingController';

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

type AssetRow = {
    id: number;
    code: string;
    name: string;
    branch: { id: number; name: string } | null;
    location: { id: number; name: string } | null;
    condition: { id: number; name: string } | null;
};

type Props = {
    asset: AssetRow;
    meta: {
        locations: LocationRow[];
        conditions: ConditionRow[];
    };
};

export default function AuditFindingsCreate({ asset, meta }: Props) {
    const { t } = useTranslation();

    const [currentLocationId, setCurrentLocationId] = useState<string>(asset.location?.id ? String(asset.location.id) : '');
    const [expectedLocationId, setExpectedLocationId] = useState<string>('');
    const [currentConditionId, setCurrentConditionId] = useState<string>(asset.condition?.id ? String(asset.condition.id) : '');
    const [status, setStatus] = useState<string>('matched');
    const [notes, setNotes] = useState('');
    const [signatureData, setSignatureData] = useState<string>('');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        router.post(
            findingsStore().url,
            {
                asset_id: asset.id,
                current_location_id: currentLocationId || null,
                expected_location_id: expectedLocationId || null,
                current_condition_id: currentConditionId || null,
                status,
                notes,
                signature_data: signatureData || null,
            },
            {
                onFinish: () => setProcessing(false),
                onError: (err) => setErrors(err),
            },
        );
    }

    return (
        <>
            <Head title={t('audit.actions.record_finding')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        variant="small"
                        title={t('audit.actions.record_finding')}
                        description={`${asset.code} — ${asset.name}`}
                    />
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('assets.sections.details')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span className="text-muted-foreground">{t('assets.fields.code')}</span>
                                    <div className="font-medium">{asset.code}</div>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">{t('assets.fields.name')}</span>
                                    <div className="font-medium">{asset.name}</div>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">{t('assets.fields.branch')}</span>
                                    <div className="font-medium">{asset.branch?.name ?? '—'}</div>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">{t('assets.fields.location')}</span>
                                    <div className="font-medium">{asset.location?.name ?? '—'}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Form onSubmit={handleSubmit} className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('audit.fields.current_location')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label>{t('audit.fields.current_location')}</Label>
                                    <Select value={currentLocationId} onValueChange={setCurrentLocationId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('audit.placeholders.select_location')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {meta.locations.map((loc) => (
                                                <SelectItem key={loc.id} value={String(loc.id)}>
                                                    {loc.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-2">
                                    <Label>{t('audit.fields.expected_location')}</Label>
                                    <Select value={expectedLocationId} onValueChange={setExpectedLocationId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('audit.placeholders.select_location')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {meta.locations.map((loc) => (
                                                <SelectItem key={loc.id} value={String(loc.id)}>
                                                    {loc.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-2">
                                    <Label>{t('audit.fields.current_condition')}</Label>
                                    <Select value={currentConditionId} onValueChange={setCurrentConditionId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('audit.placeholders.select_condition')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {meta.conditions.map((cond) => (
                                                <SelectItem key={cond.id} value={String(cond.id)}>
                                                    {cond.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-2">
                                    <Label>{t('common.status')}</Label>
                                    <Select value={status} onValueChange={setStatus}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="matched">{t('audit.status_values.matched')}</SelectItem>
                                            <SelectItem value="mismatched">{t('audit.status_values.mismatched')}</SelectItem>
                                            <SelectItem value="not_found">{t('audit.status_values.not_found')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-2">
                                    <Label>{t('audit.fields.notes')}</Label>
                                    <Textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={3}
                                        placeholder={t('audit.placeholders.notes')}
                                    />
                                    <InputError message={errors.notes} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>{t('audit.fields.signature')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <SignaturePad
                                    onSave={setSignatureData}
                                    onClear={() => setSignatureData('')}
                                />
                                <InputError message={errors.signature_data} />

                                <div className="flex justify-end gap-3 border-t pt-4">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? t('common.saving') : t('common.save')}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </Form>
                </div>
            </div>
        </>
    );
}
