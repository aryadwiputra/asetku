import { Form, Link } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/use-translation';
import { toForm } from '@/lib/to-form';
import { index as vendorContractsIndex } from '@/routes/vendor-contracts';

type Vendor = { id: number; name: string; service_category: string | null; is_blacklisted: boolean };
type Asset = { id: number; code: string; name: string };

type Item = {
    id?: number;
    vendor_id?: number | null;
    title?: string | null;
    type?: string | null;
    contract_number?: string | null;
    status?: string | null;
    baseline_cost?: string | number | null;
    start_date?: string | null;
    end_date?: string | null;
    sla_response_hours?: number | null;
    sla_resolution_hours?: number | null;
    notes?: string | null;
    terms?: string | null;
    asset_ids?: number[];
};

export function VendorContractForm({
    action,
    item,
    vendors,
    assets,
}: {
    action: { action: string; method: string };
    item?: Item;
    vendors: Vendor[];
    assets: Asset[];
}) {
    const { t } = useTranslation();

    return (
        <Form action={action.action} method={action.method as 'post' | 'put' | 'patch'} className="space-y-6">
            {({ processing, errors }) => (
                <>
                    <Card className="space-y-4 p-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="vendor_id">{t('vendor_contracts.fields.vendor')}</Label>
                                <select id="vendor_id" name="vendor_id" defaultValue={item?.vendor_id ?? ''} className="rounded-md border bg-background px-3 py-2 text-sm">
                                    <option value="">{t('common.select')}</option>
                                    {vendors.map((vendor) => (
                                        <option key={vendor.id} value={vendor.id} disabled={vendor.is_blacklisted}>
                                            {vendor.name}{vendor.is_blacklisted ? ` ${t('vendors.badges.blacklisted_suffix')}` : ''}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.vendor_id} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="title">{t('vendor_contracts.fields.title')}</Label>
                                <Input id="title" name="title" defaultValue={item?.title ?? ''} />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="type">{t('vendor_contracts.fields.type')}</Label>
                                <select id="type" name="type" defaultValue={item?.type ?? 'maintenance'} className="rounded-md border bg-background px-3 py-2 text-sm">
                                    {['maintenance', 'subscription', 'lease'].map((type) => (
                                        <option key={type} value={type}>{t(`vendor_contracts.types.${type}`)}</option>
                                    ))}
                                </select>
                                <InputError message={errors.type} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="status">{t('vendor_contracts.fields.status')}</Label>
                                <select id="status" name="status" defaultValue={item?.status ?? 'draft'} className="rounded-md border bg-background px-3 py-2 text-sm">
                                    {['draft', 'active', 'expired'].map((status) => (
                                        <option key={status} value={status}>{t(`vendor_contracts.statuses.${status}`)}</option>
                                    ))}
                                </select>
                                <InputError message={errors.status} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="contract_number">{t('vendor_contracts.fields.contract_number')}</Label>
                                <Input id="contract_number" name="contract_number" defaultValue={item?.contract_number ?? ''} />
                                <InputError message={errors.contract_number} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="baseline_cost">{t('vendor_contracts.fields.baseline_cost')}</Label>
                                <Input id="baseline_cost" name="baseline_cost" type="number" min={0} defaultValue={item?.baseline_cost ?? ''} />
                                <InputError message={errors.baseline_cost} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="start_date">{t('vendor_contracts.fields.start_date')}</Label>
                                <Input id="start_date" name="start_date" type="date" defaultValue={item?.start_date ?? ''} />
                                <InputError message={errors.start_date} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="end_date">{t('vendor_contracts.fields.end_date')}</Label>
                                <Input id="end_date" name="end_date" type="date" defaultValue={item?.end_date ?? ''} />
                                <InputError message={errors.end_date} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="sla_response_hours">{t('vendor_contracts.fields.sla_response_hours')}</Label>
                                <Input id="sla_response_hours" name="sla_response_hours" type="number" min={1} defaultValue={item?.sla_response_hours ?? ''} />
                                <InputError message={errors.sla_response_hours} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="sla_resolution_hours">{t('vendor_contracts.fields.sla_resolution_hours')}</Label>
                                <Input id="sla_resolution_hours" name="sla_resolution_hours" type="number" min={1} defaultValue={item?.sla_resolution_hours ?? ''} />
                                <InputError message={errors.sla_resolution_hours} />
                            </div>

                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="terms">{t('vendor_contracts.fields.terms')}</Label>
                                <Textarea id="terms" name="terms" defaultValue={item?.terms ?? ''} />
                                <InputError message={errors.terms} />
                            </div>

                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="notes">{t('vendor_contracts.fields.notes')}</Label>
                                <Textarea id="notes" name="notes" defaultValue={item?.notes ?? ''} />
                                <InputError message={errors.notes} />
                            </div>
                        </div>
                    </Card>

                    <Card className="space-y-4 p-6">
                        <div className="font-medium">{t('vendor_contracts.fields.assets')}</div>
                        <div className="grid gap-3 md:grid-cols-2">
                            {assets.map((asset) => (
                                <label key={asset.id} className="flex items-center gap-3 rounded-lg border p-3">
                                    <Checkbox name="asset_ids[]" value={String(asset.id)} defaultChecked={item?.asset_ids?.includes(asset.id)} />
                                    <span className="text-sm">
                                        {asset.name}
                                        <span className="block text-xs text-muted-foreground">{asset.code}</span>
                                    </span>
                                </label>
                            ))}
                        </div>
                        <InputError message={errors.asset_ids} />
                    </Card>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>{t('common.save')}</Button>
                        <Link href={vendorContractsIndex()}>
                            <Button type="button" variant="outline">{t('common.cancel')}</Button>
                        </Link>
                    </div>
                </>
            )}
        </Form>
    );
}
