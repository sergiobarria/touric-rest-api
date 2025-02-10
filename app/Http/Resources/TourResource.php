<?php

namespace App\Http\Resources;

use App\Models\Tour;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Tour
 */
class TourResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'duration' => $this->duration,
            'max_group_size' => $this->max_group_size,
            'price' => number_format($this->price / 100, 2),
            'discount_percentage' => $this->discount_percentage,
            'ratings_avg' => $this->ratings_avg,
            'ratings_qty' => $this->ratings_qty,
            'summary' => $this->summary,
            'description' => $this->description,
            'is_active' => $this->is_active,
            'start_dates' => $this->whenLoaded('startDates', function () {
                return $this->startDates
                    ->map(fn($sd) => $sd->date->format('Y-m-d H:i:s'))
                    ->toArray();
            }, []),
        ];
    }
}
