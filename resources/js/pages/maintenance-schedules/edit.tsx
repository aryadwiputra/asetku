import { Head, router, useForm } from '@inertiajs/react';

import MaintenanceScheduleController from '@/actions/App/Http/Controllers/MaintenanceScheduleController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/hooks/use-translation';
import { index as schedulesIndex } from '@/routes/maintenance-schedules';

type Schedule = {
    id: number;
    name: string;
    interval_days: number;
    next_due_at: string;
    is_active: boolean;
    default_priority: string | null;
    default_sla_response_hours: number | null;
    default_sla_resolution_hours: number | null;
    required_skill: string | null;
    checklist_template_id: number | null;
    asset: { id: number; code: string; name: string; branch: { id: number; name: string; code: string } | null } | null;
};

type Props = {
    schedule: Schedule;
    meta: {
        priorities: string[];
        checklistTemplates: { id: number; name: string; asset_category_id: number | null; required_skill: string | null }[];
    };
};

export default function MaintenanceSchedulesEdit({ schedule, meta }: Props) {
    const { t } = useTranslation();

    const form = useForm({
        name: schedule.name,
        interval_days: String(schedule.interval_days),
        next_due_at: schedule.next_due_at,
        default_priority: schedule.default_priority || 'normal',
        default_sla_response_hours: schedule.default_sla_response_hours ? String(schedule.default_sla_response_hours) : '',
        default_sla_resolution_hours: schedule.default_sla_resolution_hours ? String(schedule.default_sla_resolution_hours) : '',
        checklist_template_id: schedule.checklist_template_id ? String(schedule.checklist_template_id) : '',
        required_skill: schedule.required_skill || '',
        is_active: schedule.is_active,
    });

    function submit() {
        form.patch(MaintenanceScheduleController.update.url({ schedule: schedule.id }), { preserveScroll: true });
    }

    return (
        <>
            <Head title={t('maintenance_schedules.actions.edit')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <Heading variant="small" title={t('maintenance_schedules.actions.edit')} description={`${schedule.asset?.code || ''} • ${schedule.asset?.name || ''}`} />
                    <Button variant="outline" onClick={() => router.visit(schedulesIndex().url)} className="w-full sm:w-auto">
                        {t('common.back')}
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
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
                </div>

                <Button onClick={submit} disabled={form.processing} className="w-full sm:w-auto">
                    {t('common.save')}
                </Button>
            </div>
        </>
    );
}

