import { Form, Head, Link } from '@inertiajs/react';

import UnitController from '@/actions/App/Http/Controllers/MasterData/UnitController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/use-translation';
import { toForm } from '@/lib/to-form';
import { index as masterDataIndex } from '@/routes/master-data';
import { index as unitsIndex } from '@/routes/master-data/units';

export default function CreateUnit() {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('units.create.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <Heading variant="small" title={t('units.create.title')} description={t('units.create.description')} />

                <Form {...toForm(UnitController.store())} className="max-w-2xl space-y-6">
                    {({ processing, errors }) => (
                        <>
                            <Card className="space-y-4 p-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">{t('common.name')}</Label>
                                    <Input id="name" name="name" required />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="symbol">{t('units.fields.symbol')}</Label>
                                    <Input id="symbol" name="symbol" required />
                                    <InputError message={errors.symbol} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="description">{t('units.fields.description')}</Label>
                                    <Textarea id="description" name="description" />
                                    <InputError message={errors.description} />
                                </div>
                            </Card>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>{t('common.save')}</Button>
                                <Link href={unitsIndex()}>
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

CreateUnit.layout = {
    breadcrumbs: [
        { title: 'common.master_data', href: masterDataIndex() },
        { title: 'units.title', href: unitsIndex() },
        { title: 'units.actions.new', href: UnitController.create.url() },
    ],
};
