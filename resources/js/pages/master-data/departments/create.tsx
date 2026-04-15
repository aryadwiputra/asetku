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
    branches: Array<{ id: number; name: string; code: string }>;
};

export default function CreateDepartment({ branches }: Props) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('departments.create.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <Heading variant="small" title={t('departments.create.title')} description={t('departments.create.description')} />

                <Form {...toForm(DepartmentController.store())} className="max-w-2xl space-y-6">
                    {({ processing, errors }) => (
                        <>
                            <Card className="space-y-4 p-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="branch_id">{t('departments.fields.branch')}</Label>
                                    <Select name="branch_id">
                                        <SelectTrigger id="branch_id">
                                            <SelectValue placeholder={t('departments.fields.branch_placeholder')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {branches.map((branch) => (
                                                <SelectItem key={branch.id} value={String(branch.id)}>
                                                    {branch.name} ({branch.code})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.branch_id} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="name">{t('common.name')}</Label>
                                    <Input id="name" name="name" required />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="code">{t('departments.fields.code')}</Label>
                                    <Input id="code" name="code" required />
                                    <InputError message={errors.code} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="description">{t('departments.fields.description')}</Label>
                                    <Textarea id="description" name="description" />
                                    <InputError message={errors.description} />
                                </div>
                            </Card>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>{t('common.save')}</Button>
                                <Link href={departmentsIndex()}>
                                    <Button type="button" variant="outline">
                                        {t('common.cancel')}
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

CreateDepartment.layout = {
    breadcrumbs: [
        { title: 'common.master_data', href: masterDataIndex() },
        { title: 'departments.title', href: departmentsIndex() },
        { title: 'departments.actions.new', href: DepartmentController.create.url() },
    ],
};
