import { Form, Head, Link } from '@inertiajs/react';
import OrganizationOnboardingController from '@/actions/App/Http/Controllers/OrganizationOnboardingController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { index as organizationsIndex } from '@/routes/organizations';

type Props = {
    organization: {
        id: number;
        name: string;
        currency_code: string;
        timezone: string;
    };
    timezones: string[];
};

export default function OrganizationOnboardingLocale({ organization, timezones }: Props) {
    return (
        <>
            <Head title="Locale" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Locale"
                    description={`Organization: ${organization.name}`}
                />

                <Form
                    {...OrganizationOnboardingController.updateLocale.form()}
                    className="max-w-2xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="currency_code">Currency</Label>
                                <Input
                                    id="currency_code"
                                    name="currency_code"
                                    defaultValue={organization.currency_code ?? 'IDR'}
                                    required
                                    placeholder="IDR"
                                />
                                <InputError message={errors.currency_code} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="timezone">Timezone</Label>
                                <Input
                                    id="timezone"
                                    name="timezone"
                                    defaultValue={organization.timezone ?? 'Asia/Jakarta'}
                                    list="timezone-list"
                                    required
                                    placeholder="Asia/Jakarta"
                                />
                                <datalist id="timezone-list">
                                    {timezones.slice(0, 200).map((tz) => (
                                        <option key={tz} value={tz} />
                                    ))}
                                </datalist>
                                <InputError message={errors.timezone} />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>Continue</Button>
                                <Link href={organizationsIndex()}>
                                    <Button type="button" variant="outline">
                                        Back
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

OrganizationOnboardingLocale.layout = {
    breadcrumbs: [
        { title: 'Organizations', href: organizationsIndex() },
        { title: 'Onboarding', href: OrganizationOnboardingController.locale.url() },
    ],
};
