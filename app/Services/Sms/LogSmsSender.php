<?php

namespace App\Services\Sms;

use App\Contracts\SmsSender;
use Illuminate\Support\Facades\Log;

class LogSmsSender implements SmsSender
{
    public function send(string $phoneNumber, string $message): void
    {
        Log::info('SMS sent (log driver).', [
            'to' => $phoneNumber,
            'message' => $message,
        ]);
    }
}

