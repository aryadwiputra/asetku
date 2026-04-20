<?php

namespace App\Notifications;

use App\Models\Asset;
use App\Models\AssetDepreciationEntry;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AssetResidualValueReachedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly Asset $asset,
        public readonly AssetDepreciationEntry $entry,
    ) {}

    /**
     * @return list<string>
     */
    public function via(mixed $notifiable): array
    {
        if ($notifiable instanceof \Illuminate\Notifications\AnonymousNotifiable) {
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
            'type_key' => 'assets.depreciation.residual_reached',
            'asset_id' => $this->asset->id,
            'asset_code' => $this->asset->code,
            'asset_name' => $this->asset->name,
            'period_end' => $this->entry->period_end?->toDateString(),
            'residual_value' => $this->asset->residual_value,
        ];
    }

    public function toMail(mixed $notifiable): MailMessage
    {
        $subject = __('depreciation.notifications.residual_reached.subject', [
            'code' => $this->asset->code,
        ]);

        return (new MailMessage)
            ->subject($subject)
            ->line(__('depreciation.notifications.residual_reached.line1', [
                'code' => $this->asset->code,
                'name' => $this->asset->name,
            ]))
            ->line(__('depreciation.notifications.residual_reached.line2', [
                'residual' => (string) ($this->asset->residual_value ?? 0),
                'period_end' => (string) ($this->entry->period_end?->toDateString() ?? ''),
            ]));
    }
}

