<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTourRequest;
use App\Http\Requests\UpdateTourRequest;
use App\Http\Resources\TourCollection;
use App\Http\Resources\TourResource;
use App\Http\Services\TourService;
use App\Models\Tour;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TourController extends Controller
{
    public function __construct(protected TourService $tourService)
    {
        // ...
    }

    public function index(Request $request): TourCollection
    {
        $tours = $this->tourService->list($request);

        return new TourCollection($tours);
    }

    public function store(StoreTourRequest $request): JsonResponse
    {
        try {
            $tour = $this->tourService->store($request->validated());
            $tour->load('startDates');

            return response()->json($tour, Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function show(string $id): TourResource
    {
        $tour = Tour::with('startDates')->findOrFail($id);
        return new TourResource($tour);
    }

    public function update(UpdateTourRequest $request, string $id): JsonResponse
    {
        try {
            $tour = Tour::with('startDates')->findOrFail($id);
            $tour = $this->tourService->update($tour, $request->validated());
            $tour->load('startDates');

            return response()->json($tour, Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function destroy(string $id): Response
    {
        try {
            $tour = Tour::findOrFail($id);
            $this->tourService->destroy($tour);

            return response()->noContent();
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function topRated(): JsonResponse
    {
        $tours = $this->tourService->getTopRatedTours();

        return response()->json([$tours]);
    }

    public function stats(): JsonResponse
    {
        $stats = $this->tourService->getStats();

        return response()->json($stats);
    }

    public function monthlyPlan(Request $request, int $year): JsonResponse
    {
        $plan = $this->tourService->getMonthlyPlan($year);

        return response()->json($plan);
    }
}
