<?php

namespace App\Http\Services;

use App\Models\Tour;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class TourService
{
    /**
     * Create a new Tour along with its start dates.
     *
     * @param array $data
     * @return Tour
     */
    public function store(array $data): Tour
    {
        return DB::transaction(function () use ($data) {
            $startDates = $data['start_dates'] ?? [];
            unset($data['start_dates']);

            $tour = Tour::create($data);
            $this->saveStartDates($tour, $startDates);

        });
    }

    /**
     * Return a list of filtered and paginated tours
     *
     */
    public function list(\Illuminate\Http\Request $request): LengthAwarePaginator
    {
        return QueryBuilder::for(Tour::class)
            ->allowedFilters([
                'slug',
                'name',
                AllowedFilter::callback('price_gt', function ($query, $value) {
                    $query->where('price', '>', $value);
                }),
                AllowedFilter::callback('price_gte', function ($query, $value) {
                    $query->where('price', '>=', $value);
                }),
                AllowedFilter::callback('price_lt', function ($query, $value) {
                    $query->where('price', '<', $value);
                }),
                AllowedFilter::callback('price_lte', function ($query, $value) {
                    $query->where('price', '<=', $value);
                }),
                AllowedFilter::callback('duration_gt', function ($query, $value) {
                    $query->where('duration', '>', $value);
                }),
                AllowedFilter::callback('duration_gte', function ($query, $value) {
                    $query->where('duration', '>=', $value);
                }),
                AllowedFilter::callback('duration_lt', function ($query, $value) {
                    $query->where('duration', '<', $value);
                }),
                AllowedFilter::callback('duration_lte', function ($query, $value) {
                    $query->where('duration', '<=', $value);
                }),
            ])
            ->allowedSorts(['price', 'created_at', 'name', 'ratings_avg'])
            ->allowedFields(['id', 'name', 'slug', 'duration', 'price', 'ratings_avg', 'ratings_qty', 'difficulty', 'created_at'])
            ->allowedIncludes(['startDates'])
            ->defaultSort('created_at')
            ->where('is_active', true)
            ->paginate($request->input('per_page', 10))
            ->appends($request->query());
    }

    /**
     * Update an existing Tour along with its start dates.
     *
     * @param Tour $tour
     * @param array $data
     * @return Tour
     */
    public function update(Tour $tour, array $data): Tour
    {
        return DB::transaction(function () use ($tour, $data) {
            $startDates = $data['start_dates'] ?? null;
            if ($startDates !== null) {
                unset($data['start_dates']);

                $tour->startDates()->delete(); // Delete all current start dates
            }

            $tour->update($data);

            if (!empty($startDates)) {
                $this->saveStartDates($tour, $startDates);
            }

            return $tour;
        });
    }

    /**
     * Delete a Tour.
     *
     * @param Tour $tour
     * @return void
     */
    public function destroy(Tour $tour): void
    {
        $tour->delete();
    }

    /**
     * Retrieve the top-rated tours.
     *
     * @return Collection
     */
    public function getTopRatedTours(): Collection
    {
        $tours = Tour::select(['name', 'price', 'ratings_avg', 'ratings_qty', 'summary', 'difficulty'])
            ->where('is_active', true)
            ->orderByDesc('ratings_avg')
            ->orderBy('price')
            ->limit(5)
            ->get();

        foreach ($tours as $tour) {
            $tour['price'] = number_format($tour['price'] / 100, 2);
        }

        return $tours;
    }

    /**
     * Get aggregated tour statistics.
     *
     * @return Collection
     */
    public function getStats(): Collection
    {
        return Tour::selectRaw(
            'UPPER(difficulty) as difficulty, ' .
            'COUNT(*) as number_of_tours, ' .
            'SUM(ratings_qty) as total_ratings_qty, ' .
            'AVG(ratings_avg) as avg_rating, ' .
            'AVG(price) as avg_price, ' .
            'MIN(price) as min_price, ' .
            'MAX(price) as max_price'
        )
            ->groupBy(DB::raw("UPPER(difficulty)"))
            ->orderBy('avg_price', 'asc')
            ->get();
    }

    /**
     * Get a monthly plan for tours in a given year.
     *
     * @param int $year
     * @return Collection
     */
    public function getMonthlyPlan(int $year): Collection
    {
        $plan = DB::table('start_dates')
            ->join('tours', 'tours.id', '=', 'start_dates.tour_id')
            ->selectRaw(
                'EXTRACT(MONTH FROM start_dates.date) as month, ' .
                "TO_CHAR(start_dates.date, 'FMMonth') as month_name, " .
                'COUNT(*) as number_of_tours, ' .
                'array_to_json(array_agg(tours.name)) as tours'
            )
            ->whereBetween('start_dates.date', ["{$year}-01-01", "{$year}-12-31"])
            ->groupBy(DB::raw("EXTRACT(MONTH FROM start_dates.date), TO_CHAR(start_dates.date, 'FMMonth')"))
            ->orderByDesc('number_of_tours')
            ->get();

        // Decode the JSON string returned for tours into a PHP array.
        return $plan->map(function ($row) {
            if (is_string($row->tours)) {
                $row->tours = json_decode($row->tours, true);
            }
            return $row;
        });
    }

    /**
     * Helper: Save start dates for a Tour.
     *
     * @param Tour $tour
     * @param array $startDates
     * @return void
     */
    private function saveStartDates(Tour $tour, array $startDates): void
    {
        foreach ($startDates as $date) {
            $tour->startDates()->create(['date' => $date]);
        }
    }
}
