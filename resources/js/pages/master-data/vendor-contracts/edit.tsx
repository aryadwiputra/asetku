import { Form, Head, Link } from '@inertiajs/react';

import VendorContractController from '@/actions/App/Http/Controllers/MasterData/VendorContractController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/use-translation';
import { index as masterDataIndex } from '@/routes/master-data';
import { index as vendorContractsIndex } from '@/routes/master-data/vendor-contracts';

type Props = {
    item: {
        id: number;
        vendor_name: string;
        contract_number: string | null;
        start_date: string | null;
        end_date: string | null;
        sla_response_hours: number | null;
        sla_resolution_hours: number | null;
        notes: string | null;
    };
};

export default function EditVendorContract({ item }: Props) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={`${t('vendor_contracts.edit.title')} ${item.vendor_name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <Heading variant="small" title={t('vendor_contracts.edit.title')} description={item.vendor_name} />

                <Form {...VendorContractController.update.form({ vendor_contract: item.id })} className="max-w-2xl space-y-6">
                    {({ processing, errors }) => (
                        <>
                            <Card className="space-y-4 p-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="vendor_name">{t('vendor_contracts.fields.vendor_name')}</Label>
                                    <Input id="vendor_name" name="vendor_name" required defaultValue={item.vendor_name} />
                                    <InputError message={errors.vendor_name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="contract_number">{t('vendor_contracts.fields.contract_number')}</Label>
                                    <Input id="contract_number" name="contract_number" defaultValue={item.contract_number ?? ''} />
                                    <InputError message={errors.contract_number} />
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="start_date">{t('vendor_contracts.fields.start_date')}</Label>
                                        <Input id="start_date" name="start_date" type="date" defaultValue={item.start_date ?? ''} />
                                        <InputError message={errors.start_date} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="end_date">{t('vendor_contracts.fields.end_date')}</Label>
                                        <Input id="end_date" name="end_date" type="date" defaultValue={item.end_date ?? ''} />
                                        <InputError message={errors.end_date} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="sla_response_hours">{t('vendor_contracts.fields.sla_response_hours')}</Label>
                                        <Input id="sla_response_hours" name="sla_response_hours" type="number" min={1} defaultValue={item.sla_response_hours ?? undefined} />
                                        <InputError message={errors.sla_response_hours} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="sla_resolution_hours">{t('vendor_contracts.fields.sla_resolution_hours')}</Label>
                                        <Input id="sla_resolution_hours" name="sla_resolution_hours" type="number" min={1} defaultValue={item.sla_resolution_hours ?? undefined} />
                                        <InputError message={errors.sla_resolution_hours} />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="notes">{t('vendor_contracts.fields.notes')}</Label>
                                    <Textarea id="notes" name="notes" defaultValue={item.notes ?? ''} />
                                    <InputError message={errors.notes} />
                                </div>
                            </Card>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>{t('common.save')}</Button>
                                <Link href={vendorContractsIndex()}>
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

EditVendorContract.layout = {
    breadcrumbs: [
        { title: 'common.master_data', href: masterDataIndex() },
        { title: 'vendor_contracts.title', href: vendorContractsIndex() },
        { title: 'vendor_contracts.edit.title', href: vendorContractsIndex() },
    ],
};

