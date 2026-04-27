<?php

namespace App\Notifications;

use App\Models\MaintenanceSchedule;
use Carbon\CarbonImmutable;

class MaintenanceScheduleDueInSevenDaysNotification extends MaintenanceScheduleDueSoonNotification
{
    /**
     * @param  array{asset?: array{id:int,code:string,name:string},branch?: array{id:int,code:string,name:string},technician?: array{id:int,name:string}}  $meta
     */
    public function __construct(MaintenanceSchedule $schedule, CarbonImmutable $dueDate, array $meta = [])
    {
        parent::__construct($schedule, $dueDate, 7, $meta);
    }
}
