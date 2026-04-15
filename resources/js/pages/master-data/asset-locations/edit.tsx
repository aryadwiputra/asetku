import { Form, Head, Link } from '@inertiajs/react';

import AssetLocationController from '@/actions/App/Http/Controllers/MasterData/AssetLocationController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/use-translation';
import { toForm } from '@/lib/to-form';
import { index as masterDataIndex } from '@/routes/master-data';
import { index as assetLocationsIndex } from '@/routes/master-data/asset-locations';

type Props = {
    item: {
        id: number;
        parent_id: number | null;
        name: string;
        code: string;
        description: string | null;
    };
    parents: Array<{ id: number; name: string; code: string }>;
};

export default function EditAssetLocation({ item, parents }: Props) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={`${t('asset_locations.edit.title')} ${item.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <Heading variant="small" title={t('asset_locations.edit.title')} description={item.name} />

                <Form {...toForm(AssetLocationController.update({ asset_location: item.id }))} className="max-w-2xl space-y-6">
                    {({ processing, errors }) => (
                        <>
                            <Card className="space-y-4 p-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="parent_id">{t('asset_locations.fields.parent')}</Label>
                                    <Select name="parent_id" defaultValue={item.parent_id ? String(item.parent_id) : ''}>
                                        <SelectTrigger id="parent_id">
                                            <SelectValue placeholder={t('asset_locations.fields.parent_placeholder')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">{t('asset_locations.fields.parent_none')}</SelectItem>
                                            {parents.map((parent) => (
                                                <SelectItem key={parent.id} value={String(parent.id)}>
                                                    {parent.name} ({parent.code})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.parent_id} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="name">{t('common.name')}</Label>
                                    <Input id="name" name="name" required defaultValue={item.name} />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="code">{t('asset_locations.fields.code')}</Label>
                                    <Input id="code" name="code" required defaultValue={item.code} />
                                    <InputError message={errors.code} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="description">{t('asset_locations.fields.description')}</Label>
                                    <Textarea id="description" name="description" defaultValue={item.description ?? ''} />
                                    <InputError message={errors.description} />
                                </div>
                            </Card>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>{t('common.save')}</Button>
                                <Link href={assetLocationsIndex()}>
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

EditAssetLocation.layout = {
    breadcrumbs: [
        { title: 'common.master_data', href: masterDataIndex() },
        { title: 'asset_locations.title', href: assetLocationsIndex() },
        { title: 'asset_locations.edit.title', href: assetLocationsIndex() },
    ],
};
