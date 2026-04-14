<?php

namespace App\Models;

use App\Models\Concerns\BelongsToOrganization;
use Illuminate\Notifications\DatabaseNotification as BaseDatabaseNotification;

class DatabaseNotification extends BaseDatabaseNotification
{
    use BelongsToOrganization;
}
