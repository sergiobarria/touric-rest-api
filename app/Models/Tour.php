<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Tour extends Model
{
    use HasUlids, HasSlug, HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'duration',
        'max_group_size',
        'difficulty',
        'price',
        'discount_percentage',
        'ratings_avg',
        'ratings_qty',
        'summary',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    public function startDates(): HasMany
    {
        return $this->hasMany(StartDate::class);
    }
}
