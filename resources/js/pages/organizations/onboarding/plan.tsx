import { Form, Head, Link } from '@inertiajs/react';
import OrganizationOnboardingController from '@/actions/App/Http/Controllers/OrganizationOnboardingController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/hooks/use-translation';
import { index as organizationsIndex } from '@/routes/organizations';

type Props = {
    organization: {
        id: number;
        name: string;
        plan: string;
    };
};

export default function OrganizationOnboardingPlan({ organization }: Props) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('organizations.onboarding.plan.head')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <Heading
                    variant="small"
                    title={t('organizations.onboarding.plan.title')}
                    description={t('organizations.onboarding.plan.description', { name: organization.name })}
                />

                <Form
                    {...OrganizationOnboardingController.updatePlan.form()}
                    className="max-w-2xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label>{t('organizations.onboarding.plan.plan')}</Label>
                                <Select name="plan" defaultValue={organization.plan ?? 'Free'}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('organizations.onboarding.plan.select')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {['Free', 'Basic', 'Professional', 'Enterprise'].map((value) => (
                                            <SelectItem key={value} value={value}>
                                                {value}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.plan} />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>{t('organizations.onboarding.plan.continue')}</Button>
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

OrganizationOnboardingPlan.layout = {
    breadcrumbs: [
        { title: 'organizations.title', href: organizationsIndex() },
        { title: 'organizations.onboarding.plan.title', href: OrganizationOnboardingController.plan.url() },
    ],
};
