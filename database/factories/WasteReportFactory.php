<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\WasteCategory;
use App\Models\WasteReport;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<WasteReport>
 */
class WasteReportFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'resident_id' => User::factory()->resident(),
            'waste_category_id' => WasteCategory::factory(),
            'title' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'photo_path' => null,
            'location_description' => fake()->address(),
            'latitude' => fake()->latitude(),
            'longitude' => fake()->longitude(),
            'priority' => fake()->randomElement(['low', 'medium', 'high']),
            'status' => 'pending',
        ];
    }

    /**
     * Indicate that the report is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }

    /**
     * Indicate that the report is under review.
     */
    public function underReview(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'under_review',
        ]);
    }

    /**
     * Indicate that the report is approved.
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
        ]);
    }

    /**
     * Indicate that the report is assigned.
     */
    public function assigned(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'assigned',
        ]);
    }

    /**
     * Indicate that the report is in progress.
     */
    public function inProgress(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'in_progress',
        ]);
    }

    /**
     * Indicate that the report is resolved.
     */
    public function resolved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'resolved',
        ]);
    }

    /**
     * Indicate that the report is rejected.
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
        ]);
    }
}
