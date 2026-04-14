import { Form, Head, Link } from '@inertiajs/react';
import OrganizationOnboardingController from '@/actions/App/Http/Controllers/OrganizationOnboardingController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { index as organizationsIndex } from '@/routes/organizations';

type Props = {
    organization: {
        id: number;
        name: string;
        plan: string;
    };
};

export default function OrganizationOnboardingPlan({ organization }: Props) {
    return (
        <>
            <Head title="Plan" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Choose plan"
                    description={`Organization: ${organization.name}`}
                />

                <Form
                    {...OrganizationOnboardingController.updatePlan.form()}
                    className="max-w-2xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label>Subscription plan</Label>
                                <RadioGroup name="plan" defaultValue={organization.plan ?? 'Free'}>
                                    {['Free', 'Basic', 'Professional', 'Enterprise'].map((value) => (
                                        <div key={value} className="flex items-center gap-3">
                                            <RadioGroupItem value={value} id={`plan_${value}`} />
                                            <Label htmlFor={`plan_${value}`}>{value}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                                <InputError message={errors.plan} />
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

OrganizationOnboardingPlan.layout = {
    breadcrumbs: [
        { title: 'Organizations', href: organizationsIndex() },
        { title: 'Onboarding', href: OrganizationOnboardingController.plan.url() },
    ],
};
