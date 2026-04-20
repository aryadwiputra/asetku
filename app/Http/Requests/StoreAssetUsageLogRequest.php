<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAssetUsageLogRequest extends FormRequest
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
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'recorded_at' => ['required', 'date'],
            'units' => ['required', 'numeric', 'gt:0'],
            'unit' => ['nullable', 'string', 'max:30'],
            'notes' => ['nullable', 'string', 'max:255'],
        ];
    }
}
