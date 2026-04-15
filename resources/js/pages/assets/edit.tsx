import { Head, usePage } from '@inertiajs/react';

import AssetController from '@/actions/App/Http/Controllers/AssetController';
import Heading from '@/components/heading';
import { useTranslation } from '@/hooks/use-translation';
import { index as assetsIndex } from '@/routes/assets';
import { AssetForm, type AssetFormMeta, type AssetFormData } from '@/pages/assets/_asset-form';

type Asset = Partial<AssetFormData> & { id: number };

type Props = AssetFormMeta & {
    asset: Asset;
};

export default function EditAsset({ asset, ...meta }: Props) {
    const { permissions, orgRole } = usePage().props as { permissions: string[]; orgRole: string | null };
    const { t } = useTranslation();

    const canOverrideCode = permissions.includes('asset.update') || ['Owner', 'Admin', 'Manager'].includes(orgRole || '');

    const initial: Partial<AssetFormData> = {
        code: asset.code ?? '',
        name: asset.name ?? '',
        description: asset.description ?? '',
        brand: (asset as any).brand ?? '',
        model: (asset as any).model ?? '',
        series: (asset as any).series ?? '',
        serial_number: (asset as any).serial_number ?? '',
        imei: (asset as any).imei ?? '',
        branch_id: asset.branch_id ? String(asset.branch_id) : '',
        department_id: asset.department_id ? String(asset.department_id) : '',
        asset_location_id: asset.asset_location_id ? String(asset.asset_location_id) : '',
        asset_category_id: asset.asset_category_id ? String(asset.asset_category_id) : '',
        asset_class_id: asset.asset_class_id ? String(asset.asset_class_id) : '',
        unit_id: asset.unit_id ? String(asset.unit_id) : '',
        asset_status_id: asset.asset_status_id ? String(asset.asset_status_id) : '',
        asset_condition_id: asset.asset_condition_id ? String(asset.asset_condition_id) : '',
        person_in_charge_id: asset.person_in_charge_id ? String(asset.person_in_charge_id) : '',
        asset_user_id: asset.asset_user_id ? String(asset.asset_user_id) : '',
        warranty_id: (asset as any).warranty_id ? String((asset as any).warranty_id) : '',
        vendor_contract_id: (asset as any).vendor_contract_id ? String((asset as any).vendor_contract_id) : '',
        purchase_date: (asset as any).purchase_date ?? '',
        cost: (asset as any).cost ?? '',
        depreciation_method: (asset as any).depreciation_method ?? '',
        useful_life_months: (asset as any).useful_life_months ? String((asset as any).useful_life_months) : '',
        residual_value: (asset as any).residual_value ?? '',
        latitude: (asset as any).latitude ?? null,
        longitude: (asset as any).longitude ?? null,
        metadata: (asset as any).metadata ?? {},
    };

    const assetCode = asset.code ?? '';

    return (
        <>
            <Head title={t('assets.edit.title', { code: assetCode })} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <Heading variant="small" title={t('assets.edit.title', { code: assetCode })} description={t('assets.edit.description')} />

                <div className="max-w-4xl">
                    <AssetForm
                        meta={meta}
                        initial={initial}
                        submit={AssetController.update({ asset: asset.id })}
                        canOverrideCode={canOverrideCode}
                        submitLabel={t('common.save')}
                        cancelHref={assetsIndex.url()}
                    />
                </div>
            </div>
        </>
    );
}

EditAsset.layout = {
    breadcrumbs: [
        { title: 'assets.title', href: assetsIndex() },
        { title: 'assets.actions.edit', href: '#' },
    ],
};
