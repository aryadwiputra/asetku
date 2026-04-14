import { Form, Head, Link } from '@inertiajs/react';
import OrganizationOnboardingController from '@/actions/App/Http/Controllers/OrganizationOnboardingController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { index as organizationsIndex } from '@/routes/organizations';

export default function OrganizationOnboardingProfile() {
    return (
        <>
            <Head title="New Organization" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <Heading
                    variant="small"
                    title="Create organization"
                    description="Set up a new company or institution under this platform account."
                />

                <Form
                    {...OrganizationOnboardingController.storeProfile.form()}
                    className="max-w-2xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="organization_group_name">Group (optional)</Label>
                                <Input
                                    id="organization_group_name"
                                    name="organization_group_name"
                                    placeholder="PT Maju Bersama"
                                />
                                <InputError message={errors.organization_group_name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name">Organization name</Label>
                                <Input id="name" name="name" required placeholder="PT Maju Teknologi" />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="slug">Slug (optional)</Label>
                                <Input id="slug" name="slug" placeholder="maju-teknologi" />
                                <InputError message={errors.slug} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="address">Address (optional)</Label>
                                <Input id="address" name="address" placeholder="Jl. Sudirman No. 1, Jakarta" />
                                <InputError message={errors.address} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="npwp">NPWP (optional)</Label>
                                <Input id="npwp" name="npwp" placeholder="00.000.000.0-000.000" />
                                <InputError message={errors.npwp} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="industry">Industry (optional)</Label>
                                <Input id="industry" name="industry" placeholder="Logistics / Property / Technology" />
                                <InputError message={errors.industry} />
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

OrganizationOnboardingProfile.layout = {
    breadcrumbs: [
        { title: 'Organizations', href: organizationsIndex() },
        { title: 'Onboarding', href: OrganizationOnboardingController.profile.url() },
    ],
};
