<?php

namespace Database\Factories;

use App\Models\CollectionTask;
use App\Models\User;
use App\Models\WasteReport;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CollectionTask>
 */
class CollectionTaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'waste_report_id' => WasteReport::factory(),
            'assigned_worker_id' => User::factory()->worker(),
            'assigned_by' => User::factory()->administrator(),
            'scheduled_at' => now()->addDay(),
            'started_at' => null,
            'completed_at' => null,
            'status' => 'assigned',
            'completion_notes' => null,
            'completion_photo_path' => null,
        ];
    }

    /**
     * Indicate that the task is assigned.
     */
    public function assigned(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'assigned',
            'started_at' => null,
            'completed_at' => null,
        ]);
    }

    /**
     * Indicate that the task is accepted.
     */
    public function accepted(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'accepted',
            'started_at' => null,
            'completed_at' => null,
        ]);
    }

    /**
     * Indicate that the task is in progress.
     */
    public function inProgress(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'in_progress',
            'started_at' => now()->subHour(),
            'completed_at' => null,
        ]);
    }

    /**
     * Indicate that the task is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'started_at' => now()->subHours(2),
            'completed_at' => now(),
            'completion_notes' => fake()->paragraph(),
        ]);
    }

    /**
     * Indicate that the task is cancelled.
     */
    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
        ]);
    }
}
