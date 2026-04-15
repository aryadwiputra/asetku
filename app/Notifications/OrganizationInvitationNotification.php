<?php

namespace App\Notifications;

use App\Models\Organization;
use Carbon\CarbonImmutable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrganizationInvitationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Organization $organization,
        public string $token,
        public CarbonImmutable $expiresAt,
    ) {
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $url = route('invites.show', ['token' => $this->token]);

        return (new MailMessage)
            ->subject("You're invited to {$this->organization->name}")
            ->greeting('Invitation')
            ->line("You have been invited to join {$this->organization->name}.")
            ->line('This invitation expires in 48 hours.')
            ->action('Accept invitation', $url)
            ->line("Expires at: {$this->expiresAt->toDayDateTimeString()}");
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'organization_id' => $this->organization->id,
            'organization_name' => $this->organization->name,
        ];
    }
}
