import { Head, router, usePage } from '@inertiajs/react';
import { ClipboardCheck, Pencil, Plus } from 'lucide-react';

import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { create as schedulesCreate, edit as schedulesEdit, show as schedulesShow } from '@/actions/App/Http/Controllers/AuditScheduleController';

type ScheduleRow = {
    id: number;
    name: string;
    description: string | null;
    start_date: string;
    end_date: string;
    status: string;
    created_by: { id: number; name: string } | null;
    auditors: { id: number; name: string }[];
    total_assets: number;
    completed_assets: number;
    created_at: string;
};

type Props = {
    items: {
        data: ScheduleRow[];
        links: { url: string; label: string; active: boolean }[];
        current_page: number;
        from: number;
        last_page: number;
        per_page: number;
        to: number;
        total: number;
    };
    filtersMeta: {
        statusOptions: { value: string; label: string }[];
    };
};

export default function AuditSchedulesIndex({ items, filtersMeta }: Props) {
    const { t } = useTranslation();
    const { moduleAbilities } = usePage().props as {
        moduleAbilities: { audit: { create: boolean; update: boolean } };
    };

    const canCreate = moduleAbilities.audit.create;

    return (
        <>
            <Head title={t('audit.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        variant="small"
                        title={t('audit.title')}
                        description={t('audit.description')}
                    />

                    {canCreate ? (
                        <Button onClick={() => router.visit(schedulesCreate().url)} className="w-full sm:w-auto">
                            <Plus className="mr-2 h-4 w-4" />
                            {t('audit.actions.new_schedule')}
                        </Button>
                    ) : null}
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.data.map((schedule) => (
                        <Card key={schedule.id} className="cursor-pointer transition-shadow hover:shadow-md" onClick={() => router.visit(schedulesShow(schedule.id).url)}>
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between gap-2">
                                    <CardTitle className="text-lg">{schedule.name}</CardTitle>
                                    <Badge
                                        variant={
                                            schedule.status === 'completed'
                                                ? 'default'
                                                : schedule.status === 'in_progress'
                                                  ? 'secondary'
                                                  : 'outline'
                                        }
                                    >
                                        {t(`audit.status.${schedule.status}`)}
                                    </Badge>
                                </div>
                                {schedule.description ? (
                                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{schedule.description}</p>
                                ) : null}
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">{t('audit.fields.period')}</span>
                                        <span>
                                            {schedule.start_date} — {schedule.end_date}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">{t('audit.fields.auditors')}</span>
                                        <span className="text-right">
                                            {schedule.auditors.length > 0
                                                ? schedule.auditors.map((a) => a.name).join(', ')
                                                : '—'}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">{t('audit.fields.assets')}</span>
                                        <span>
                                            {schedule.completed_assets} / {schedule.total_assets}
                                        </span>
                                    </div>

                                    {schedule.total_assets > 0 && (
                                        <div className="h-2 w-full rounded-full bg-muted">
                                            <div
                                                className="h-2 rounded-full bg-primary transition-all"
                                                style={{ width: `${(schedule.completed_assets / schedule.total_assets) * 100}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {items.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <ClipboardCheck className="mb-4 h-12 w-12 text-muted-foreground" />
                        <p className="text-lg font-medium">{t('audit.empty_schedules')}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{t('audit.empty_schedules_desc')}</p>
                    </div>
                ) : null}
            </div>
        </>
    );
}
