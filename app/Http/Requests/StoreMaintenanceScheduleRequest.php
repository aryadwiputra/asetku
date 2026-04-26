<?php

namespace App\Http\Requests;

use App\Services\OrganizationContext;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMaintenanceScheduleRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $organizationId = app(OrganizationContext::class)->requireOrganizationId();

        return [
            'asset_id' => [
                'required',
                'integer',
                Rule::exists('assets', 'id')->where('organization_id', $organizationId),
            ],
            'name' => ['required', 'string', 'max:255'],
            'interval_days' => ['required', 'integer', 'min:1', 'max:3650'],
            'next_due_at' => ['required', 'date'],
            'default_priority' => ['nullable', 'string', Rule::in(['low', 'normal', 'high', 'critical'])],
            'default_sla_response_hours' => ['nullable', 'integer', 'min:0'],
            'default_sla_resolution_hours' => ['nullable', 'integer', 'min:0'],
            'checklist_template_id' => [
                'nullable',
                'integer',
                Rule::exists('maintenance_checklist_templates', 'id')->where('organization_id', $organizationId),
            ],
            'required_skill' => ['nullable', 'string', 'max:100'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
