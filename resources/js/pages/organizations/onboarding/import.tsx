import { Form, Head, Link } from '@inertiajs/react';
import OrganizationOnboardingController from '@/actions/App/Http/Controllers/OrganizationOnboardingController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/hooks/use-translation';
import { toForm } from '@/lib/to-form';
import { importTemplate } from '@/routes/organizations';
import { index as organizationsIndex } from '@/routes/organizations';

type ImportRunRow = {
    id: number;
    type: string;
    status: string;
    created_at: string;
    report_path: string | null;
    error_message: string | null;
};

type Props = {
    importRuns: ImportRunRow[];
};

export default function OrganizationOnboardingImport({ importRuns }: Props) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('organizations.onboarding.import.head')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <Heading
                    variant="small"
                    title={t('organizations.onboarding.import.title')}
                    description={t('organizations.onboarding.import.description')}
                />

                <Card className="max-w-2xl space-y-4 p-6">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            {t('organizations.onboarding.import.intro')}
                        </div>
                        <a className="text-sm underline" href={importTemplate({ type: 'branches' }).url}>
                            {t('organizations.onboarding.import.download_branches')}
                        </a>
                    </div>

                    <Form
                        {...toForm(OrganizationOnboardingController.storeImport())}
                        className="space-y-4"
                        encType="multipart/form-data"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="type">{t('organizations.onboarding.import.type')}</Label>
                                    <Select name="type" defaultValue="branches">
                                        <SelectTrigger id="type">
                                            <SelectValue placeholder={t('organizations.onboarding.import.type_select')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="branches">{t('organizations.onboarding.import.type_branches')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.type} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="file">{t('organizations.onboarding.import.file')}</Label>
                                    <Input id="file" name="file" type="file" accept=".xlsx,.xls" required />
                                    <InputError message={errors.file} />
                                </div>

                                <div className="flex items-center gap-4">
                                    <Button disabled={processing}>{t('organizations.onboarding.import.queue')}</Button>
                                    <Link href={organizationsIndex()}>
                                        <Button type="button" variant="outline">
                                            {t('organizations.onboarding.import.done')}
                                        </Button>
                                    </Link>
                                </div>
                            </>
                        )}
                    </Form>
                </Card>

                <div className="max-w-2xl space-y-3">
                    <div className="text-sm font-medium">{t('organizations.onboarding.import.recent')}</div>

                    {importRuns.length === 0 ? (
                        <Card className="p-6 text-sm text-muted-foreground">{t('organizations.onboarding.import.empty')}</Card>
                    ) : (
                        importRuns.map((run) => (
                            <Card key={run.id} className="space-y-1 p-4 text-sm">
                                <div className="flex items-center justify-between">
                                    <div className="font-medium">#{run.id} • {run.type}</div>
                                    <div className="text-muted-foreground">{run.status}</div>
                                </div>
                                {run.error_message && (
                                    <div className="text-destructive">{run.error_message}</div>
                                )}
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}

OrganizationOnboardingImport.layout = {
    breadcrumbs: [
        { title: 'organizations.title', href: organizationsIndex() },
        { title: 'organizations.onboarding.import.title', href: OrganizationOnboardingController.import.url() },
    ],
};
