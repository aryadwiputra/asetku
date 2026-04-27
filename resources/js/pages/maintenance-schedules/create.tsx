import { Head, router, useForm } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import MaintenanceScheduleController from '@/actions/App/Http/Controllers/MaintenanceScheduleController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/use-translation';
import { create as schedulesCreate, index as schedulesIndex } from '@/routes/maintenance-schedules';

type AssetResult = {
    id: number;
    code: string;
    name: string;
    updated_at: string;
    branch: { id: number; name: string; code: string } | null;
};

type Props = {
    search: string | null;
    results: AssetResult[];
    selectedAsset: AssetResult | null;
    meta: {
        priorities: string[];
        technicians: { id: number; name: string }[];
        checklistTemplates: { id: number; name: string; asset_category_id: number | null; required_skill: string | null }[];
    };
};

export default function MaintenanceSchedulesCreate({ search, results, selectedAsset, meta }: Props) {
    const { t } = useTranslation();
    const [q, setQ] = useState(search || '');

    const form = useForm({
        asset_id: selectedAsset ? String(selectedAsset.id) : '',
        name: '',
        interval_days: '30',
        next_due_at: '',
        default_priority: 'normal',
        checklist_template_id: '',
        default_sla_response_hours: '',
        default_sla_resolution_hours: '',
        required_skill: '',
        assigned_to: '',
        notes: '',
        is_active: true,
    });

    useEffect(() => {
        if (selectedAsset) {
            form.setData('asset_id', String(selectedAsset.id));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedAsset]);

    function doSearch() {
        router.get(schedulesCreate({ query: { search: q } }).url, {}, { preserveScroll: true });
    }

    function pickAsset(asset: AssetResult) {
        router.get(schedulesCreate({ query: { asset_id: asset.id, search: q } }).url, {}, { preserveScroll: true });
    }

    function submit() {
        form.post(MaintenanceScheduleController.store.url(), { preserveScroll: true });
    }

    return (
        <>
            <Head title={t('maintenance_schedules.actions.new')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <Heading variant="small" title={t('maintenance_schedules.actions.new')} description={t('maintenance_schedules.create_description')} />
                    <Button variant="outline" onClick={() => router.visit(schedulesIndex().url)} className="w-full sm:w-auto">
                        {t('common.back')}
                    </Button>
                </div>

                <div className="space-y-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <div className="flex-1">
                            <Label htmlFor="asset-search">{t('maintenance_schedules.fields.asset_search')}</Label>
                            <div className="mt-1 flex gap-2">
                                <Input id="asset-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('datatable.search')} />
                                <Button type="button" variant="outline" onClick={doSearch}>
                                    <Search className="mr-2 h-4 w-4" />
                                    {t('common.search')}
                                </Button>
                            </div>
                        </div>
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
                                        selectedAsset?.id === asset.id ? 'border-primary' : ''
                                    }`}
                                >
                                    <div className="min-w-0">
                                        <div className="truncate font-medium">{asset.name}</div>
                                        <div className="truncate text-xs text-muted-foreground">{asset.code}</div>
                                        {asset.branch ? <div className="mt-1 text-xs text-muted-foreground">{asset.branch.code}</div> : null}
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
                            <Label>{t('maintenance_schedules.fields.asset')}</Label>
                            <Input value={selectedAsset ? `${selectedAsset.code} • ${selectedAsset.name}` : ''} disabled />
                            <InputError message={form.errors.asset_id} />
                        </div>

                        <div className="md:col-span-2">
                            <Label htmlFor="name">{t('maintenance_schedules.fields.name')}</Label>
                            <Input id="name" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                            <InputError message={form.errors.name} />
                        </div>

                        <div>
                            <Label htmlFor="interval_days">{t('maintenance_schedules.fields.interval_days')}</Label>
                            <Input id="interval_days" inputMode="numeric" value={form.data.interval_days} onChange={(e) => form.setData('interval_days', e.target.value)} />
                            <InputError message={form.errors.interval_days} />
                        </div>

                        <div>
                            <Label htmlFor="next_due_at">{t('maintenance_schedules.fields.next_due_at')}</Label>
                            <Input id="next_due_at" type="date" value={form.data.next_due_at} onChange={(e) => form.setData('next_due_at', e.target.value)} />
                            <InputError message={form.errors.next_due_at} />
                        </div>

                        <div>
                            <Label>{t('work_orders.fields.priority')}</Label>
                            <Select value={form.data.default_priority} onValueChange={(v) => form.setData('default_priority', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {meta.priorities.map((p) => (
                                        <SelectItem key={p} value={p}>
                                            {t(`work_orders.priorities.${p}`)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.default_priority} />
                        </div>

                        <div>
                            <Label>{t('work_orders.fields.checklist_template')}</Label>
                            <Select value={form.data.checklist_template_id || 'none'} onValueChange={(v) => form.setData('checklist_template_id', v === 'none' ? '' : v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('common.optional')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">{t('common.none')}</SelectItem>
                                    {meta.checklistTemplates.map((tpl) => (
                                        <SelectItem key={tpl.id} value={String(tpl.id)}>
                                            {tpl.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.checklist_template_id} />
                        </div>

                        <div>
                            <Label htmlFor="default_sla_response_hours">{t('work_orders.fields.sla_response_hours')}</Label>
                            <Input id="default_sla_response_hours" inputMode="numeric" value={form.data.default_sla_response_hours} onChange={(e) => form.setData('default_sla_response_hours', e.target.value)} />
                            <InputError message={form.errors.default_sla_response_hours} />
                        </div>

                        <div>
                            <Label htmlFor="default_sla_resolution_hours">{t('work_orders.fields.sla_resolution_hours')}</Label>
                            <Input id="default_sla_resolution_hours" inputMode="numeric" value={form.data.default_sla_resolution_hours} onChange={(e) => form.setData('default_sla_resolution_hours', e.target.value)} />
                            <InputError message={form.errors.default_sla_resolution_hours} />
                        </div>

                        <div className="md:col-span-2">
                            <Label htmlFor="required_skill">{t('maintenance_schedules.fields.required_skill')}</Label>
                            <Input id="required_skill" value={form.data.required_skill} onChange={(e) => form.setData('required_skill', e.target.value)} />
                            <InputError message={form.errors.required_skill} />
                        </div>

                        <div className="md:col-span-2">
                            <Label>{t('maintenance_schedules.fields.assigned_to')}</Label>
                            <Select value={form.data.assigned_to || 'none'} onValueChange={(v) => form.setData('assigned_to', v === 'none' ? '' : v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('common.optional')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">{t('common.none')}</SelectItem>
                                    {meta.technicians.map((tech) => (
                                        <SelectItem key={tech.id} value={String(tech.id)}>
                                            {tech.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.assigned_to} />
                        </div>

                        <div className="md:col-span-2">
                            <Label htmlFor="notes">{t('maintenance_schedules.fields.notes')}</Label>
                            <Textarea id="notes" value={form.data.notes} onChange={(e) => form.setData('notes', e.target.value)} />
                            <InputError message={form.errors.notes} />
                        </div>
                    </div>

                    <Button onClick={submit} disabled={form.processing || !form.data.asset_id} className="w-full sm:w-auto">
                        {t('common.save')}
                    </Button>
                </div>
            </div>
        </>
    );
}
