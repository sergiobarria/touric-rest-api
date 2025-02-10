<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreTourRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255|unique:tours',
            'duration' => 'required|integer|min:1|max:100',
            'max_group_size' => 'required|integer|min:1|max:100',
            'difficulty' => 'required|string|in:easy,moderate,hard',
            'price' => 'required|numeric|regex:/^\d+(\.\d{1,2})?$/',
            'discount_percentage' => 'nullable|integer|min:0|max:100',
            'ratings_avg' => 'nullable|numeric|min:0|max:5|nullable',
            'ratings_qty' => 'nullable|integer|min:0|numeric',
            'summary' => 'sometimes|string|max:255',
            'description' => 'sometimes|string|max:10000',
            'is_active' => 'sometimes|boolean',
            'start_dates' => 'sometimes|array',
            'start_dates.*' => 'sometimes|date|date_format:Y-m-d H:i:s|after_or_equal:today',
        ];
    }

    public function messages(): array
    {
        return [
            'start_dates.*.date_format' => 'Start date must be in YYYY-MM-DD format',
            'start_dates.*.after_or_equal' => 'Each start date must be in the future'
        ];
    }
}
