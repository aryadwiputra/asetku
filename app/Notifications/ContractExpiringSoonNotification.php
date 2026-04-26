<?php

namespace App\Notifications;

use App\Models\VendorContract;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ContractExpiringSoonNotification extends Notification
{
    use Queueable;

    public function __construct(
        public readonly VendorContract $contract,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
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
}
