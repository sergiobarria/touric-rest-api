<?php

namespace Database\Factories;

use App\Models\StartDate;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<StartDate>
 */
class StartDateFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $year = now()->year;

        $randomDate = $this->faker->dateTimeBetween("{$year}-01-01", "{$year}-12-31");

        $hour = $this->faker->numberBetween(6, 18);

        $minute = $this->faker->randomElement([0, 15, 30, 45]);

        $dateTime = Carbon::instance($randomDate)->setTime($hour, $minute, 0);

        return [
            'date' => $dateTime,
            // 'tour_id' => autopopulated
        ];
    }
}
