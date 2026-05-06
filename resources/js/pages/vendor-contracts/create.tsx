import { Head } from '@inertiajs/react';

import VendorContractController from '@/actions/App/Http/Controllers/VendorContractController';
import Heading from '@/components/heading';
import { useTranslation } from '@/hooks/use-translation';
import { toForm } from '@/lib/to-form';
import { VendorContractForm } from '@/pages/vendor-contracts/_form';
import { index as vendorContractsIndex } from '@/routes/vendor-contracts';

type Props = {
    vendors: Array<{ id: number; name: string; service_category: string | null; is_blacklisted: boolean }>;
    assets: Array<{ id: number; code: string; name: string }>;
};

export default function CreateVendorContract({ vendors, assets }: Props) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('vendor_contracts.create.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <Heading variant="small" title={t('vendor_contracts.create.title')} description={t('vendor_contracts.create.description')} />
                <VendorContractForm action={toForm(VendorContractController.store())} vendors={vendors} assets={assets} />
            </div>
        </>
    );
}

CreateVendorContract.layout = {
    breadcrumbs: [
        { title: 'vendor_contracts.title', href: vendorContractsIndex() },
        { title: 'vendor_contracts.actions.new', href: VendorContractController.create.url() },
    ],
};
