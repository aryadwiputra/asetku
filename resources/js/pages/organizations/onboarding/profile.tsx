import { Form, Head, Link } from '@inertiajs/react';
import OrganizationOnboardingController from '@/actions/App/Http/Controllers/OrganizationOnboardingController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/use-translation';
import { index as organizationsIndex } from '@/routes/organizations';

export default function OrganizationOnboardingProfile() {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('organizations.onboarding.profile.head')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <Heading
                    variant="small"
                    title={t('organizations.onboarding.profile.title')}
                    description={t('organizations.onboarding.profile.description')}
                />

                <Form
                    {...OrganizationOnboardingController.storeProfile.form()}
                    className="max-w-2xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="organization_group_name">{t('organizations.onboarding.profile.group')}</Label>
                                <Input
                                    id="organization_group_name"
                                    name="organization_group_name"
                                    placeholder={t('organizations.onboarding.profile.group_placeholder')}
                                />
                                <InputError message={errors.organization_group_name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name">{t('organizations.onboarding.profile.name')}</Label>
                                <Input id="name" name="name" required placeholder={t('organizations.onboarding.profile.name_placeholder')} />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="slug">{t('organizations.onboarding.profile.slug')}</Label>
                                <Input id="slug" name="slug" placeholder={t('organizations.onboarding.profile.slug_placeholder')} />
                                <InputError message={errors.slug} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="address">{t('organizations.onboarding.profile.address')}</Label>
                                <Input id="address" name="address" placeholder={t('organizations.onboarding.profile.address_placeholder')} />
                                <InputError message={errors.address} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="npwp">{t('organizations.onboarding.profile.npwp')}</Label>
                                <Input id="npwp" name="npwp" placeholder={t('organizations.onboarding.profile.npwp_placeholder')} />
                                <InputError message={errors.npwp} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="industry">{t('organizations.onboarding.profile.industry')}</Label>
                                <Input id="industry" name="industry" placeholder={t('organizations.onboarding.profile.industry_placeholder')} />
                                <InputError message={errors.industry} />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>{t('organizations.onboarding.profile.continue')}</Button>
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

OrganizationOnboardingProfile.layout = {
    breadcrumbs: [
        { title: 'organizations.title', href: organizationsIndex() },
        { title: 'organizations.onboarding.profile.title', href: OrganizationOnboardingController.profile.url() },
    ],
};
