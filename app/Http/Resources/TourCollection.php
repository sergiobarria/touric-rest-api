<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class TourCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection->map(fn(TourResource $tour) => [
                'id' => $tour->id,
                'name' => $tour->name,
                'slug' => $tour->slug,
                'duration' => $tour->duration,
                'max_group_size' => $tour->max_group_size,
                'price' => number_format($tour->price / 100, 2),
                'discount_percentage' => $tour->discount_percentage,
                'summary' => $tour->summary,
                'ratings_avg' => $tour->ratings_avg,
                'ratings_qty' => $tour->ratings_qty,
                'start_dates' => $tour->whenLoaded('startDates', function () use ($tour) {
                    return $tour->startDates->map(fn($sd) => $sd->date->format('Y-m-d H:i:s'))->toArray();
                }, []),
            ])
        ];
    }
}
