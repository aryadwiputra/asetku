<?php

namespace App\Notifications;

use App\Models\AssetMaintenance;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\AnonymousNotifiable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WorkOrderAssignedNotification extends Notification implements ShouldQueue
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
            'type_key' => 'assets.work_orders.assigned',
            'work_order_id' => $this->workOrder->id,
            'asset_id' => $this->workOrder->asset_id,
            'description' => $this->workOrder->description,
            'priority' => $this->workOrder->priority,
            'status' => $this->workOrder->status,
            'assigned_at' => $this->workOrder->assigned_at?->toIso8601String(),
        ];
    }

    public function toMail(mixed $notifiable): MailMessage
    {
        $subject = __('work_orders.notifications.assigned.subject', [
            'number' => $this->workOrder->work_order_number,
        ]);

        return (new MailMessage)
            ->subject($subject)
            ->line(__('work_orders.notifications.assigned.line1', [
                'number' => $this->workOrder->work_order_number,
            ]))
            ->line(__('work_orders.notifications.assigned.line2', [
                'description' => $this->workOrder->description,
            ]));
    }
}
