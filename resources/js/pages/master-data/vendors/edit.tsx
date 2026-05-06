import { Form, Head, Link } from '@inertiajs/react';

import VendorController from '@/actions/App/Http/Controllers/MasterData/VendorController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/use-translation';
import { toForm } from '@/lib/to-form';
import { index as masterDataIndex } from '@/routes/master-data';
import { index as vendorsIndex } from '@/routes/master-data/vendors';

type Props = {
    item: {
        id: number;
        name: string;
        tax_number: string | null;
        email: string | null;
        phone: string | null;
        address: string | null;
        service_category: string | null;
        is_blacklisted: boolean;
        blacklist_reason: string | null;
        notes: string | null;
    };
};

export default function EditVendor({ item }: Props) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={`${t('vendors.edit.title')} ${item.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <Heading variant="small" title={t('vendors.edit.title')} description={item.name} />

                <Form {...toForm(VendorController.update({ vendor: item.id }))} className="max-w-3xl space-y-6">
                    {({ processing, errors }) => (
                        <>
                            <Card className="space-y-4 p-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">{t('vendors.fields.name')}</Label>
                                        <Input id="name" name="name" required defaultValue={item.name} />
                                        <InputError message={errors.name} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="tax_number">{t('vendors.fields.tax_number')}</Label>
                                        <Input id="tax_number" name="tax_number" defaultValue={item.tax_number ?? ''} />
                                        <InputError message={errors.tax_number} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">{t('vendors.fields.email')}</Label>
                                        <Input id="email" name="email" type="email" defaultValue={item.email ?? ''} />
                                        <InputError message={errors.email} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="phone">{t('vendors.fields.phone')}</Label>
                                        <Input id="phone" name="phone" defaultValue={item.phone ?? ''} />
                                        <InputError message={errors.phone} />
                                    </div>
                                    <div className="grid gap-2 md:col-span-2">
                                        <Label htmlFor="service_category">{t('vendors.fields.service_category')}</Label>
                                        <Input id="service_category" name="service_category" defaultValue={item.service_category ?? ''} />
                                        <InputError message={errors.service_category} />
                                    </div>
                                    <div className="grid gap-2 md:col-span-2">
                                        <Label htmlFor="address">{t('vendors.fields.address')}</Label>
                                        <Textarea id="address" name="address" defaultValue={item.address ?? ''} />
                                        <InputError message={errors.address} />
                                    </div>
                                    <div className="flex items-center gap-3 md:col-span-2">
                                        <Checkbox id="is_blacklisted" name="is_blacklisted" value="1" defaultChecked={item.is_blacklisted} />
                                        <Label htmlFor="is_blacklisted">{t('vendors.fields.is_blacklisted')}</Label>
                                    </div>
                                    <div className="grid gap-2 md:col-span-2">
                                        <Label htmlFor="blacklist_reason">{t('vendors.fields.blacklist_reason')}</Label>
                                        <Textarea id="blacklist_reason" name="blacklist_reason" defaultValue={item.blacklist_reason ?? ''} />
                                        <InputError message={errors.blacklist_reason} />
                                    </div>
                                    <div className="grid gap-2 md:col-span-2">
                                        <Label htmlFor="notes">{t('vendors.fields.notes')}</Label>
                                        <Textarea id="notes" name="notes" defaultValue={item.notes ?? ''} />
                                        <InputError message={errors.notes} />
                                    </div>
                                </div>
                            </Card>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>{t('common.save')}</Button>
                                <Link href={vendorsIndex()}>
                                    <Button type="button" variant="outline">{t('common.back')}</Button>
                                </Link>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

EditVendor.layout = {
    breadcrumbs: [
        { title: 'common.master_data', href: masterDataIndex() },
        { title: 'vendors.title', href: vendorsIndex() },
        { title: 'vendors.edit.title', href: vendorsIndex() },
    ],
};
