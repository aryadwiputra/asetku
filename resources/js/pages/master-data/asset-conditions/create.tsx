import { Head, router, useForm } from '@inertiajs/react';

import AssetConditionController from '@/actions/App/Http/Controllers/MasterData/AssetConditionController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/use-translation';
import { index as assetConditionsIndex } from '@/routes/master-data/asset-conditions';
import { index as masterDataIndex } from '@/routes/master-data';

type FormData = {
    name: string;
    code: string;
    description: string;
};

export default function AssetConditionCreate() {
    const { t } = useTranslation();
    const form = useForm<FormData>({
        name: '',
        code: '',
        description: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.post(AssetConditionController.store.url(), {
            onSuccess: () => form.reset(),
        });
    }

    return (
        <>
            <Head title={t('asset_conditions.actions.new')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Heading variant="small" title={t('asset_conditions.actions.new')} description={t('asset_conditions.description')} />
                </div>

                <Card>
                    <CardContent className="p-4 sm:p-6">
                        <form className="space-y-4" onSubmit={submit}>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">{t('common.name')}</Label>
                                    <Input
                                        id="name"
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                    />
                                    {form.errors.name && <p className="text-sm text-destructive">{form.errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="code">{t('asset_conditions.fields.code')}</Label>
                                    <Input
                                        id="code"
                                        value={form.data.code}
                                        onChange={(e) => form.setData('code', e.target.value)}
                                    />
                                    {form.errors.code && <p className="text-sm text-destructive">{form.errors.code}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">{t('asset_conditions.fields.description')}</Label>
                                <Input
                                    id="description"
                                    value={form.data.description}
                                    onChange={(e) => form.setData('description', e.target.value)}
                                />
                                {form.errors.description && <p className="text-sm text-destructive">{form.errors.description}</p>}
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                <Button type="submit" disabled={form.processing}>
                                    {t('common.save')}
                                </Button>
                                <Button type="button" variant="ghost" onClick={() => router.visit(assetConditionsIndex.url())}>
                                    {t('common.cancel')}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

AssetConditionCreate.layout = {
    breadcrumbs: [
        { title: 'common.master_data', href: masterDataIndex.url() },
        { title: 'asset_conditions.title', href: assetConditionsIndex.url() },
        { title: 'asset_conditions.actions.new', href: assetConditionsIndex.url() },
    ],
};

