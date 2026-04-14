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
        asset_code_prefix: string;
        asset_code_format: string;
    };
};

export default function OrganizationOnboardingAssetCode({ organization }: Props) {
    return (
        <>
            <Head title="Asset Code" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Asset code format"
                    description={`Organization: ${organization.name}`}
                />

                <Form
                    {...OrganizationOnboardingController.updateAssetCode.form()}
                    className="max-w-2xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="asset_code_prefix">Prefix</Label>
                                <Input
                                    id="asset_code_prefix"
                                    name="asset_code_prefix"
                                    defaultValue={organization.asset_code_prefix ?? 'AST'}
                                    required
                                    placeholder="AST"
                                />
                                <InputError message={errors.asset_code_prefix} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="asset_code_format">Format</Label>
                                <Input
                                    id="asset_code_format"
                                    name="asset_code_format"
                                    defaultValue={organization.asset_code_format ?? '{PREFIX}-{BRANCH}-{YEAR}-{SEQ4}'}
                                    required
                                    placeholder="{PREFIX}-{BRANCH}-{YEAR}-{SEQ4}"
                                />
                                <div className="text-sm text-muted-foreground">
                                    Tokens: {'{PREFIX}'} {'{BRANCH}'} {'{YEAR}'} {'{SEQ4}'} (or {'{SEQ}'} / {'{SEQ6}'})
                                </div>
                                <InputError message={errors.asset_code_format} />
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

OrganizationOnboardingAssetCode.layout = {
    breadcrumbs: [
        { title: 'Organizations', href: organizationsIndex() },
        { title: 'Onboarding', href: OrganizationOnboardingController.assetCode.url() },
    ],
};
