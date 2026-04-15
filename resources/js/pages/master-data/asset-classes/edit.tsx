import { Form, Head, Link } from '@inertiajs/react';

import AssetClassController from '@/actions/App/Http/Controllers/MasterData/AssetClassController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/use-translation';
import { toForm } from '@/lib/to-form';
import { index as assetClassesIndex } from '@/routes/master-data/asset-classes';
import { index as masterDataIndex } from '@/routes/master-data';

type Props = {
    item: {
        id: number;
        name: string;
        code: string;
        description: string | null;
    };
};

export default function EditAssetClass({ item }: Props) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={`${t('asset_classes.edit.title')} ${item.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <Heading variant="small" title={t('asset_classes.edit.title')} description={item.name} />

                <Form {...toForm(AssetClassController.update({ asset_class: item.id }))} className="max-w-2xl space-y-6">
                    {({ processing, errors }) => (
                        <>
                            <Card className="space-y-4 p-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">{t('common.name')}</Label>
                                    <Input id="name" name="name" required defaultValue={item.name} />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="code">{t('asset_classes.fields.code')}</Label>
                                    <Input id="code" name="code" required defaultValue={item.code} />
                                    <InputError message={errors.code} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="description">{t('asset_classes.fields.description')}</Label>
                                    <Textarea id="description" name="description" defaultValue={item.description ?? ''} />
                                    <InputError message={errors.description} />
                                </div>
                            </Card>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>{t('common.save')}</Button>
                                <Link href={assetClassesIndex()}>
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

EditAssetClass.layout = {
    breadcrumbs: [
        { title: 'common.master_data', href: masterDataIndex() },
        { title: 'asset_classes.title', href: assetClassesIndex() },
        { title: 'asset_classes.edit.title', href: assetClassesIndex() },
    ],
};
