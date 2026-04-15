import { Form, Head, Link } from '@inertiajs/react';

import WarrantyController from '@/actions/App/Http/Controllers/MasterData/WarrantyController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/use-translation';
import { index as masterDataIndex } from '@/routes/master-data';
import { index as warrantiesIndex } from '@/routes/master-data/warranties';

export default function CreateWarranty() {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('warranties.create.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <Heading variant="small" title={t('warranties.create.title')} description={t('warranties.create.description')} />

                <Form {...WarrantyController.store.form()} className="max-w-2xl space-y-6">
                    {({ processing, errors }) => (
                        <>
                            <Card className="space-y-4 p-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">{t('common.name')}</Label>
                                    <Input id="name" name="name" required />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="duration_months">{t('warranties.fields.duration_months')}</Label>
                                    <Input id="duration_months" name="duration_months" type="number" min={1} defaultValue={12} required />
                                    <InputError message={errors.duration_months} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="notes">{t('warranties.fields.notes')}</Label>
                                    <Textarea id="notes" name="notes" />
                                    <InputError message={errors.notes} />
                                </div>
                            </Card>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>{t('common.save')}</Button>
                                <Link href={warrantiesIndex()}>
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

CreateWarranty.layout = {
    breadcrumbs: [
        { title: 'common.master_data', href: masterDataIndex() },
        { title: 'warranties.title', href: warrantiesIndex() },
        { title: 'warranties.actions.new', href: WarrantyController.create.url() },
    ],
};

