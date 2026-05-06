import { Head, usePage } from '@inertiajs/react';

import AssetController from '@/actions/App/Http/Controllers/AssetController';
import Heading from '@/components/heading';
import { useTranslation } from '@/hooks/use-translation';
import { index as assetsIndex } from '@/routes/assets';
import { AssetForm, type AssetFormMeta } from '@/pages/assets/_asset-form';

type Props = AssetFormMeta;

export default function CreateAsset(props: Props) {
    const { moduleAbilities } = usePage().props as {
        moduleAbilities: { assets: { update: boolean } };
    };
    const { t } = useTranslation();

    const canOverrideCode = moduleAbilities.assets.update;

    return (
        <>
            <Head title={t('assets.create.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <Heading variant="small" title={t('assets.create.title')} description={t('assets.create.description')} />

                <div className="max-w-4xl">
                    <AssetForm
                        meta={props}
                        submit={AssetController.store()}
                        canOverrideCode={canOverrideCode}
                        submitLabel={t('common.save')}
                        cancelHref={assetsIndex.url()}
                    />
                </div>
            </div>
        </>
    );
}

CreateAsset.layout = {
    breadcrumbs: [
        { title: 'assets.title', href: assetsIndex() },
        { title: 'assets.actions.new', href: AssetController.create.url() },
    ],
};
