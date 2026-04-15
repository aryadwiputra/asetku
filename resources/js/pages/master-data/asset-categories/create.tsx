import { Form, Head, Link } from '@inertiajs/react';

import AssetCategoryController from '@/actions/App/Http/Controllers/MasterData/AssetCategoryController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/use-translation';
import { index as masterDataIndex } from '@/routes/master-data';
import { index as assetCategoriesIndex } from '@/routes/master-data/asset-categories';

type Props = {
    parents: Array<{ id: number; name: string; code: string }>;
};

export default function CreateAssetCategory({ parents }: Props) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('asset_categories.create.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <Heading variant="small" title={t('asset_categories.create.title')} description={t('asset_categories.create.description')} />

                <Form {...AssetCategoryController.store.form()} className="max-w-2xl space-y-6">
                    {({ processing, errors }) => (
                        <>
                            <Card className="space-y-4 p-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="parent_id">{t('asset_categories.fields.parent')}</Label>
                                    <Select name="parent_id" defaultValue="">
                                        <SelectTrigger id="parent_id">
                                            <SelectValue placeholder={t('asset_categories.fields.parent_placeholder')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">{t('asset_categories.fields.parent_none')}</SelectItem>
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
                                    <Input id="name" name="name" required />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="code">{t('asset_categories.fields.code')}</Label>
                                    <Input id="code" name="code" required />
                                    <InputError message={errors.code} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="description">{t('asset_categories.fields.description')}</Label>
                                    <Textarea id="description" name="description" />
                                    <InputError message={errors.description} />
                                </div>
                            </Card>

                            <Card className="space-y-4 p-6">
                                <div className="text-sm font-medium">{t('asset_categories.sections.depreciation')}</div>

                                <div className="grid gap-2">
                                    <Label htmlFor="depreciation_method">{t('asset_categories.fields.depreciation_method')}</Label>
                                    <Select name="depreciation_method" defaultValue="straight_line">
                                        <SelectTrigger id="depreciation_method">
                                            <SelectValue placeholder={t('asset_categories.fields.depreciation_method_placeholder')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="straight_line">{t('asset_categories.depreciation_methods.straight_line')}</SelectItem>
                                            <SelectItem value="diminishing">{t('asset_categories.depreciation_methods.diminishing')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.depreciation_method} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="useful_life_months">{t('asset_categories.fields.useful_life_months')}</Label>
                                    <Input id="useful_life_months" name="useful_life_months" type="number" min={1} />
                                    <InputError message={errors.useful_life_months} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="residual_value">{t('asset_categories.fields.residual_value')}</Label>
                                    <Input id="residual_value" name="residual_value" type="number" min={0} step="0.01" />
                                    <InputError message={errors.residual_value} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="capex_opex_default">{t('asset_categories.fields.capex_opex_default')}</Label>
                                    <Input id="capex_opex_default" name="capex_opex_default" />
                                    <InputError message={errors.capex_opex_default} />
                                </div>
                            </Card>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>{t('common.save')}</Button>
                                <Link href={assetCategoriesIndex()}>
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

CreateAssetCategory.layout = {
    breadcrumbs: [
        { title: 'common.master_data', href: masterDataIndex() },
        { title: 'asset_categories.title', href: assetCategoriesIndex() },
        { title: 'asset_categories.actions.new', href: AssetCategoryController.create.url() },
    ],
};

