import { Form, Head, Link } from '@inertiajs/react';

import AssetStatusController from '@/actions/App/Http/Controllers/MasterData/AssetStatusController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/use-translation';
import { toForm } from '@/lib/to-form';
import { index as assetStatusesIndex } from '@/routes/master-data/asset-statuses';
import { index as masterDataIndex } from '@/routes/master-data';

export default function CreateAssetStatus() {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('asset_statuses.create.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <Heading variant="small" title={t('asset_statuses.create.title')} description={t('asset_statuses.create.description')} />

                <Form {...toForm(AssetStatusController.store())} className="max-w-2xl space-y-6">
                    {({ processing, errors }) => (
                        <>
                            <Card className="space-y-4 p-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">{t('common.name')}</Label>
                                    <Input id="name" name="name" required />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="code">{t('asset_statuses.fields.code')}</Label>
                                    <Input id="code" name="code" required />
                                    <InputError message={errors.code} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="description">{t('asset_statuses.fields.description')}</Label>
                                    <Textarea id="description" name="description" />
                                    <InputError message={errors.description} />
                                </div>
                            </Card>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>{t('common.save')}</Button>
                                <Link href={assetStatusesIndex()}>
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

CreateAssetStatus.layout = {
    breadcrumbs: [
        { title: 'common.master_data', href: masterDataIndex() },
        { title: 'asset_statuses.title', href: assetStatusesIndex() },
        { title: 'asset_statuses.actions.new', href: AssetStatusController.create.url() },
    ],
};
