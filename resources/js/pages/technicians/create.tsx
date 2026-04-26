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
    meta: {
        users: { id: number; name: string; email: string | null }[];
        branches: { id: number; name: string; code: string }[];
    };
};

export default function TechnicianCreate({ meta }: Props) {
    const { t } = useTranslation();

    const form = useForm({
        user_id: '',
        branch_id: '',
        is_active: true,
        is_available: true,
        skills_text: '',
        skills: [] as string[],
    });

    function submit() {
        const skills = form.data.skills_text
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);

        form.setData('skills', skills);
        form.post(TechnicianController.store.url(), { preserveScroll: true });
    }

    return (
        <>
            <Head title={t('technicians.actions.new')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <Heading variant="small" title={t('technicians.actions.new')} description={t('technicians.create_description')} />
                    <Button variant="outline" onClick={() => router.visit(techniciansIndex().url)} className="w-full sm:w-auto">
                        {t('common.back')}
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                        <Label>{t('technicians.fields.user')}</Label>
                        <Select value={form.data.user_id || 'none'} onValueChange={(v) => form.setData('user_id', v === 'none' ? '' : v)}>
                            <SelectTrigger>
                                <SelectValue placeholder={t('technicians.fields.user')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">{t('common.select')}</SelectItem>
                                {meta.users.map((u) => (
                                    <SelectItem key={u.id} value={String(u.id)}>
                                        {u.name} {u.email ? `• ${u.email}` : ''}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={form.errors.user_id} />
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

                <Button onClick={submit} disabled={form.processing || !form.data.user_id} className="w-full sm:w-auto">
                    {t('common.save')}
                </Button>
            </div>
        </>
    );
}
