<?php

namespace App\Console\Commands;

use App\Models\MaintenanceSchedule;
use App\Models\MaintenanceScheduleReminder;
use App\Models\Organization;
use App\Models\User;
use App\Notifications\MaintenanceScheduleDueInOneDayNotification;
use App\Notifications\MaintenanceScheduleDueInSevenDaysNotification;
use App\Notifications\MaintenanceScheduleDueInThreeDaysNotification;
use App\Services\OrganizationContext;
use Carbon\CarbonImmutable;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Notification;

#[Signature('maintenance-schedules:send-reminders')]
#[Description('Send H-7/H-3/H-1 reminders for preventive maintenance schedules.')]
class MaintenanceSchedulesSendRemindersCommand extends Command
{
    public function handle(): int
    {
        $organizations = Organization::query()
            ->where('is_active', true)
            ->get(['id', 'timezone']);

        foreach ($organizations as $organization) {
            app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

            $timezone = $organization->timezone ?: config('app.timezone');
            $today = CarbonImmutable::now($timezone)->startOfDay();

            $recipients = User::query()
                ->whereHas('organizations', function ($query) use ($organization): void {
                    $query
                        ->whereKey($organization->id)
                        ->where('organization_user.is_active', true)
                        ->whereIn('organization_user.role', ['Owner', 'Admin']);
                })
                ->get();

            if ($recipients->isEmpty()) {
                continue;
            }

            foreach ([7, 3, 1] as $daysBefore) {
                $targetDueDate = $today->addDays($daysBefore)->startOfDay();
                $targetDate = $targetDueDate->toDateString();

                MaintenanceSchedule::query()
                    ->where('is_active', true)
                    ->whereDate('next_due_at', $targetDate)
                    ->with([
                        'asset:id,code,name,branch_id,person_in_charge_id,asset_user_id',
                        'asset.branch:id,code,name',
                        'asset.personInCharge:id,email',
                        'asset.user:id,email',
                        'technician:id,name,email',
                    ])
                    ->get()
                    ->each(function (MaintenanceSchedule $schedule) use ($daysBefore, $recipients, $targetDueDate): void {
                        $reminder = MaintenanceScheduleReminder::query()->firstOrCreate(
                            [
                                'organization_id' => $schedule->organization_id,
                                'schedule_id' => $schedule->id,
                                'days_before' => $daysBefore,
                                'target_due_date' => $targetDueDate,
                            ],
                            [
                                'sent_at' => now(),
                            ],
                        );

                        if (! $reminder->wasRecentlyCreated) {
                            return;
                        }

                        $dueDate = $targetDueDate;

                        $meta = [
                            'asset' => $schedule->asset ? [
                                'id' => $schedule->asset->id,
                                'code' => $schedule->asset->code,
                                'name' => $schedule->asset->name,
                            ] : null,
                            'branch' => $schedule->asset?->branch ? [
                                'id' => $schedule->asset->branch->id,
                                'code' => $schedule->asset->branch->code,
                                'name' => $schedule->asset->branch->name,
                            ] : null,
                            'technician' => $schedule->technician ? [
                                'id' => $schedule->technician->id,
                                'name' => $schedule->technician->name,
                            ] : null,
                        ];

                        $notification = match ($daysBefore) {
                            7 => new MaintenanceScheduleDueInSevenDaysNotification($schedule, $dueDate, $meta),
                            3 => new MaintenanceScheduleDueInThreeDaysNotification($schedule, $dueDate, $meta),
                            default => new MaintenanceScheduleDueInOneDayNotification($schedule, $dueDate, $meta),
                        };

                        foreach ($recipients as $recipient) {
                            $recipient->notify($notification);
                        }

                        if ($schedule->technician) {
                            $schedule->technician->notify($notification);
                        }

                        $picEmails = collect([
                            $schedule->asset?->personInCharge?->email,
                            $schedule->asset?->user?->email,
                        ])->filter(fn ($v) => is_string($v) && trim($v) !== '')->unique()->values();

                        foreach ($picEmails as $email) {
                            Notification::route('mail', $email)->notify($notification);
                        }
                    });
            }
        }

        return self::SUCCESS;
    }
}
