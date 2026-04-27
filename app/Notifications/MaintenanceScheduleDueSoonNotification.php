<?php

namespace App\Notifications;

use App\Models\MaintenanceSchedule;
use Carbon\CarbonImmutable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\AnonymousNotifiable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MaintenanceScheduleDueSoonNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * @param  array{asset?: array{id:int,code:string,name:string},branch?: array{id:int,code:string,name:string},technician?: array{id:int,name:string}}  $meta
     */
    public function __construct(
        public readonly MaintenanceSchedule $schedule,
        public readonly CarbonImmutable $dueDate,
        public readonly int $daysBefore,
        public readonly array $meta = [],
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(mixed $notifiable): array
    {
        if ($notifiable instanceof AnonymousNotifiable) {
            return ['mail'];
        }

        return ['database', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(mixed $notifiable): MailMessage
    {
        $assetCode = (string) ($this->meta['asset']['code'] ?? '');
        $assetName = (string) ($this->meta['asset']['name'] ?? '');

        return (new MailMessage)
            ->subject(__('maintenance_calendar.notifications.due_soon_subject', [
                'days' => $this->daysBefore,
            ]))
            ->line(__('maintenance_calendar.notifications.due_soon_body', [
                'days' => $this->daysBefore,
                'date' => $this->dueDate->toDateString(),
            ]))
            ->line(trim("{$assetCode} — {$assetName}"))
            ->action(__('notifications.actions.open'), route('maintenance-calendar.index'));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(mixed $notifiable): array
    {
        return [
            'schedule_id' => $this->schedule->id,
            'days_before' => $this->daysBefore,
            'due_date' => $this->dueDate->toDateString(),
            'asset' => $this->meta['asset'] ?? null,
            'branch' => $this->meta['branch'] ?? null,
            'technician' => $this->meta['technician'] ?? null,
            'url' => route('maintenance-calendar.index'),
        ];
    }
}
