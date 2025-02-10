<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateTourRequest extends FormRequest
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
            'name' => 'sometimes|string|max:255|unique:tours',
            'duration' => 'sometimes|integer|min:1|max:100',
            'max_group_size' => 'sometimes|integer|min:1|max:100',
            'difficulty' => 'sometimes|string|in:easy,moderate,hard',
            'price' => 'sometimes|numeric|regex:/^\d+(\.\d{1,2})?$/',
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
}
