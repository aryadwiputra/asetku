import { Head, router, useForm } from '@inertiajs/react';

import TechnicianController from '@/actions/App/Http/Controllers/TechnicianController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/hooks/use-translation';
import { index as techniciansIndex } from '@/routes/technicians';

type Props = {
    technician: {
        id: number;
        user_id: number;
        branch_id: number | null;
        is_active: boolean;
        is_available: boolean;
        skills: string[] | null;
        user: { id: number; name: string; email: string | null } | null;
    };
    meta: {
        branches: { id: number; name: string; code: string }[];
    };
};

export default function TechnicianEdit({ technician, meta }: Props) {
    const { t } = useTranslation();

    const form = useForm({
        branch_id: technician.branch_id ? String(technician.branch_id) : '',
        is_active: technician.is_active,
        is_available: technician.is_available,
        skills_text: (technician.skills || []).join(', '),
        skills: (technician.skills || []) as string[],
    });

    function submit() {
        const skills = form.data.skills_text
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);

        form.setData('skills', skills);
        form.patch(TechnicianController.update.url({ technician: technician.id }), { preserveScroll: true });
    }

    return (
        <>
            <Head title={t('technicians.actions.edit')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <Heading variant="small" title={t('technicians.actions.edit')} description={technician.user?.name || ''} />
                    <Button variant="outline" onClick={() => router.visit(techniciansIndex().url)} className="w-full sm:w-auto">
                        {t('common.back')}
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                        <Label>{t('technicians.fields.user')}</Label>
                        <Input value={`${technician.user?.name || ''}${technician.user?.email ? ` • ${technician.user.email}` : ''}`} disabled />
                    </div>

                    <div>
                        <Label>{t('common.branch')}</Label>
                        <Select value={form.data.branch_id || 'none'} onValueChange={(v) => form.setData('branch_id', v === 'none' ? '' : v)}>
                            <SelectTrigger>
                                <SelectValue placeholder={t('common.optional')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">{t('common.none')}</SelectItem>
                                {meta.branches.map((b) => (
                                    <SelectItem key={b.id} value={String(b.id)}>
                                        {b.code} • {b.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={form.errors.branch_id} />
                    </div>

                    <div>
                        <Label htmlFor="skills_text">{t('technicians.fields.skills')}</Label>
                        <Input
                            id="skills_text"
                            value={form.data.skills_text}
                            onChange={(e) => form.setData('skills_text', e.target.value)}
                            placeholder={t('technicians.placeholders.skills')}
                        />
                        <InputError message={form.errors.skills as any} />
                    </div>
                </div>

                <Button onClick={submit} disabled={form.processing} className="w-full sm:w-auto">
                    {t('common.save')}
                </Button>
            </div>
        </>
    );
}

