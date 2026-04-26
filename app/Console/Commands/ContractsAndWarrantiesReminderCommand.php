<?php

namespace App\Console\Commands;

use App\Models\Asset;
use App\Models\Organization;
use App\Models\User;
use App\Models\VendorContract;
use App\Notifications\AssetWarrantyExpiringSoonNotification;
use App\Notifications\ContractExpiringSoonNotification;
use App\Services\AssetWarrantyStatusService;
use App\Services\OrganizationContext;
use Carbon\CarbonImmutable;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('contracts-and-warranties:remind')]
#[Description('Send in-app reminders for contracts and asset warranties that expire within 30 days.')]
class ContractsAndWarrantiesReminderCommand extends Command
{
    public function handle(AssetWarrantyStatusService $warrantyStatusService): int
    {
        $organizations = Organization::query()
            ->where('is_active', true)
            ->get(['id', 'timezone']);

        foreach ($organizations as $organization) {
            app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

            $now = CarbonImmutable::now($organization->timezone ?: config('app.timezone'));
            $recipients = User::query()
                ->whereHas('organizations', function ($query) use ($organization) {
                    $query
                        ->whereKey($organization->id)
                        ->where('organization_user.is_active', true)
                        ->whereIn('organization_user.role', ['Admin', 'Manager']);
                })
                ->get();

            if ($recipients->isEmpty()) {
                continue;
            }

            VendorContract::query()
                ->whereNotNull('end_date')
                ->whereDate('end_date', '>=', $now->toDateString())
                ->whereDate('end_date', '<=', $now->addDays(30)->toDateString())
                ->whereNull('expiry_reminder_sent_at')
                ->with('vendor:id,name')
                ->each(function (VendorContract $contract) use ($recipients): void {
                    foreach ($recipients as $recipient) {
                        $recipient->notify(new ContractExpiringSoonNotification($contract));
                    }

                    $contract->forceFill(['expiry_reminder_sent_at' => now()])->save();
                });

            Asset::query()
                ->with(['warranty:id,name,duration_months', 'vendorContract.vendor:id,name'])
                ->get()
                ->each(function (Asset $asset) use ($recipients, $warrantyStatusService): void {
                    $status = $warrantyStatusService->determine($asset);

                    if ($status['status'] !== 'expiring_soon' || $asset->warranty_expiry_reminder_sent_at !== null) {
                        return;
                    }

                    foreach ($recipients as $recipient) {
                        $recipient->notify(new AssetWarrantyExpiringSoonNotification($asset, $status));
                    }

                    $asset->forceFill(['warranty_expiry_reminder_sent_at' => now()])->save();
                });
        }

        return self::SUCCESS;
    }
}
