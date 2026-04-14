import { Form, Head, Link, router } from '@inertiajs/react';
import OrganizationManagementController from '@/actions/App/Http/Controllers/OrganizationManagementController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
        asset_code_prefix: string;
        asset_code_format: string;
        maintenance_warning_percent: number;
        fiscal_year_start_month: number;
        fiscal_year_start_day: number;
        is_active: boolean;
    };
};

export default function EditOrganization({ organization }: Props) {
    return (
        <>
            <Head title={`Manage ${organization.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Manage organization"
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
                                    <CardTitle>Profile</CardTitle>
                                    <CardDescription>Basic information for this organization.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" name="name" required defaultValue={organization.name} />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Input id="address" name="address" defaultValue={organization.address ?? ''} />
                                        <InputError message={errors.address} />
                                    </div>

                                    <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="npwp">NPWP</Label>
                                            <Input id="npwp" name="npwp" defaultValue={organization.npwp ?? ''} />
                                            <InputError message={errors.npwp} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="industry">Industry</Label>
                                            <Input id="industry" name="industry" defaultValue={organization.industry ?? ''} />
                                            <InputError message={errors.industry} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Locale</CardTitle>
                                    <CardDescription>Currency and timezone.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="currency_code">Currency</Label>
                                            <Input id="currency_code" name="currency_code" required defaultValue={organization.currency_code} />
                                            <InputError message={errors.currency_code} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="timezone">Timezone</Label>
                                            <Input id="timezone" name="timezone" required defaultValue={organization.timezone} />
                                            <InputError message={errors.timezone} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Asset code</CardTitle>
                                    <CardDescription>Format used when generating new asset codes.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="asset_code_prefix">Prefix</Label>
                                            <Input id="asset_code_prefix" name="asset_code_prefix" required defaultValue={organization.asset_code_prefix} />
                                            <InputError message={errors.asset_code_prefix} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="asset_code_format">Format</Label>
                                            <Input id="asset_code_format" name="asset_code_format" required defaultValue={organization.asset_code_format} />
                                            <InputError message={errors.asset_code_format} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Maintenance + fiscal year</CardTitle>
                                    <CardDescription>Defaults used for reporting and reminders.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2 sm:grid-cols-3 sm:gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="maintenance_warning_percent">Warning %</Label>
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
                                            <Label htmlFor="fiscal_year_start_month">Fiscal month</Label>
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
                                            <Label htmlFor="fiscal_year_start_day">Fiscal day</Label>
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

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>Save</Button>
                                <Link href={organizationsIndex()}>
                                    <Button type="button" variant="outline">
                                        Back
                                    </Button>
                                </Link>
                                {organization.is_active && (
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => {
                                            if (confirm('Deactivate this organization?')) {
                                                router.delete(
                                                    OrganizationManagementController.deactivate.url({ organization: organization.id }),
                                                );
                                            }
                                        }}
                                    >
                                        Deactivate
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
        { title: 'Organizations', href: organizationsIndex() },
        { title: 'Manage', href: organizationsIndex() },
    ],
};

