import { router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import InputError from '@/components/input-error';
import BranchLocationPicker from '@/components/branch-location-picker';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/use-translation';

type IdName = { id: number; name: string };

type Branch = { id: number; name: string; code: string };
type Department = { id: number; name: string; code: string; branch_id: number };
type Location = { id: number; name: string; code: string; branch_id: number; parent_id: number | null; type: string | null };
type Category = {
    id: number;
    name: string;
    code: string;
    parent_id: number | null;
    depreciation_method: string | null;
    useful_life_months: number | null;
    residual_value: string | number | null;
};
type Status = { id: number; name: string; code: string };
type Condition = { id: number; name: string; code: string };
type Class = { id: number; name: string; code: string };
type Unit = { id: number; name: string; symbol: string };
type Warranty = { id: number; name: string; duration_months: number };
type VendorContract = {
    id: number;
    vendor_name: string;
    title?: string | null;
    contract_number: string | null;
    status?: string | null;
    end_date?: string | null;
    is_vendor_blacklisted?: boolean;
};

type CustomField = {
    id: number;
    key: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'select' | 'boolean';
    options: unknown;
    is_required: boolean;
    categories: number[];
};

export type AssetFormMeta = {
    branches: Branch[];
    departments: Department[];
    locations: Location[];
    categories: Category[];
    statuses: Status[];
    conditions: Condition[];
    classes: Class[];
    units: Unit[];
    pics: IdName[];
    assetUsers: IdName[];
    warranties: Warranty[];
    vendorContracts: VendorContract[];
    customFields: CustomField[];
};

export type AssetFormData = {
    code: string;
    name: string;
    description: string;
    brand: string;
    model: string;
    series: string;
    serial_number: string;
    imei: string;
    branch_id: string;
    department_id: string;
    asset_location_id: string;
    asset_category_id: string;
    asset_class_id: string;
    unit_id: string;
    asset_status_id: string;
    asset_condition_id: string;
    person_in_charge_id: string;
    asset_user_id: string;
    warranty_id: string;
    vendor_contract_id: string;
    purchase_date: string;
    cost: string;
    depreciation_method: string;
    useful_life_months: string;
    residual_value: string;
    production_units_total_estimate: string;
    production_units_unit: string;
    latitude: number | null;
    longitude: number | null;
    metadata: Record<string, string | number | boolean | null>;
};

export function AssetForm({
    meta,
    initial,
    submit,
    canOverrideCode,
    submitLabel,
    cancelHref,
}: {
    meta: AssetFormMeta;
    initial?: Partial<AssetFormData>;
    submit: { url: string; method: 'post' | 'put' | 'patch' };
    canOverrideCode: boolean;
    submitLabel: string;
    cancelHref: string;
}) {
    const { t } = useTranslation();
    const [showAdvanced, setShowAdvanced] = useState(false);

    const form = useForm<AssetFormData>({
        code: initial?.code ?? '',
        name: initial?.name ?? '',
        description: initial?.description ?? '',
        brand: initial?.brand ?? '',
        model: initial?.model ?? '',
        series: initial?.series ?? '',
        serial_number: initial?.serial_number ?? '',
        imei: initial?.imei ?? '',
        branch_id: initial?.branch_id ?? '',
        department_id: initial?.department_id ?? '',
        asset_location_id: initial?.asset_location_id ?? '',
        asset_category_id: initial?.asset_category_id ?? '',
        asset_class_id: initial?.asset_class_id ?? '',
        unit_id: initial?.unit_id ?? '',
        asset_status_id: initial?.asset_status_id ?? '',
        asset_condition_id: initial?.asset_condition_id ?? '',
        person_in_charge_id: initial?.person_in_charge_id ?? '',
        asset_user_id: initial?.asset_user_id ?? '',
        warranty_id: initial?.warranty_id ?? '',
        vendor_contract_id: initial?.vendor_contract_id ?? '',
        purchase_date: initial?.purchase_date ?? '',
        cost: initial?.cost ?? '',
        depreciation_method: initial?.depreciation_method ?? '',
        useful_life_months: initial?.useful_life_months ?? '',
        residual_value: initial?.residual_value ?? '',
        production_units_total_estimate: (initial as any)?.production_units_total_estimate ?? '',
        production_units_unit: (initial as any)?.production_units_unit ?? '',
        latitude: initial?.latitude ?? null,
        longitude: initial?.longitude ?? null,
        metadata: initial?.metadata ?? {},
    });

    const departmentsForBranch = useMemo(
        () => meta.departments.filter((d) => String(d.branch_id) === String(form.data.branch_id)),
        [meta.departments, form.data.branch_id],
    );

    const locationsForBranch = useMemo(
        () => meta.locations.filter((l) => String(l.branch_id) === String(form.data.branch_id)),
        [meta.locations, form.data.branch_id],
    );

    const categoriesById = useMemo(() => new Map(meta.categories.map((c) => [c.id, c])), [meta.categories]);

    const selectedCategory = useMemo(() => {
        const id = Number(form.data.asset_category_id);
        return Number.isFinite(id) ? categoriesById.get(id) ?? null : null;
    }, [categoriesById, form.data.asset_category_id]);

    const relevantCustomFields = useMemo(() => {
        if (!selectedCategory) {
            return [];
        }

        const ids: number[] = [];
        let current: Category | null = selectedCategory;

        while (current) {
            ids.push(current.id);
            current = current.parent_id ? categoriesById.get(current.parent_id) ?? null : null;
        }

        return meta.customFields.filter((f) => f.categories.some((id) => ids.includes(id)));
    }, [meta.customFields, selectedCategory, categoriesById]);

    function submitForm() {
        form.submit(submit.method, submit.url, {
            preserveScroll: true,
            onSuccess: () => form.clearErrors(),
        });
    }

    function setMetadata(key: string, value: string | number | boolean | null) {
        form.setData('metadata', { ...(form.data.metadata || {}), [key]: value });
    }

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                submitForm();
            }}
            className="space-y-6"
        >
            <Card className="space-y-4 p-6">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="code">{t('assets.fields.code')}</Label>
                        <Input
                            id="code"
                            value={form.data.code}
                            onChange={(e) => form.setData('code', e.target.value)}
                            placeholder={t('assets.placeholders.code_auto')}
                            disabled={!canOverrideCode}
                        />
                        <InputError message={form.errors.code} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="name">{t('assets.fields.name')}</Label>
                        <Input id="name" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} required />
                        <InputError message={form.errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label>{t('assets.fields.branch')}</Label>
                        <Select
                            value={form.data.branch_id || 'none'}
                            onValueChange={(v) => {
                                form.setData('branch_id', v === 'none' ? '' : v);
                                form.setData('department_id', '');
                                form.setData('asset_location_id', '');
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t('assets.placeholders.branch')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">{t('common.none')}</SelectItem>
                                {meta.branches.map((b) => (
                                    <SelectItem key={b.id} value={String(b.id)}>
                                        {b.name} ({b.code})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={form.errors.branch_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label>{t('assets.fields.department')}</Label>
                        <Select value={form.data.department_id || 'none'} onValueChange={(v) => form.setData('department_id', v === 'none' ? '' : v)}>
                            <SelectTrigger>
                                <SelectValue placeholder={t('assets.placeholders.department')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">{t('common.none')}</SelectItem>
                                {departmentsForBranch.map((d) => (
                                    <SelectItem key={d.id} value={String(d.id)}>
                                        {d.name} ({d.code})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={form.errors.department_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label>{t('assets.fields.location')}</Label>
                        <Select value={form.data.asset_location_id || 'none'} onValueChange={(v) => form.setData('asset_location_id', v === 'none' ? '' : v)}>
                            <SelectTrigger>
                                <SelectValue placeholder={t('assets.placeholders.location')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">{t('common.none')}</SelectItem>
                                {locationsForBranch.map((l) => (
                                    <SelectItem key={l.id} value={String(l.id)}>
                                        {l.name} ({l.code})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={form.errors.asset_location_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label>{t('assets.fields.category')}</Label>
                        <Select value={form.data.asset_category_id || 'none'} onValueChange={(v) => form.setData('asset_category_id', v === 'none' ? '' : v)}>
                            <SelectTrigger>
                                <SelectValue placeholder={t('assets.placeholders.category')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">{t('common.none')}</SelectItem>
                                {meta.categories.map((c) => (
                                    <SelectItem key={c.id} value={String(c.id)}>
                                        {c.name} ({c.code})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={form.errors.asset_category_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label>{t('assets.fields.status')}</Label>
                        <Select value={form.data.asset_status_id || 'none'} onValueChange={(v) => form.setData('asset_status_id', v === 'none' ? '' : v)}>
                            <SelectTrigger>
                                <SelectValue placeholder={t('assets.placeholders.status')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">{t('common.none')}</SelectItem>
                                {meta.statuses.map((s) => (
                                    <SelectItem key={s.id} value={String(s.id)}>
                                        {s.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={form.errors.asset_status_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label>{t('assets.fields.condition')}</Label>
                        <Select value={form.data.asset_condition_id || 'none'} onValueChange={(v) => form.setData('asset_condition_id', v === 'none' ? '' : v)}>
                            <SelectTrigger>
                                <SelectValue placeholder={t('assets.placeholders.condition')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">{t('common.none')}</SelectItem>
                                {meta.conditions.map((c) => (
                                    <SelectItem key={c.id} value={String(c.id)}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={form.errors.asset_condition_id} />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="description">{t('assets.fields.description')}</Label>
                    <Textarea id="description" value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} />
                    <InputError message={form.errors.description} />
                </div>

                <div className="flex items-center gap-2">
                    <Checkbox id="showAdvanced" checked={showAdvanced} onCheckedChange={(v) => setShowAdvanced(Boolean(v))} />
                    <Label htmlFor="showAdvanced">{t('assets.actions.show_advanced')}</Label>
                </div>

                {showAdvanced && (
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="brand">{t('assets.fields.brand')}</Label>
                            <Input id="brand" value={form.data.brand} onChange={(e) => form.setData('brand', e.target.value)} />
                            <InputError message={form.errors.brand} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="model">{t('assets.fields.model')}</Label>
                            <Input id="model" value={form.data.model} onChange={(e) => form.setData('model', e.target.value)} />
                            <InputError message={form.errors.model} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="series">{t('assets.fields.series')}</Label>
                            <Input id="series" value={form.data.series} onChange={(e) => form.setData('series', e.target.value)} />
                            <InputError message={form.errors.series} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="serial">{t('assets.fields.serial_number')}</Label>
                            <Input id="serial" value={form.data.serial_number} onChange={(e) => form.setData('serial_number', e.target.value)} />
                            <InputError message={form.errors.serial_number} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="imei">{t('assets.fields.imei')}</Label>
                            <Input id="imei" value={form.data.imei} onChange={(e) => form.setData('imei', e.target.value)} />
                            <InputError message={form.errors.imei} />
                        </div>

                        <div className="grid gap-2">
                            <Label>{t('assets.fields.pic')}</Label>
                            <Select value={form.data.person_in_charge_id || 'none'} onValueChange={(v) => form.setData('person_in_charge_id', v === 'none' ? '' : v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('assets.placeholders.pic')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">{t('common.none')}</SelectItem>
                                    {meta.pics.map((p) => (
                                        <SelectItem key={p.id} value={String(p.id)}>
                                            {p.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.person_in_charge_id} />
                        </div>

                        <div className="grid gap-2">
                            <Label>{t('assets.fields.asset_user')}</Label>
                            <Select value={form.data.asset_user_id || 'none'} onValueChange={(v) => form.setData('asset_user_id', v === 'none' ? '' : v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('assets.placeholders.asset_user')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">{t('common.none')}</SelectItem>
                                    {meta.assetUsers.map((u) => (
                                        <SelectItem key={u.id} value={String(u.id)}>
                                            {u.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.asset_user_id} />
                        </div>

                        <div className="grid gap-2">
                            <Label>{t('assets.fields.warranty')}</Label>
                            <Select value={form.data.warranty_id || 'none'} onValueChange={(v) => form.setData('warranty_id', v === 'none' ? '' : v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('common.select')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">{t('common.none')}</SelectItem>
                                    {meta.warranties.map((warranty) => (
                                        <SelectItem key={warranty.id} value={String(warranty.id)}>
                                            {warranty.name} ({warranty.duration_months} mo)
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.warranty_id} />
                        </div>

                        <div className="grid gap-2">
                            <Label>{t('assets.fields.vendor_contract')}</Label>
                            <Select value={form.data.vendor_contract_id || 'none'} onValueChange={(v) => form.setData('vendor_contract_id', v === 'none' ? '' : v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('common.select')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">{t('common.none')}</SelectItem>
                                    {meta.vendorContracts.map((contract) => (
                                        <SelectItem key={contract.id} value={String(contract.id)} disabled={contract.is_vendor_blacklisted}>
                                            {(contract.title || contract.vendor_name) + (contract.contract_number ? ` (${contract.contract_number})` : '')}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.vendor_contract_id} />
                        </div>
                    </div>
                )}
            </Card>

            <Card className="space-y-4 p-6">
                <div className="font-medium">{t('assets.sections.financial')}</div>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="purchase_date">{t('assets.fields.purchase_date')}</Label>
                        <Input
                            id="purchase_date"
                            type="date"
                            value={form.data.purchase_date}
                            onChange={(e) => form.setData('purchase_date', e.target.value)}
                        />
                        <InputError message={form.errors.purchase_date} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="cost">{t('assets.fields.cost')}</Label>
                        <Input
                            id="cost"
                            type="number"
                            inputMode="decimal"
                            value={form.data.cost}
                            onChange={(e) => form.setData('cost', e.target.value)}
                            min={0}
                        />
                        <InputError message={form.errors.cost} />
                    </div>

                    <div className="grid gap-2">
                        <Label>{t('assets.fields.depreciation_method')}</Label>
                        <Select value={form.data.depreciation_method || 'none'} onValueChange={(v) => form.setData('depreciation_method', v === 'none' ? '' : v)}>
                            <SelectTrigger>
                                <SelectValue placeholder={t('common.select')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">{t('common.none')}</SelectItem>
                                {['straight_line', 'diminishing', 'double_declining', 'syd', 'units_of_production'].map((m) => (
                                    <SelectItem key={m} value={m}>
                                        {t(`assets.depreciation_methods.${m}`)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={form.errors.depreciation_method} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="useful_life_months">{t('assets.fields.useful_life_months')}</Label>
                        <Input
                            id="useful_life_months"
                            type="number"
                            inputMode="numeric"
                            value={form.data.useful_life_months}
                            onChange={(e) => form.setData('useful_life_months', e.target.value)}
                            min={0}
                        />
                        <InputError message={form.errors.useful_life_months} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="residual_value">{t('assets.fields.residual_value')}</Label>
                        <Input
                            id="residual_value"
                            type="number"
                            inputMode="decimal"
                            value={form.data.residual_value}
                            onChange={(e) => form.setData('residual_value', e.target.value)}
                            min={0}
                        />
                        <InputError message={form.errors.residual_value} />
                    </div>
                </div>

                {form.data.depreciation_method === 'units_of_production' ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="production_units_total_estimate">{t('assets.fields.production_units_total_estimate')}</Label>
                            <Input
                                id="production_units_total_estimate"
                                type="number"
                                inputMode="decimal"
                                value={form.data.production_units_total_estimate}
                                onChange={(e) => form.setData('production_units_total_estimate', e.target.value)}
                                min={0}
                            />
                            <InputError message={(form.errors as any).production_units_total_estimate} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="production_units_unit">{t('assets.fields.production_units_unit')}</Label>
                            <Input
                                id="production_units_unit"
                                value={form.data.production_units_unit}
                                onChange={(e) => form.setData('production_units_unit', e.target.value)}
                                placeholder="hours"
                            />
                            <InputError message={(form.errors as any).production_units_unit} />
                        </div>
                    </div>
                ) : null}
            </Card>

            {relevantCustomFields.length > 0 ? (
                <Card className="space-y-4 p-6">
                    <div className="font-medium">{t('assets.sections.custom_fields')}</div>
                    <div className="grid gap-4 md:grid-cols-2">
                        {relevantCustomFields.map((field) => {
                            const value = (form.data.metadata || {})[field.key];

                            if (field.type === 'boolean') {
                                return (
                                    <div key={field.id} className="flex items-center gap-2">
                                        <Checkbox
                                            id={`cf-${field.key}`}
                                            checked={Boolean(value)}
                                            onCheckedChange={(v) => setMetadata(field.key, Boolean(v))}
                                        />
                                        <Label htmlFor={`cf-${field.key}`}>{field.label}</Label>
                                    </div>
                                );
                            }

                            if (field.type === 'select') {
                                const options = Array.isArray(field.options) ? (field.options as Array<{ label: string; value: string }>) : [];
                                return (
                                    <div key={field.id} className="grid gap-2">
                                        <Label htmlFor={`cf-${field.key}`}>{field.label}</Label>
                                        <Select
                                            value={typeof value === 'string' ? value : 'none'}
                                            onValueChange={(v) => setMetadata(field.key, v === 'none' ? null : v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('common.select')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">{t('common.none')}</SelectItem>
                                                {options.map((o) => (
                                                    <SelectItem key={o.value} value={o.value}>
                                                        {o.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                );
                            }

                            return (
                                <div key={field.id} className="grid gap-2">
                                    <Label htmlFor={`cf-${field.key}`}>{field.label}</Label>
                                    <Input
                                        id={`cf-${field.key}`}
                                        value={typeof value === 'string' || typeof value === 'number' ? String(value) : ''}
                                        onChange={(e) => setMetadata(field.key, e.target.value)}
                                        type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </Card>
            ) : null}

            <Card className="space-y-4 p-6">
                <div className="font-medium">{t('assets.sections.map')}</div>
                <BranchLocationPicker
                    latitude={form.data.latitude}
                    longitude={form.data.longitude}
                    onChange={({ latitude, longitude }) => {
                        form.setData('latitude', latitude);
                        form.setData('longitude', longitude);
                    }}
                />
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="latitude">{t('assets.fields.latitude')}</Label>
                        <Input id="latitude" value={form.data.latitude ?? ''} onChange={(e) => form.setData('latitude', e.target.value === '' ? null : Number(e.target.value))} />
                        <InputError message={form.errors.latitude} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="longitude">{t('assets.fields.longitude')}</Label>
                        <Input id="longitude" value={form.data.longitude ?? ''} onChange={(e) => form.setData('longitude', e.target.value === '' ? null : Number(e.target.value))} />
                        <InputError message={form.errors.longitude} />
                    </div>
                </div>
            </Card>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Button disabled={form.processing} className="w-full sm:w-auto">
                    {submitLabel}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => router.visit(cancelHref)}
                >
                    {t('common.cancel')}
                </Button>
            </div>

            {form.hasErrors && (
                <Card className="border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                    {t('common.validation_error')}
                </Card>
            )}
        </form>
    );
}
