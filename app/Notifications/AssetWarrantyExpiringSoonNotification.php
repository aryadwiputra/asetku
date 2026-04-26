<?php

namespace App\Notifications;

use App\Models\Asset;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class AssetWarrantyExpiringSoonNotification extends Notification
{
    use Queueable;

    /**
     * @param  array{status:string,warranty_end:string|null,days_remaining:int|null}  $status
     */
    public function __construct(
        public readonly Asset $asset,
        public readonly array $status,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
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
}
