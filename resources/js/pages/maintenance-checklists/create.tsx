import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import MaintenanceChecklistController from '@/actions/App/Http/Controllers/MaintenanceChecklistController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/hooks/use-translation';
import { index as templatesIndex } from '@/routes/maintenance-checklists';

type Props = {
    meta: {
        categories: { id: number; name: string; code: string; parent_id: number | null }[];
    };
};

type Item = { id?: number; title: string; is_required: boolean; sort_order: number };

export default function MaintenanceChecklistCreate({ meta }: Props) {
    const { t } = useTranslation();
    const [items, setItems] = useState<Item[]>([{ title: '', is_required: true, sort_order: 0 }]);

    const form = useForm({
        name: '',
        asset_category_id: '',
        is_active: true,
        required_skill: '',
        items: items as any,
    });

    function syncItems(next: Item[]) {
        setItems(next);
        form.setData('items', next as any);
    }

    function addItem() {
        syncItems([...items, { title: '', is_required: true, sort_order: items.length }]);
    }

    function removeItem(index: number) {
        syncItems(items.filter((_, i) => i !== index));
    }

    function submit() {
        form.post(MaintenanceChecklistController.store.url(), { preserveScroll: true });
    }

    return (
        <>
            <Head title={t('maintenance_checklists.actions.new')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <Heading variant="small" title={t('maintenance_checklists.actions.new')} description={t('maintenance_checklists.create_description')} />
                    <Button variant="outline" onClick={() => router.visit(templatesIndex().url)} className="w-full sm:w-auto">
                        {t('common.back')}
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                        <Label htmlFor="name">{t('maintenance_checklists.fields.name')}</Label>
                        <Input id="name" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                        <InputError message={form.errors.name} />
                    </div>

                    <div>
                        <Label>{t('maintenance_checklists.fields.category')}</Label>
                        <Select value={form.data.asset_category_id || 'all'} onValueChange={(v) => form.setData('asset_category_id', v === 'all' ? '' : v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('common.all')}</SelectItem>
                                {meta.categories.map((c) => (
                                    <SelectItem key={c.id} value={String(c.id)}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={form.errors.asset_category_id} />
                    </div>

                    <div>
                        <Label htmlFor="required_skill">{t('maintenance_checklists.fields.required_skill')}</Label>
                        <Input id="required_skill" value={form.data.required_skill} onChange={(e) => form.setData('required_skill', e.target.value)} />
                        <InputError message={form.errors.required_skill} />
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">{t('maintenance_checklists.fields.items')}</div>
                        <Button variant="outline" size="sm" onClick={addItem}>
                            <Plus className="mr-2 h-4 w-4" />
                            {t('common.add')}
                        </Button>
                    </div>

                    <div className="space-y-2">
                        {items.map((item, idx) => (
                            <div key={idx} className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center">
                                <Input
                                    value={item.title}
                                    onChange={(e) => {
                                        const next = [...items];
                                        next[idx] = { ...next[idx], title: e.target.value };
                                        syncItems(next);
                                    }}
                                    placeholder={t('maintenance_checklists.fields.item_title')}
                                />
                                <Button variant="ghost" size="sm" onClick={() => removeItem(idx)} className="w-full sm:w-auto">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    {t('common.remove')}
                                </Button>
                            </div>
                        ))}
                        <InputError message={(form.errors as any)['items.0.title']} />
                    </div>
                </div>

                <Button onClick={submit} disabled={form.processing} className="w-full sm:w-auto">
                    {t('common.save')}
                </Button>
            </div>
        </>
    );
}
