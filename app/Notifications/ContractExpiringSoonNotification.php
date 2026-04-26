<?php

namespace App\Notifications;

use App\Models\VendorContract;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\AnonymousNotifiable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ContractExpiringSoonNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly VendorContract $contract,
    ) {}

    public function via(mixed $notifiable): array
    {
        if ($notifiable instanceof AnonymousNotifiable) {
            return ['mail'];
        }

        return ['database', 'mail'];
    }

    public function toArray(mixed $notifiable): array
    {
        return [
            'type_key' => 'vendor_contracts.notifications.expiring_soon',
            'contract_id' => $this->contract->id,
            'contract_title' => $this->contract->title ?: $this->contract->vendor_name,
            'vendor_name' => $this->contract->vendor_name,
            'end_date' => $this->contract->end_date?->toDateString(),
            'url' => route('vendor-contracts.show', $this->contract),
        ];
    }

    public function toMail(mixed $notifiable): MailMessage
    {
        $subject = __('vendor_contracts.notifications.expiring_soon');

        return (new MailMessage)
            ->subject($subject)
            ->line(__('vendor_contracts.notifications.expiring_soon'))
            ->line(($this->contract->title ?: $this->contract->vendor_name))
            ->line(__('vendor_contracts.fields.end_date').': '.(string) ($this->contract->end_date?->toDateString() ?? ''))
            ->action(__('notifications.actions.open'), route('vendor-contracts.show', $this->contract));
    }
}
