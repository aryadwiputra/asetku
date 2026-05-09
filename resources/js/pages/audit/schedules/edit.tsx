import { Form, Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/use-translation';
import { index as schedulesIndex, update as schedulesUpdate } from '@/actions/App/Http/Controllers/AuditScheduleController';

type AuditSchedule = {
    id: number;
    name: string;
    description: string | null;
    start_date: string;
    end_date: string;
    status: string;
    notes: string | null;
    selected_auditor_ids: number[];
    selected_asset_ids: number[];
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
    schedule: AuditSchedule;
    meta: {
        users: UserRow[];
        branches: BranchRow[];
        statusOptions: { value: string; label: string }[];
    };
};

export default function AuditSchedulesEdit({ schedule, meta }: Props) {
    const { t } = useTranslation();
    const { moduleAbilities } = usePage().props as {
        moduleAbilities: { audit: { update: boolean } };
    };

    const [name, setName] = useState(schedule.name);
    const [description, setDescription] = useState(schedule.description ?? '');
    const [startDate, setStartDate] = useState(schedule.start_date);
    const [endDate, setEndDate] = useState(schedule.end_date);
    const [status, setStatus] = useState(schedule.status);
    const [selectedAuditorIds, setSelectedAuditorIds] = useState<number[]>(schedule.selected_auditor_ids ?? []);
    const [selectedAssetIds, setSelectedAssetIds] = useState<number[]>(schedule.selected_asset_ids ?? []);
    const [notes, setNotes] = useState(schedule.notes ?? '');
    const [branchFilter, setBranchFilter] = useState<string>('');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const isDraft = schedule.status === 'draft';


    function toggleAsset(id: number) {
        setSelectedAssetIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
        );
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        router.patch(
            schedulesUpdate(schedule.id).url,
            {
                name,
                description,
                start_date: startDate,
                end_date: endDate,
                status,
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
            <Head title={t('common.edit')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        variant="small"
                        title={t('common.edit')}
                        description={schedule.name}
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
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">{t('audit.fields.description')}</Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                />
                            </div>

                            {isDraft ? (
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
                            ) : null}

                            <div className="grid gap-2">
                                <Label htmlFor="status">{t('common.status')}</Label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {meta.statusOptions.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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

                    {isDraft ? (
                        <>
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
                                    <div className="flex gap-4">
                                        <Select value={branchFilter} onValueChange={setBranchFilter}>
                                            <SelectTrigger className="w-[200px]">
                                                <SelectValue placeholder={t('audit.placeholders.all_branches')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">{t('audit.placeholders.all_branches')}</SelectItem>
                                                {meta.branches.map((branch) => (
                                                    <SelectItem key={branch.id} value={String(branch.id)}>
                                                        {branch.code} — {branch.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <InputError message={errors.asset_ids} />
                                    <div className="flex items-center justify-between border-t pt-4">
                                        <span className="text-sm text-muted-foreground">
                                            {selectedAssetIds.length} {t('audit.fields.assets_selected')}
                                        </span>
                                        <Button
                                            type="submit"
                                            disabled={processing || !name}
                                        >
                                            {processing ? t('common.saving') : t('common.save')}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    ) : (
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>{t('common.status')}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center justify-between border-t pt-4">
                                <span className="text-sm text-muted-foreground">
                                    {selectedAssetIds.length} {t('audit.fields.assets_selected')}
                                </span>
                                <Button
                                    type="submit"
                                    disabled={processing || !name}
                                >
                                    {processing ? t('common.saving') : t('common.save')}
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </Form>
            </div>
        </>
    );
}
