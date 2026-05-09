<?php

namespace App\Http\Requests\Audit;

use App\Services\OrganizationContext;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAuditScheduleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $organizationId = app(OrganizationContext::class)->requireOrganizationId();

        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'start_date' => ['required', 'date', 'after_or_equal:today'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'auditor_ids' => ['required', 'array', 'min:1'],
            'auditor_ids.*' => [
                'required',
                'integer',
                Rule::exists('users', 'id')
                    ->where('current_organization_id', $organizationId),
            ],
            'asset_ids' => ['required', 'array', 'min:1'],
            'asset_ids.*' => [
                'required',
                'integer',
                Rule::exists('assets', 'id')->where('organization_id', $organizationId),
            ],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'auditor_ids.required' => __('audit.validation.at_least_one_auditor'),
            'asset_ids.required' => __('audit.validation.at_least_one_asset'),
            'end_date.after_or_equal' => __('audit.validation.end_date_after_start'),
        ];
    }
}
