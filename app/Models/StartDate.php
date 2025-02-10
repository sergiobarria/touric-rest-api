<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StartDate extends Model
{
    use HasFactory, HasUlids;

    protected $fillable = [
        'date',
        'tour_id'
    ];

    protected $casts = [
        'date' => 'datetime',
    ];

    public $timestamps = false; // This model does not need timestamps

    public function tour(): BelongsTo
    {
        return $this->belongsTo(Tour::class);
    }
}
