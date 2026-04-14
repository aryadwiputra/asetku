<?php

namespace Tests;

use App\Models\Organization;
use App\Services\OrganizationContext;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\Cache;
use Laravel\Fortify\Features;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        try {
            Cache::store('redis')->flush();
        } catch (\Throwable) {
            // Ignore cache failures during tests.
        }

        $organization = Organization::query()->first()
            ?? Organization::factory()->create(['slug' => 'test-org']);

        app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);
    }

    protected function skipUnlessFortifyHas(string $feature, ?string $message = null): void
    {
        if (! Features::enabled($feature)) {
            $this->markTestSkipped($message ?? "Fortify feature [{$feature}] is not enabled.");
        }
    }
}
