<?php

namespace Database\Factories;

use App\Models\StartDate;
use App\Models\Tour;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Tour>
 */
class TourFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Tour ' . $this->faker->numberBetween(1, 10000),
            'duration' => $this->faker->numberBetween(10, 30),
            'max_group_size' => $this->faker->numberBetween(10, 30),
            'difficulty' => $this->faker->randomElement(['easy', 'moderate', 'hard']),
            'price' => $this->faker->numberBetween(3000, 500000),
            'discount_percentage' => $this->faker->randomElement([0, 10, 20, 40]),
            'ratings_avg' => $this->faker->randomFloat(2, 1, max: 5),
            'ratings_qty' => $this->faker->numberBetween(0, 1000),
            'summary' => $this->faker->sentence(),
            'description' => $this->faker->paragraphs(3, true),
        ];
    }

    public function configure(): TourFactory
    {
        return $this->afterCreating(function (Tour $tour) {
            $tour->startDates()->saveMany(
                StartDate::factory()->count(3)->make()
            );
        });
    }
}
