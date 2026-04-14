<?php

namespace Database\Factories;

use App\Models\Branch;
use App\Models\Organization;
use App\Services\OrganizationContext;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Branch>
 */
class BranchFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<Branch>
     */
    protected $model = Branch::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $organizationId = app(OrganizationContext::class)->currentOrganizationId();

        return [
            'organization_id' => $organizationId ?? Organization::factory(),
            'name' => fake()->city(),
            'code' => fake()->unique()->bothify('BR-###'),
        ];
    }
}
