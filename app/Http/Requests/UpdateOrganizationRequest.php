<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateOrganizationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:65535'],
            'npwp' => ['nullable', 'string', 'max:255'],
            'industry' => ['nullable', 'string', 'max:255'],
            'currency_code' => ['required', 'string', 'size:3'],
            'timezone' => ['required', 'string', 'max:255'],
            'asset_code_prefix' => ['required', 'string', 'max:20'],
            'asset_code_format' => ['required', 'string', 'max:255'],
            'maintenance_warning_percent' => ['required', 'integer', 'min:0', 'max:100'],
            'fiscal_year_start_month' => ['required', 'integer', 'min:1', 'max:12'],
            'fiscal_year_start_day' => ['required', 'integer', 'min:1', 'max:31'],
        ];
    }
}
