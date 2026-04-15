import { Form, Head, Link } from '@inertiajs/react';

import PersonInChargeController from '@/actions/App/Http/Controllers/MasterData/PersonInChargeController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/use-translation';
import { index as masterDataIndex } from '@/routes/master-data';
import { index as personInChargesIndex } from '@/routes/master-data/person-in-charges';

export default function CreatePersonInCharge() {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('person_in_charges.create.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <Heading variant="small" title={t('person_in_charges.create.title')} description={t('person_in_charges.create.description')} />

                <Form {...PersonInChargeController.store.form()} className="max-w-2xl space-y-6">
                    {({ processing, errors }) => (
                        <>
                            <Card className="space-y-4 p-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">{t('common.name')}</Label>
                                    <Input id="name" name="name" required />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">{t('person_in_charges.fields.email')}</Label>
                                    <Input id="email" name="email" type="email" />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="phone">{t('person_in_charges.fields.phone')}</Label>
                                    <Input id="phone" name="phone" />
                                    <InputError message={errors.phone} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="notes">{t('person_in_charges.fields.notes')}</Label>
                                    <Textarea id="notes" name="notes" />
                                    <InputError message={errors.notes} />
                                </div>
                            </Card>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>{t('common.save')}</Button>
                                <Link href={personInChargesIndex()}>
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

CreatePersonInCharge.layout = {
    breadcrumbs: [
        { title: 'common.master_data', href: masterDataIndex() },
        { title: 'person_in_charges.title', href: personInChargesIndex() },
        { title: 'person_in_charges.actions.new', href: PersonInChargeController.create.url() },
    ],
};

