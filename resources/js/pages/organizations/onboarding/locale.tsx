import { Form, Head, Link } from '@inertiajs/react';
import OrganizationOnboardingController from '@/actions/App/Http/Controllers/OrganizationOnboardingController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/use-translation';
import { toForm } from '@/lib/to-form';
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
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('organizations.onboarding.locale.head')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <Heading
                    variant="small"
                    title={t('organizations.onboarding.locale.title')}
                    description={t('organizations.onboarding.locale.description', { name: organization.name })}
                />

                <Form
                    {...toForm(OrganizationOnboardingController.updateLocale())}
                    className="max-w-2xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="currency_code">{t('organizations.onboarding.locale.currency')}</Label>
                                <Input
                                    id="currency_code"
                                    name="currency_code"
                                    defaultValue={organization.currency_code ?? 'IDR'}
                                    required
                                    placeholder={t('organizations.onboarding.locale.currency_placeholder')}
                                />
                                <InputError message={errors.currency_code} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="timezone">{t('organizations.onboarding.locale.timezone')}</Label>
                                <Input
                                    id="timezone"
                                    name="timezone"
                                    defaultValue={organization.timezone ?? 'Asia/Jakarta'}
                                    list="timezone-list"
                                    required
                                    placeholder={t('organizations.onboarding.locale.timezone_placeholder')}
                                />
                                <datalist id="timezone-list">
                                    {timezones.slice(0, 200).map((tz) => (
                                        <option key={tz} value={tz} />
                                    ))}
                                </datalist>
                                <InputError message={errors.timezone} />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>{t('organizations.onboarding.locale.continue')}</Button>
                                <Link href={organizationsIndex()}>
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

OrganizationOnboardingLocale.layout = {
    breadcrumbs: [
        { title: 'organizations.title', href: organizationsIndex() },
        { title: 'organizations.onboarding.locale.title', href: OrganizationOnboardingController.locale.url() },
    ],
};
