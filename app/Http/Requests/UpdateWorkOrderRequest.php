<?php

namespace App\Http\Requests;

use App\Models\AssetMaintenance;
use App\Services\OrganizationContext;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateWorkOrderRequest extends FormRequest
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
        /** @var AssetMaintenance|null $workOrder */
        $workOrder = $this->route('workOrder');
        $incomingStatus = $this->input('status');
        $effectiveStatus = is_string($incomingStatus) && $incomingStatus !== ''
            ? $incomingStatus
            : $workOrder?->status;

        return [
            'assigned_to' => [
                'nullable',
                'integer',
                Rule::exists('users', 'id'),
            ],
            'status' => ['nullable', 'string', Rule::in(['open', 'acknowledged', 'in_progress', 'completed', 'cancelled'])],
            'progress_percent' => ['nullable', 'integer', 'min:0', 'max:100'],
            'internal_notes' => [
                Rule::requiredIf(in_array($effectiveStatus, ['completed', 'cancelled'], true)),
                'nullable',
                'string',
            ],

            'sla_response_hours' => ['nullable', 'integer', 'min:0'],
            'sla_resolution_hours' => ['nullable', 'integer', 'min:0'],
            'branch_id' => [
                'nullable',
                'integer',
                Rule::exists('branches', 'id')->where('organization_id', $organizationId),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'internal_notes.required' => __('work_orders.validation.reason_required'),
        ];
    }
}
