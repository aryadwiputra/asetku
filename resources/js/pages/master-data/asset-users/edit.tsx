import { Form, Head, Link } from '@inertiajs/react';

import AssetUserController from '@/actions/App/Http/Controllers/MasterData/AssetUserController';
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
import { index as assetUsersIndex } from '@/routes/master-data/asset-users';

type Props = {
    item: {
        id: number;
        name: string;
        email: string | null;
        phone: string | null;
        department_id: number | null;
        notes: string | null;
    };
    departments: Array<{ id: number; name: string; code: string }>;
};

export default function EditAssetUser({ item, departments }: Props) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={`${t('asset_users.edit.title')} ${item.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <Heading variant="small" title={t('asset_users.edit.title')} description={item.name} />

                <Form {...toForm(AssetUserController.update({ asset_user: item.id }))} className="max-w-2xl space-y-6">
                    {({ processing, errors }) => (
                        <>
                            <Card className="space-y-4 p-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">{t('common.name')}</Label>
                                    <Input id="name" name="name" required defaultValue={item.name} />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">{t('asset_users.fields.email')}</Label>
                                    <Input id="email" name="email" type="email" defaultValue={item.email ?? ''} />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="phone">{t('asset_users.fields.phone')}</Label>
                                    <Input id="phone" name="phone" defaultValue={item.phone ?? ''} />
                                    <InputError message={errors.phone} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="department_id">{t('asset_users.fields.department')}</Label>
                                    <Select name="department_id" defaultValue={item.department_id ? String(item.department_id) : ''}>
                                        <SelectTrigger id="department_id">
                                            <SelectValue placeholder={t('asset_users.fields.department_placeholder')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">{t('asset_users.fields.department_none')}</SelectItem>
                                            {departments.map((department) => (
                                                <SelectItem key={department.id} value={String(department.id)}>
                                                    {department.name} ({department.code})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.department_id} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="notes">{t('asset_users.fields.notes')}</Label>
                                    <Textarea id="notes" name="notes" defaultValue={item.notes ?? ''} />
                                    <InputError message={errors.notes} />
                                </div>
                            </Card>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>{t('common.save')}</Button>
                                <Link href={assetUsersIndex()}>
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

EditAssetUser.layout = {
    breadcrumbs: [
        { title: 'common.master_data', href: masterDataIndex() },
        { title: 'asset_users.title', href: assetUsersIndex() },
        { title: 'asset_users.edit.title', href: assetUsersIndex() },
    ],
};
