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
            'access_ip_allowlist' => ['nullable', 'array'],
            'access_ip_allowlist.*' => ['string', 'max:100'],
            'access_working_hours' => ['nullable', 'array'],
            'access_timezone' => ['nullable', 'string', 'max:255'],
            'asset_code_prefix' => ['required', 'string', 'max:20'],
            'asset_code_format' => ['required', 'string', 'max:255'],
            'maintenance_warning_percent' => ['required', 'integer', 'min:0', 'max:100'],
            'fiscal_year_start_month' => ['required', 'integer', 'min:1', 'max:12'],
            'fiscal_year_start_day' => ['required', 'integer', 'min:1', 'max:31'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $ipRaw = $this->input('access_ip_allowlist_raw');

        if (is_string($ipRaw)) {
            $ips = array_values(array_filter(array_map('trim', preg_split('/\r\n|\r|\n/', $ipRaw) ?: []), fn ($v) => $v !== ''));

            $this->merge([
                'access_ip_allowlist' => $ips === [] ? null : $ips,
            ]);
        }

        $workingEnabled = $this->boolean('access_working_hours_enabled');
        $days = $this->input('access_working_days');
        $start = $this->input('access_working_start');
        $end = $this->input('access_working_end');

        if (! $workingEnabled) {
            $this->merge(['access_working_hours' => null]);

            return;
        }

        if (is_array($days) && is_string($start) && is_string($end) && $start !== '' && $end !== '') {
            $dayInts = array_values(array_map('intval', $days));

            $this->merge([
                'access_working_hours' => [
                    'days' => $dayInts,
                    'ranges' => [
                        ['start' => $start, 'end' => $end],
                    ],
                ],
            ]);
        }
    }
}
