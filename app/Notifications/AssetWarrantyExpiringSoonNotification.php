<?php

namespace App\Notifications;

use App\Models\Asset;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\AnonymousNotifiable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AssetWarrantyExpiringSoonNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * @param  array{status:string,warranty_end:string|null,days_remaining:int|null}  $status
     */
    public function __construct(
        public readonly Asset $asset,
        public readonly array $status,
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
            'type_key' => 'assets.warranty.notifications.expiring_soon',
            'asset_id' => $this->asset->id,
            'asset_code' => $this->asset->code,
            'asset_name' => $this->asset->name,
            'warranty_end' => $this->status['warranty_end'],
            'days_remaining' => $this->status['days_remaining'],
            'url' => route('assets.show', $this->asset),
        ];
    }

    public function toMail(mixed $notifiable): MailMessage
    {
        $subject = __('assets.warranty.notifications.expiring_soon');

        return (new MailMessage)
            ->subject($subject)
            ->line(__('assets.warranty.notifications.expiring_soon'))
            ->line("{$this->asset->code} — {$this->asset->name}")
            ->line(__('assets.warranty.days_remaining', [
                'count' => (int) ($this->status['days_remaining'] ?? 0),
            ]))
            ->line(__('assets.fields.warranty_end').': '.(string) ($this->status['warranty_end'] ?? ''))
            ->action(__('notifications.actions.open'), route('assets.show', $this->asset));
    }
}
