import { Form, Head, Link } from '@inertiajs/react';

import DepartmentController from '@/actions/App/Http/Controllers/MasterData/DepartmentController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/use-translation';
import { toForm } from '@/lib/to-form';
import { index as masterDataIndex } from '@/routes/master-data';
import { index as departmentsIndex } from '@/routes/master-data/departments';

type Props = {
    item: {
        id: number;
        branch_id: number;
        name: string;
        code: string;
        description: string | null;
    };
    branches: Array<{ id: number; name: string; code: string; is_active: boolean }>;
};

export default function EditDepartment({ item, branches }: Props) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={`${t('departments.edit.title')} ${item.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <Heading variant="small" title={t('departments.edit.title')} description={item.name} />

                <Form {...toForm(DepartmentController.update({ department: item.id }))} className="max-w-2xl space-y-6">
                    {({ processing, errors }) => (
                        <>
                            <Card className="space-y-4 p-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="branch_id">{t('departments.fields.branch')}</Label>
                                    <Select name="branch_id" defaultValue={String(item.branch_id)}>
                                        <SelectTrigger id="branch_id">
                                            <SelectValue placeholder={t('departments.fields.branch_placeholder')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {branches.map((branch) => (
                                                <SelectItem key={branch.id} value={String(branch.id)} disabled={!branch.is_active}>
                                                    {branch.name} ({branch.code}){!branch.is_active ? ` • ${t('common.inactive')}` : ''}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.branch_id} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="name">{t('common.name')}</Label>
                                    <Input id="name" name="name" required defaultValue={item.name} />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="code">{t('departments.fields.code')}</Label>
                                    <Input id="code" name="code" required defaultValue={item.code} />
                                    <InputError message={errors.code} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="description">{t('departments.fields.description')}</Label>
                                    <Textarea id="description" name="description" defaultValue={item.description ?? ''} />
                                    <InputError message={errors.description} />
                                </div>
                            </Card>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>{t('common.save')}</Button>
                                <Link href={departmentsIndex()}>
                                    <Button type="button" variant="outline">
                                        {t('common.back')}
                                    </Button>
                                </Link>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

EditDepartment.layout = {
    breadcrumbs: [
        { title: 'common.master_data', href: masterDataIndex() },
        { title: 'departments.title', href: departmentsIndex() },
        { title: 'departments.edit.title', href: departmentsIndex() },
    ],
};
