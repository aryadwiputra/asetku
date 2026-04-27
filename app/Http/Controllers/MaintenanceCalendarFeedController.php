<?php

namespace App\Http\Controllers;

use App\Models\CalendarFeed;
use App\Models\MaintenanceSchedule;
use App\Models\Organization;
use App\Services\OrganizationContext;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Symfony\Component\HttpFoundation\Response;

class MaintenanceCalendarFeedController extends Controller
{
    public function show(Request $request, string $token, OrganizationContext $context): Response
    {
        $hash = hash('sha256', $token);

        $feed = CalendarFeed::withoutGlobalScopes()
            ->where('type', 'maintenance')
            ->where('token_hash', $hash)
            ->firstOrFail();

        $context->setCurrentOrganizationId((int) $feed->organization_id);

        CalendarFeed::withoutGlobalScopes()
            ->whereKey($feed->id)
            ->update(['last_used_at' => now()]);

        $timezone = Organization::query()
            ->whereKey($feed->organization_id)
            ->value('timezone') ?: config('app.timezone');

        $start = Carbon::now((string) $timezone)->startOfDay();
        $end = Carbon::now((string) $timezone)->addDays(90)->endOfDay();

        $schedules = MaintenanceSchedule::query()
            ->with([
                'asset:id,code,name,branch_id',
                'asset.branch:id,name,code',
                'technician:id,name',
            ])
            ->where('is_active', true)
            ->whereNotNull('next_due_at')
            ->where('interval_days', '>', 0)
            ->orderBy('next_due_at')
            ->get();

        $lines = [];
        $lines[] = 'BEGIN:VCALENDAR';
        $lines[] = 'VERSION:2.0';
        $lines[] = 'PRODID:-//Asetku//Maintenance Calendar//EN';
        $lines[] = 'CALSCALE:GREGORIAN';
        $lines[] = 'METHOD:PUBLISH';
        $lines[] = 'X-WR-CALNAME:Maintenance Schedules';

        foreach ($schedules as $schedule) {
            if (! $schedule->asset || ! $schedule->next_due_at) {
                continue;
            }

            $occurrence = $schedule->next_due_at->copy()->startOfDay();
            $intervalDays = (int) $schedule->interval_days;

            if ($occurrence->lt($start)) {
                $diff = $occurrence->diffInDays($start);
                $steps = intdiv($diff + $intervalDays - 1, $intervalDays);
                $occurrence = $occurrence->addDays($steps * $intervalDays)->startOfDay();
            }

            $count = 0;
            while ($occurrence->lte($end) && $count < 200) {
                $date = $occurrence->format('Ymd');
                $uid = "maintenance-schedule-{$schedule->id}-{$date}@asetku";

                $summary = "{$schedule->asset->code} — {$schedule->name}";

                $descriptionLines = [
                    "{$schedule->asset->code} — {$schedule->asset->name}",
                ];

                if ($schedule->asset->branch) {
                    $descriptionLines[] = "Branch: {$schedule->asset->branch->code} — {$schedule->asset->branch->name}";
                }

                if ($schedule->technician) {
                    $descriptionLines[] = 'Technician: '.$schedule->technician->name;
                }

                $descriptionLines[] = 'Schedule ID: '.$schedule->id;

                $description = implode("\n", $descriptionLines);

                $lines[] = 'BEGIN:VEVENT';
                $lines[] = 'UID:'.$this->escapeIcsText($uid);
                $lines[] = 'DTSTAMP:'.Carbon::now('UTC')->format('Ymd\\THis\\Z');
                $lines[] = 'SUMMARY:'.$this->escapeIcsText($summary);
                $lines[] = 'DESCRIPTION:'.$this->escapeIcsText($description);
                $lines[] = 'DTSTART;VALUE=DATE:'.$date;
                $lines[] = 'DTEND;VALUE=DATE:'.$occurrence->copy()->addDay()->format('Ymd');
                $lines[] = 'URL:'.$this->escapeIcsText(route('maintenance-calendar.index'));
                $lines[] = 'END:VEVENT';

                $occurrence = $occurrence->copy()->addDays($intervalDays);
                $count++;
            }
        }

        $lines[] = 'END:VCALENDAR';

        $body = implode("\r\n", $lines)."\r\n";

        return response($body, 200, [
            'Content-Type' => 'text/calendar; charset=utf-8',
            'Cache-Control' => 'no-store, private',
        ]);
    }

    private function escapeIcsText(string $value): string
    {
        $value = str_replace('\\', '\\\\', $value);
        $value = str_replace("\r\n", "\n", $value);
        $value = str_replace("\r", "\n", $value);
        $value = str_replace("\n", '\\n', $value);
        $value = str_replace(';', '\\;', $value);
        $value = str_replace(',', '\\,', $value);

        return $value;
    }
}
