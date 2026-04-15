import { Form, Head, Link, router } from '@inertiajs/react';
import OrganizationManagementController from '@/actions/App/Http/Controllers/OrganizationManagementController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/use-translation';
import { index as organizationsIndex } from '@/routes/organizations';

type Props = {
    organization: {
        id: number;
        name: string;
        slug: string;
        address: string | null;
        npwp: string | null;
        industry: string | null;
        currency_code: string;
        timezone: string;
        access_ip_allowlist: string[] | null;
        access_working_hours: { days: number[]; ranges: Array<{ start: string; end: string }> } | null;
        access_timezone: string | null;
        asset_code_prefix: string;
        asset_code_format: string;
        maintenance_warning_percent: number;
        fiscal_year_start_month: number;
        fiscal_year_start_day: number;
        is_active: boolean;
    };
};

export default function EditOrganization({ organization }: Props) {
    const { t } = useTranslation();
    const allowlistText = (organization.access_ip_allowlist ?? []).join('\n');
    const workingEnabled = organization.access_working_hours !== null;
    const workingDays = organization.access_working_hours?.days ?? [1, 2, 3, 4, 5];
    const workingRange = organization.access_working_hours?.ranges?.[0] ?? { start: '08:00', end: '17:00' };

    return (
        <>
            <Head title={t('organizations.manage.page_title', { name: organization.name })} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <Heading
                    variant="small"
                    title={t('organizations.manage.heading')}
                    description={organization.name}
                />

                <Form
                    {...OrganizationManagementController.update.form({ organization: organization.id })}
                    className="max-w-3xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('organizations.manage.profile.title')}</CardTitle>
                                    <CardDescription>{t('organizations.manage.profile.description')}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">{t('organizations.manage.profile.name')}</Label>
                                        <Input id="name" name="name" required defaultValue={organization.name} />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="address">{t('organizations.manage.profile.address')}</Label>
                                        <Input id="address" name="address" defaultValue={organization.address ?? ''} />
                                        <InputError message={errors.address} />
                                    </div>

                                    <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="npwp">{t('organizations.manage.profile.npwp')}</Label>
                                            <Input id="npwp" name="npwp" defaultValue={organization.npwp ?? ''} />
                                            <InputError message={errors.npwp} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="industry">{t('organizations.manage.profile.industry')}</Label>
                                            <Input id="industry" name="industry" defaultValue={organization.industry ?? ''} />
                                            <InputError message={errors.industry} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('organizations.manage.locale.title')}</CardTitle>
                                    <CardDescription>{t('organizations.manage.locale.description')}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="currency_code">{t('organizations.manage.locale.currency')}</Label>
                                            <Input id="currency_code" name="currency_code" required defaultValue={organization.currency_code} />
                                            <InputError message={errors.currency_code} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="timezone">{t('organizations.manage.locale.timezone')}</Label>
                                            <Input id="timezone" name="timezone" required defaultValue={organization.timezone} />
                                            <InputError message={errors.timezone} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('organizations.manage.asset_code.title')}</CardTitle>
                                    <CardDescription>{t('organizations.manage.asset_code.description')}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="asset_code_prefix">{t('organizations.manage.asset_code.prefix')}</Label>
                                            <Input id="asset_code_prefix" name="asset_code_prefix" required defaultValue={organization.asset_code_prefix} />
                                            <InputError message={errors.asset_code_prefix} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="asset_code_format">{t('organizations.manage.asset_code.format')}</Label>
                                            <Input id="asset_code_format" name="asset_code_format" required defaultValue={organization.asset_code_format} />
                                            <InputError message={errors.asset_code_format} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

	                            <Card>
	                                <CardHeader>
	                                    <CardTitle>{t('organizations.manage.finance.title')}</CardTitle>
	                                    <CardDescription>{t('organizations.manage.finance.description')}</CardDescription>
	                                </CardHeader>
	                                <CardContent className="space-y-4">
                                    <div className="grid gap-2 sm:grid-cols-3 sm:gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="maintenance_warning_percent">{t('organizations.manage.finance.warning_percent')}</Label>
                                            <Input
                                                id="maintenance_warning_percent"
                                                name="maintenance_warning_percent"
                                                type="number"
                                                min={0}
                                                max={100}
                                                required
                                                defaultValue={organization.maintenance_warning_percent}
                                            />
                                            <InputError message={errors.maintenance_warning_percent} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="fiscal_year_start_month">{t('organizations.manage.finance.fiscal_month')}</Label>
                                            <Input
                                                id="fiscal_year_start_month"
                                                name="fiscal_year_start_month"
                                                type="number"
                                                min={1}
                                                max={12}
                                                required
                                                defaultValue={organization.fiscal_year_start_month}
                                            />
                                            <InputError message={errors.fiscal_year_start_month} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="fiscal_year_start_day">{t('organizations.manage.finance.fiscal_day')}</Label>
                                            <Input
                                                id="fiscal_year_start_day"
                                                name="fiscal_year_start_day"
                                                type="number"
                                                min={1}
                                                max={31}
                                                required
                                                defaultValue={organization.fiscal_year_start_day}
                                            />
                                            <InputError message={errors.fiscal_year_start_day} />
                                        </div>
	                                    </div>
	                                </CardContent>
	                            </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>{t('organizations.manage.access_policy.title')}</CardTitle>
                                        <CardDescription>{t('organizations.manage.access_policy.description')}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="access_ip_allowlist_raw">{t('organizations.manage.access_policy.ip_allowlist')}</Label>
                                            <textarea
                                                id="access_ip_allowlist_raw"
                                                name="access_ip_allowlist_raw"
                                                defaultValue={allowlistText}
                                                placeholder={t('organizations.manage.access_policy.ip_placeholder')}
                                                className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] flex min-h-24 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none"
                                            />
                                            <InputError message={(errors as Record<string, string | undefined>).access_ip_allowlist} />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <input
                                                id="access_working_hours_enabled"
                                                name="access_working_hours_enabled"
                                                type="checkbox"
                                                defaultChecked={workingEnabled}
                                            />
                                            <Label htmlFor="access_working_hours_enabled">{t('organizations.manage.access_policy.working_hours')}</Label>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="grid gap-2">
                                                <Label>{t('organizations.manage.access_policy.working_days')}</Label>
                                                <div className="flex flex-wrap gap-3 text-sm">
                                                    {[
                                                        { value: 1, label: t('organizations.manage.access_policy.day.mon') },
                                                        { value: 2, label: t('organizations.manage.access_policy.day.tue') },
                                                        { value: 3, label: t('organizations.manage.access_policy.day.wed') },
                                                        { value: 4, label: t('organizations.manage.access_policy.day.thu') },
                                                        { value: 5, label: t('organizations.manage.access_policy.day.fri') },
                                                        { value: 6, label: t('organizations.manage.access_policy.day.sat') },
                                                        { value: 7, label: t('organizations.manage.access_policy.day.sun') },
                                                    ].map((d) => (
                                                        <label key={d.value} className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                name="access_working_days[]"
                                                                value={String(d.value)}
                                                                defaultChecked={workingDays.includes(d.value)}
                                                            />
                                                            <span>{d.label}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="access_timezone">{t('organizations.manage.access_policy.timezone')}</Label>
                                                <Input
                                                    id="access_timezone"
                                                    name="access_timezone"
                                                    defaultValue={organization.access_timezone ?? organization.timezone}
                                                    placeholder={t('organizations.manage.access_policy.timezone_placeholder')}
                                                />
                                                <InputError message={errors.access_timezone} />
                                            </div>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="grid gap-2">
                                                <Label htmlFor="access_working_start">{t('organizations.manage.access_policy.start')}</Label>
                                                <Input
                                                    id="access_working_start"
                                                    name="access_working_start"
                                                    type="time"
                                                    defaultValue={workingRange.start}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="access_working_end">{t('organizations.manage.access_policy.end')}</Label>
                                                <Input
                                                    id="access_working_end"
                                                    name="access_working_end"
                                                    type="time"
                                                    defaultValue={workingRange.end}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

	                            <div className="flex items-center gap-4">
	                                <Button disabled={processing}>{t('common.save')}</Button>
	                                <Link href={organizationsIndex()}>
                                    <Button type="button" variant="outline">
                                        {t('common.back')}
                                    </Button>
                                </Link>
                                {organization.is_active && (
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => {
                                            if (confirm(t('organizations.manage.deactivate_confirm'))) {
                                                router.delete(
                                                    OrganizationManagementController.deactivate.url({ organization: organization.id }),
                                                );
                                            }
                                        }}
                                    >
                                        {t('organizations.manage.deactivate')}
                                    </Button>
                                )}
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

EditOrganization.layout = {
    breadcrumbs: [
        { title: 'organizations.title', href: organizationsIndex() },
        { title: 'organizations.context.manage', href: organizationsIndex() },
    ],
};
