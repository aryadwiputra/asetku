import { Head, router, usePage } from '@inertiajs/react';
import { FileSpreadsheet, Upload } from 'lucide-react';
import { useState } from 'react';

import AssetImportController from '@/actions/App/Http/Controllers/AssetImportController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/use-translation';
import { index as assetsIndex } from '@/routes/assets';
import { index as assetsImportIndex } from '@/routes/assets/import';

type ImportRun = {
    id: number;
    type: string;
    status: 'queued' | 'processing' | 'completed' | 'failed';
    created_at: string;
    report_path: string | null;
    error_message: string | null;
    meta: Record<string, unknown> | null;
};

type Props = {
    importRuns: ImportRun[];
};

export default function AssetsImportIndex({ importRuns }: Props) {
    const { permissions, orgRole } = usePage().props as { permissions: string[]; orgRole: string | null };
    const { t } = useTranslation();

    const canImport =
        permissions.includes('asset_import.create') ||
        permissions.includes('asset_import.update') ||
        ['Owner', 'Admin', 'Manager'].includes(orgRole || '');

    const [xlsx, setXlsx] = useState<File | null>(null);
    const [zip, setZip] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function uploadXlsx() {
        if (!xlsx) {
            return;
        }
        setSubmitting(true);
        setError(null);

        await new Promise<void>((resolve) => {
            router.post(
                AssetImportController.validateFile.url(),
                { file: xlsx },
                {
                    forceFormData: true,
                    onError: (errors) => {
                        setError(errors.file || t('imports.validation.upload_failed'));
                    },
                    onFinish: () => resolve(),
                },
            );
        });

        setSubmitting(false);
        setXlsx(null);
    }

    async function uploadZip() {
        if (!zip) {
            return;
        }
        setSubmitting(true);
        setError(null);

        await new Promise<void>((resolve) => {
            router.post(
                AssetImportController.importPhotosZip.url(),
                { file: zip },
                {
                    forceFormData: true,
                    onError: (errors) => setError(errors.file || t('imports.validation.upload_failed')),
                    onFinish: () => resolve(),
                },
            );
        });

        setSubmitting(false);
        setZip(null);
    }

    return (
        <>
            <Head title={t('imports.assets.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <Heading variant="small" title={t('imports.assets.title')} description={t('imports.assets.description')} />

                {!canImport ? (
                    <Card className="p-6 text-sm text-muted-foreground">{t('imports.validation.forbidden')}</Card>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('imports.assets.upload_xlsx_title')}</CardTitle>
                                <CardDescription>{t('imports.assets.upload_xlsx_desc')}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Input type="file" accept=".xlsx" onChange={(e) => setXlsx(e.target.files?.[0] ?? null)} />
                                    <InputError message={error ?? undefined} />
                                </div>
                                <Button disabled={!xlsx || submitting} onClick={uploadXlsx} className="w-full sm:w-auto">
                                    <Upload className="mr-2 h-4 w-4" />
                                    {t('imports.actions.validate')}
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>{t('imports.assets.upload_zip_title')}</CardTitle>
                                <CardDescription>{t('imports.assets.upload_zip_desc')}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Input type="file" accept=".zip" onChange={(e) => setZip(e.target.files?.[0] ?? null)} />
                                    <InputError message={error ?? undefined} />
                                </div>
                                <Button disabled={!zip || submitting} onClick={uploadZip} className="w-full sm:w-auto">
                                    <Upload className="mr-2 h-4 w-4" />
                                    {t('imports.actions.queue')}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>{t('imports.runs.title')}</CardTitle>
                        <CardDescription>{t('imports.runs.description')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {importRuns.length === 0 ? (
                            <div className="text-sm text-muted-foreground">{t('imports.runs.empty')}</div>
                        ) : (
                            importRuns.map((run) => (
                                <div key={run.id} className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Badge variant="secondary">{run.type}</Badge>
                                            <span className="text-sm text-muted-foreground">#{run.id}</span>
                                            <Badge>{run.status}</Badge>
                                        </div>
                                        <div className="mt-1 text-xs text-muted-foreground">
                                            {new Date(run.created_at).toLocaleString()}
                                            {run.error_message ? ` • ${run.error_message}` : ''}
                                        </div>
                                    </div>
                                    {run.type === 'assets' && run.status === 'completed' && (run.meta?.errors_count as number) === 0 ? (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.post(AssetImportController.apply.url({ importRun: run.id }), {}, { preserveScroll: true })}
                                        >
                                            <FileSpreadsheet className="mr-2 h-4 w-4" />
                                            {t('imports.actions.apply')}
                                        </Button>
                                    ) : null}
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

AssetsImportIndex.layout = {
    breadcrumbs: [
        { title: 'assets.title', href: assetsIndex() },
        { title: 'imports.assets.title', href: assetsImportIndex() },
    ],
};
