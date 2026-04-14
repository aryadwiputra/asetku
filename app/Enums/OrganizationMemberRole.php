<?php

namespace App\Enums;

enum OrganizationMemberRole: string
{
    case Owner = 'Owner';
    case Admin = 'Admin';
    case Manager = 'Manager';
    case Member = 'Member';
}
