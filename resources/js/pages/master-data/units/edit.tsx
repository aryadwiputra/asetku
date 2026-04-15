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
import { index as masterDataIndex } from '@/routes/master-data';
import { index as unitsIndex } from '@/routes/master-data/units';

type Props = {
    item: {
        id: number;
        name: string;
        symbol: string;
        description: string | null;
    };
};

export default function EditUnit({ item }: Props) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={`${t('units.edit.title')} ${item.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <Heading variant="small" title={t('units.edit.title')} description={item.name} />

                <Form {...UnitController.update.form({ unit: item.id })} className="max-w-2xl space-y-6">
                    {({ processing, errors }) => (
                        <>
                            <Card className="space-y-4 p-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">{t('common.name')}</Label>
                                    <Input id="name" name="name" required defaultValue={item.name} />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="symbol">{t('units.fields.symbol')}</Label>
                                    <Input id="symbol" name="symbol" required defaultValue={item.symbol} />
                                    <InputError message={errors.symbol} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="description">{t('units.fields.description')}</Label>
                                    <Textarea id="description" name="description" defaultValue={item.description ?? ''} />
                                    <InputError message={errors.description} />
                                </div>
                            </Card>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>{t('common.save')}</Button>
                                <Link href={unitsIndex()}>
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

EditUnit.layout = {
    breadcrumbs: [
        { title: 'common.master_data', href: masterDataIndex() },
        { title: 'units.title', href: unitsIndex() },
        { title: 'units.edit.title', href: unitsIndex() },
    ],
};

