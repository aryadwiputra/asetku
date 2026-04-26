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
    item: {
        id: number;
        vendor_id: number | null;
        title: string | null;
        type: string | null;
        contract_number: string | null;
        status: string | null;
        baseline_cost: string | null;
        start_date: string | null;
        end_date: string | null;
        sla_response_hours: number | null;
        sla_resolution_hours: number | null;
        notes: string | null;
        terms: string | null;
        asset_ids: number[];
    };
};

export default function EditVendorContract({ vendors, assets, item }: Props) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={`${t('vendor_contracts.edit.title')} ${item.title ?? ''}`} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <Heading variant="small" title={t('vendor_contracts.edit.title')} description={item.title ?? item.contract_number ?? ''} />
                <VendorContractForm action={toForm(VendorContractController.update({ vendor_contract: item.id }))} item={item} vendors={vendors} assets={assets} />
            </div>
        </>
    );
}

EditVendorContract.layout = {
    breadcrumbs: [
        { title: 'vendor_contracts.title', href: vendorContractsIndex() },
        { title: 'vendor_contracts.edit.title', href: vendorContractsIndex() },
    ],
};
