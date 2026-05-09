import { Form, Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { AssetMultiSelect } from '@/components/ui/asset-multi-select';
import { MultiSelect } from '@/components/ui/multi-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/use-translation';
import { index as schedulesIndex, store as schedulesStore } from '@/actions/App/Http/Controllers/AuditScheduleController';

type AssetRow = {
    id: number;
    code: string;
    name: string;
    branch: { id: number; name: string } | null;
};

type UserRow = {
    id: number;
    name: string;
};

type BranchRow = {
    id: number;
    name: string;
    code: string;
};

type Props = {
    search: string;
    results: AssetRow[];
    meta: {
        users: UserRow[];
        branches: BranchRow[];
    };
};

export default function AuditSchedulesCreate({ search, results, meta }: Props) {
    const { t } = useTranslation();
    const { moduleAbilities } = usePage().props as {
        moduleAbilities: { audit: { create: boolean } };
    };

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedAuditorIds, setSelectedAuditorIds] = useState<number[]>([]);
    const [selectedAssetIds, setSelectedAssetIds] = useState<number[]>([]);
    const [notes, setNotes] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});




    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        router.post(
            schedulesStore().url,
            {
                name,
                description,
                start_date: startDate,
                end_date: endDate,
                auditor_ids: selectedAuditorIds,
                asset_ids: selectedAssetIds,
                notes,
            },
            {
                onFinish: () => setProcessing(false),
                onError: (err) => setErrors(err),
            },
        );
    }

    return (
        <>
            <Head title={t('audit.actions.new_schedule')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        variant="small"
                        title={t('audit.actions.new_schedule')}
                        description={t('audit.sections.schedule_info')}
                    />
                    <Button variant="outline" onClick={() => router.visit(schedulesIndex().url)}>
                        {t('common.cancel')}
                    </Button>
                </div>

                <Form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('audit.sections.schedule_info')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">{t('audit.fields.name')} *</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={t('audit.placeholders.name')}
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">{t('audit.fields.description')}</Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder={t('audit.placeholders.description')}
                                    rows={3}
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="start_date">{t('audit.fields.start_date')} *</Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                    <InputError message={errors.start_date} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="end_date">{t('audit.fields.end_date')} *</Label>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                    <InputError message={errors.end_date} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="notes">{t('audit.fields.notes')}</Label>
                                <Textarea
                                    id="notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t('audit.sections.auditors')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <MultiSelect
                                options={meta.users.map((user) => ({ value: user.id, label: user.name }))}
                                selected={selectedAuditorIds}
                                onChange={(ids) => setSelectedAuditorIds(ids as number[])}
                                placeholder={t('audit.placeholders.select_auditors')}
                                searchPlaceholder="Search users..."
                                emptyMessage="No users found."
                                label={t('audit.fields.auditors')}
                                required
                                error={errors.auditor_ids}
                            />
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>{t('audit.sections.asset_list')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <AssetMultiSelect
                                assets={results}
                                branches={meta.branches}
                                selected={selectedAssetIds}
                                onChange={(ids) => setSelectedAssetIds(ids)}
                                placeholder={t('audit.placeholders.select_assets')}
                                searchPlaceholder={t('audit.placeholders.search_assets')}
                                branchAllLabel={t('audit.placeholders.all_branches')}
                                emptyMessage={t('audit.empty_assets')}
                                label={t('audit.fields.assets')}
                                required
                                error={errors.asset_ids}
                            />

                            <div className="flex items-center justify-end border-t pt-4">
                                <Button
                                    type="submit"
                                    disabled={processing || !name || !startDate || !endDate || selectedAuditorIds.length === 0 || selectedAssetIds.length === 0}
                                >
                                    {processing ? t('common.saving') : t('common.save')}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </Form>
            </div>
        </>
    );
}
