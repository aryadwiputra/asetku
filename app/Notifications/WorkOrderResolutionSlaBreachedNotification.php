<?php

namespace App\Notifications;

use App\Models\AssetMaintenance;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\AnonymousNotifiable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WorkOrderResolutionSlaBreachedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly AssetMaintenance $workOrder,
    ) {}

    /**
     * @return list<string>
     */
    public function via(mixed $notifiable): array
    {
        if ($notifiable instanceof AnonymousNotifiable) {
            return ['mail'];
        }

        return ['database', 'mail'];
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(mixed $notifiable): array
    {
        return [
            'type_key' => 'assets.work_orders.sla_resolution_breached',
            'work_order_id' => $this->workOrder->id,
            'asset_id' => $this->workOrder->asset_id,
            'description' => $this->workOrder->description,
            'priority' => $this->workOrder->priority,
            'status' => $this->workOrder->status,
            'resolution_due_at' => $this->workOrder->resolution_due_at?->toIso8601String(),
            'escalation_level' => $this->workOrder->escalation_level,
        ];
    }

    public function toMail(mixed $notifiable): MailMessage
    {
        $subject = __('work_orders.notifications.sla_breached.subject', [
            'id' => $this->workOrder->id,
        ]);

        return (new MailMessage)
            ->subject($subject)
            ->line(__('work_orders.notifications.sla_breached.line1', [
                'id' => $this->workOrder->id,
            ]))
            ->line(__('work_orders.notifications.sla_breached.line2', [
                'kind' => __('work_orders.sla.kind.resolution'),
            ]));
    }
}
