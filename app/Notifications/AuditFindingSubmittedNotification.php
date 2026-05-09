<?php

namespace App\Notifications;

use App\Models\AuditFinding;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\AnonymousNotifiable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AuditFindingSubmittedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly AuditFinding $finding,
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
            'type_key' => 'audit.finding_submitted',
            'finding_id' => $this->finding->id,
            'asset_id' => $this->finding->asset_id,
            'schedule_id' => $this->finding->audit_schedule_id,
            'auditor_id' => $this->finding->auditor_id,
            'status' => $this->finding->status,
            'approval_status' => $this->finding->approval_status,
            'audited_at' => $this->finding->audited_at?->toIso8601String(),
        ];
    }

    public function toMail(mixed $notifiable): MailMessage
    {
        $subject = __('audit.notifications.finding_submitted.subject', [
            'asset_code' => $this->finding->asset?->code ?? $this->finding->asset_id,
        ]);

        return (new MailMessage)
            ->subject($subject)
            ->line(__('audit.notifications.finding_submitted.line1', [
                'auditor' => $this->finding->auditor?->name ?? __('audit.notifications.finding_submitted.unknown_auditor'),
                'asset_code' => $this->finding->asset?->code ?? $this->finding->asset_id,
            ]))
            ->line(__('audit.notifications.finding_submitted.line2', [
                'status' => __("audit.status_values.{$this->finding->status}"),
            ]))
            ->action(__('audit.notifications.finding_submitted.action'), url('/'));
    }
}
