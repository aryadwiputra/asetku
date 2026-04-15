<?php

namespace App\Services;

use App\Models\Organization;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;

class OrganizationAccessPolicyEvaluator
{
    public function isRequestAllowed(Organization $organization, Request $request): bool
    {
        if (! $this->isIpAllowed($organization, $request->ip())) {
            return false;
        }

        if (! $this->isWithinWorkingHours($organization, CarbonImmutable::now())) {
            return false;
        }

        return true;
    }

    private function isIpAllowed(Organization $organization, ?string $ip): bool
    {
        $allowlist = $organization->access_ip_allowlist;

        if (! is_array($allowlist) || count($allowlist) === 0) {
            return true;
        }

        if (! is_string($ip) || $ip === '') {
            return false;
        }

        foreach ($allowlist as $entry) {
            if (! is_string($entry) || trim($entry) === '') {
                continue;
            }

            $entry = trim($entry);

            if (str_contains($entry, '/')) {
                if ($this->ipInCidr($ip, $entry)) {
                    return true;
                }
            } else {
                if (hash_equals($entry, $ip)) {
                    return true;
                }
            }
        }

        return false;
    }

    private function ipInCidr(string $ip, string $cidr): bool
    {
        [$subnet, $mask] = array_pad(explode('/', $cidr, 2), 2, null);

        if (! is_string($subnet) || ! is_string($mask)) {
            return false;
        }

        // IPv6 support (v1): exact match only.
        if (str_contains($ip, ':') || str_contains($subnet, ':')) {
            return $ip === $subnet;
        }

        $ipLong = ip2long($ip);
        $subnetLong = ip2long($subnet);
        $maskInt = (int) $mask;

        if ($ipLong === false || $subnetLong === false || $maskInt < 0 || $maskInt > 32) {
            return false;
        }

        $maskLong = -1 << (32 - $maskInt);

        return ($ipLong & $maskLong) === ($subnetLong & $maskLong);
    }

    private function isWithinWorkingHours(Organization $organization, CarbonImmutable $now): bool
    {
        $config = $organization->access_working_hours;

        if (! is_array($config) || $config === []) {
            return true;
        }

        $timezone = $organization->access_timezone ?? $organization->timezone ?? config('app.timezone');
        $now = $now->setTimezone($timezone);

        $days = $config['days'] ?? null;
        $ranges = $config['ranges'] ?? null;

        if (! is_array($days) || ! is_array($ranges) || $ranges === []) {
            return true;
        }

        $day = $now->dayOfWeekIso;

        if (! in_array($day, array_map('intval', $days), true)) {
            return false;
        }

        $time = $now->format('H:i');

        foreach ($ranges as $range) {
            if (! is_array($range)) {
                continue;
            }

            $start = $range['start'] ?? null;
            $end = $range['end'] ?? null;

            if (! is_string($start) || ! is_string($end)) {
                continue;
            }

            if ($start <= $end) {
                if ($time >= $start && $time <= $end) {
                    return true;
                }
            } else {
                // Overnight window, e.g. 22:00-06:00
                if ($time >= $start || $time <= $end) {
                    return true;
                }
            }
        }

        return false;
    }
}

