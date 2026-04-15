import { Form, Head, Link } from '@inertiajs/react';
import OrganizationOnboardingController from '@/actions/App/Http/Controllers/OrganizationOnboardingController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/use-translation';
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
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('organizations.onboarding.asset_code.head')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <Heading
                    variant="small"
                    title={t('organizations.onboarding.asset_code.title')}
                    description={t('organizations.onboarding.asset_code.description', { name: organization.name })}
                />

                <Form
                    {...OrganizationOnboardingController.updateAssetCode.form()}
                    className="max-w-2xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="asset_code_prefix">{t('organizations.onboarding.asset_code.prefix')}</Label>
                                <Input
                                    id="asset_code_prefix"
                                    name="asset_code_prefix"
                                    defaultValue={organization.asset_code_prefix ?? 'AST'}
                                    required
                                    placeholder={t('organizations.onboarding.asset_code.prefix_placeholder')}
                                />
                                <InputError message={errors.asset_code_prefix} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="asset_code_format">{t('organizations.onboarding.asset_code.format')}</Label>
                                <Input
                                    id="asset_code_format"
                                    name="asset_code_format"
                                    defaultValue={organization.asset_code_format ?? '{PREFIX}-{BRANCH}-{YEAR}-{SEQ4}'}
                                    required
                                    placeholder={t('organizations.onboarding.asset_code.format_placeholder')}
                                />
                                <div className="text-sm text-muted-foreground">
                                    {t('organizations.onboarding.asset_code.help')}
                                </div>
                                <InputError message={errors.asset_code_format} />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>{t('organizations.onboarding.asset_code.continue')}</Button>
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

OrganizationOnboardingAssetCode.layout = {
    breadcrumbs: [
        { title: 'organizations.title', href: organizationsIndex() },
        { title: 'organizations.onboarding.asset_code.title', href: OrganizationOnboardingController.assetCode.url() },
    ],
};
