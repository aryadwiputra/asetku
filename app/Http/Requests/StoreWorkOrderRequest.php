<?php

namespace App\Http\Requests;

use App\Services\OrganizationContext;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreWorkOrderRequest extends FormRequest
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
            'description' => ['required', 'string', 'max:255'],
            'performed_at' => ['nullable', 'date'],
            'type' => ['nullable', 'string', Rule::in(['preventive', 'corrective'])],
            'source' => ['nullable', 'string', Rule::in(['manual', 'damage_report'])],
            'priority' => ['nullable', 'string', Rule::in(['low', 'normal', 'high', 'critical'])],
            'branch_id' => [
                'nullable',
                'integer',
                Rule::exists('branches', 'id')->where('organization_id', $organizationId),
            ],
            'checklist_template_id' => [
                'nullable',
                'integer',
                Rule::exists('maintenance_checklist_templates', 'id')->where('organization_id', $organizationId),
            ],
            'sla_response_hours' => ['nullable', 'integer', 'min:0'],
            'sla_resolution_hours' => ['nullable', 'integer', 'min:0'],
            'notes' => ['nullable', 'string'],
            'internal_notes' => ['nullable', 'string'],
        ];
    }
}
