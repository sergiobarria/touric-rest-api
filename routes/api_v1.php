<?php

use App\Http\Controllers\Api\V1\TourController;

Route::get('tours/top-rated', [TourController::class, 'topRated']);
Route::get('tours/stats', [TourController::class, 'stats']);
Route::get('tours/monthly-plan/{year}', [TourController::class, 'monthlyPlan']);
Route::apiResource('tours', TourController::class);
