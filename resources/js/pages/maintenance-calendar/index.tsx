import type { EventClickArg, EventDropArg, EventInput, EventSourceFuncArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Head, router } from '@inertiajs/react';
import { Filter, Link2, Pencil } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useTranslation } from '@/hooks/use-translation';
import { create as scheduleCreate, edit as scheduleEdit, reschedule as scheduleReschedule } from '@/routes/maintenance-schedules';
import { events as calendarEvents, feedToken } from '@/routes/maintenance-calendar';

type Meta = {
    branches: { id: number; name: string; code: string }[];
    categories: { id: number; name: string; code: string; parent_id: number | null }[];
    technicians: { id: number; name: string }[];
};

type Props = {
    meta: Meta;
    abilities: {
        canCreateSchedule: boolean;
        canUpdateSchedule: boolean;
    };
};

type CalendarEventMeta = {
    priority: string | null;
    asset: { id: number; code: string; name: string };
    branch: { id: number; name: string; code: string } | null;
    category: { id: number; name: string; code: string } | null;
    technician: { id: number; name: string } | null;
    overdue: boolean;
};

type SelectedEvent = {
    scheduleId: number;
    title: string;
    start: string;
    meta: CalendarEventMeta;
};

export default function MaintenanceCalendarIndex({ meta, abilities }: Props) {
    const { t } = useTranslation();
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [selected, setSelected] = useState<SelectedEvent | null>(null);
    const [creatingFeedLink, setCreatingFeedLink] = useState(false);

    const [filters, setFilters] = useState({
        branch_id: '',
        asset_category_id: '',
        assigned_to: '',
        q: '',
    });

    const queryParams = useMemo(() => {
        const params: Record<string, string> = {};

        if (filters.branch_id) {
            params.branch_id = filters.branch_id;
        }
        if (filters.asset_category_id) {
            params.asset_category_id = filters.asset_category_id;
        }
        if (filters.assigned_to) {
            params.assigned_to = filters.assigned_to;
        }
        if (filters.q.trim()) {
            params.q = filters.q.trim();
        }

        return params;
    }, [filters]);

    function renderFilters() {
        return (
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label>{t('maintenance_calendar.filters.branch')}</Label>
                    <Select value={filters.branch_id || 'all'} onValueChange={(v) => setFilters((p) => ({ ...p, branch_id: v === 'all' ? '' : v }))}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('common.all')}</SelectItem>
                            {meta.branches.map((b) => (
                                <SelectItem key={b.id} value={String(b.id)}>
                                    {b.code} — {b.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-2">
                    <Label>{t('maintenance_calendar.filters.category')}</Label>
                    <Select
                        value={filters.asset_category_id || 'all'}
                        onValueChange={(v) => setFilters((p) => ({ ...p, asset_category_id: v === 'all' ? '' : v }))}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('common.all')}</SelectItem>
                            {meta.categories.map((c) => (
                                <SelectItem key={c.id} value={String(c.id)}>
                                    {c.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-2">
                    <Label>{t('maintenance_calendar.filters.technician')}</Label>
                    <Select value={filters.assigned_to || 'all'} onValueChange={(v) => setFilters((p) => ({ ...p, assigned_to: v === 'all' ? '' : v }))}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('common.all')}</SelectItem>
                            {meta.technicians.map((tech) => (
                                <SelectItem key={tech.id} value={String(tech.id)}>
                                    {tech.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-2">
                    <Label>{t('maintenance_calendar.filters.search')}</Label>
                    <Input value={filters.q} onChange={(e) => setFilters((p) => ({ ...p, q: e.target.value }))} placeholder={t('datatable.search')} />
                </div>
            </div>
        );
    }

    async function loadEvents(info: EventSourceFuncArg, success: (events: EventInput[]) => void, failure: (error: Error) => void) {
        try {
            const url = calendarEvents({
                query: {
                    start: info.startStr,
                    end: info.endStr,
                    ...queryParams,
                },
            }).url;

            const response = await fetch(url, {
                headers: { Accept: 'application/json' },
                credentials: 'same-origin',
            });

            if (!response.ok) {
                failure(new Error(await response.text()));
                return;
            }

            const data = (await response.json()) as EventInput[];
            success(data);
        } catch {
            failure(new Error('Failed to load events'));
        }
    }

    function onEventClick(arg: EventClickArg) {
        const event = arg.event;

        const scheduleId = event.extendedProps?.scheduleId as number | undefined;
        const meta = event.extendedProps?.meta as CalendarEventMeta | undefined;

        if (!scheduleId || !meta || !event.start) {
            return;
        }

        setSelected({
            scheduleId,
            title: event.title,
            start: event.start.toISOString(),
            meta,
        });
    }

    async function onEventDrop(arg: EventDropArg) {
        if (!abilities.canUpdateSchedule) {
            arg.revert();
            return;
        }

        const scheduleId = arg.event.extendedProps?.scheduleId as number | undefined;
        if (!scheduleId || !arg.event.start) {
            arg.revert();
            return;
        }

        const nextDueAt = arg.event.start.toISOString().slice(0, 10);
        const csrf = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '';

        try {
            const res = await fetch(scheduleReschedule({ schedule: scheduleId }).url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf,
                    Accept: 'application/json',
                },
                credentials: 'same-origin',
                body: JSON.stringify({ next_due_at: nextDueAt }),
            });

            if (!res.ok) {
                arg.revert();
                toast.error(t('maintenance_calendar.toast.reschedule_failed'));
                return;
            }

            toast.success(t('maintenance_calendar.toast.rescheduled'));
        } catch {
            arg.revert();
            toast.error(t('maintenance_calendar.toast.reschedule_failed'));
        }
    }

    async function copyFeedLink() {
        if (creatingFeedLink) {
            return;
        }

        setCreatingFeedLink(true);

        const csrf = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '';

        try {
            const res = await fetch(feedToken().url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf, Accept: 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({}),
            });

            if (!res.ok) {
                throw new Error(await res.text());
            }

            const data = (await res.json()) as { url?: string };
            const url = (data.url || '').trim();

            if (!url) {
                throw new Error('Missing url');
            }

            await navigator.clipboard.writeText(url);
            toast.success(t('maintenance_calendar.toast.feed_link_copied'));
        } catch {
            toast.error(t('maintenance_calendar.toast.feed_link_failed'));
        } finally {
            setCreatingFeedLink(false);
        }
    }

    return (
        <>
            <Head title={t('maintenance_calendar.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <Heading
                        variant="small"
                        title={t('maintenance_calendar.title')}
                        description={t('maintenance_calendar.description')}
                    />

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Button variant="outline" className="w-full sm:w-auto" onClick={copyFeedLink} disabled={creatingFeedLink}>
                            <Link2 className="mr-2 h-4 w-4" />
                            {t('maintenance_calendar.actions.copy_feed_link')}
                        </Button>

                        <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="w-full sm:hidden">
                                    <Filter className="mr-2 h-4 w-4" />
                                    {t('common.filters')}
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="gap-4">
                                <SheetHeader>
                                    <SheetTitle>{t('common.filters')}</SheetTitle>
                                </SheetHeader>
                                <div className="px-4">{renderFilters()}</div>
                            </SheetContent>
                        </Sheet>

                        {abilities.canCreateSchedule ? (
                            <Button variant="outline" className="w-full sm:w-auto" onClick={() => router.visit(scheduleCreate().url)}>
                                {t('maintenance_calendar.actions.new_schedule')}
                            </Button>
                        ) : null}
                    </div>
                </div>

                <div className="hidden rounded-lg border bg-background p-4 sm:block">{renderFilters()}</div>

                <div className="min-w-0 rounded-lg border bg-background p-3 sm:p-4">
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay',
                        }}
                        height="auto"
                        events={loadEvents}
                        eventClick={onEventClick}
                        eventDrop={onEventDrop}
                        editable={abilities.canUpdateSchedule}
                        selectable={false}
                        dayMaxEvents
                    />
                </div>
            </div>

            <Dialog open={selected !== null} onOpenChange={(open) => (!open ? setSelected(null) : null)}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="pr-8">{selected?.title || ''}</DialogTitle>
                    </DialogHeader>

                    {selected ? (
                        <div className="space-y-4">
                            <div className="grid gap-2 text-sm">
                                <div className="flex flex-wrap gap-x-2 gap-y-1">
                                    <span className="text-muted-foreground">{t('maintenance_calendar.fields.date')}:</span>
                                    <span>{new Date(selected.start).toLocaleDateString()}</span>
                                </div>
                                <div className="flex flex-wrap gap-x-2 gap-y-1">
                                    <span className="text-muted-foreground">{t('maintenance_calendar.fields.asset')}:</span>
                                    <span>
                                        {selected.meta.asset.code} — {selected.meta.asset.name}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-x-2 gap-y-1">
                                    <span className="text-muted-foreground">{t('maintenance_calendar.fields.branch')}:</span>
                                    <span>{selected.meta.branch ? `${selected.meta.branch.code} — ${selected.meta.branch.name}` : t('common.none')}</span>
                                </div>
                                <div className="flex flex-wrap gap-x-2 gap-y-1">
                                    <span className="text-muted-foreground">{t('maintenance_calendar.fields.technician')}:</span>
                                    <span>{selected.meta.technician ? selected.meta.technician.name : t('common.none')}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                                <Button variant="outline" onClick={() => router.visit(scheduleEdit({ schedule: selected.scheduleId }).url)} className="w-full sm:w-auto">
                                    <Pencil className="mr-2 h-4 w-4" />
                                    {t('maintenance_calendar.actions.edit_schedule')}
                                </Button>
                            </div>
                        </div>
                    ) : null}
                </DialogContent>
            </Dialog>
        </>
    );
}
