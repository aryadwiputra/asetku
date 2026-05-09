<?php

namespace App\Http\Requests\Audit;

use App\Services\OrganizationContext;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAuditScheduleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $organizationId = app(OrganizationContext::class)->requireOrganizationId();
        $schedule = $this->route('audit_schedule');

        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'status' => ['nullable', 'string', Rule::in(['draft', 'in_progress', 'completed', 'cancelled'])],
            'auditor_ids' => ['nullable', 'array'],
            'auditor_ids.*' => [
                'required',
                'integer',
                Rule::exists('users', 'id')
                    ->where('current_organization_id', $organizationId),
            ],
            'asset_ids' => ['nullable', 'array'],
            'asset_ids.*' => [
                'required',
                'integer',
                Rule::exists('assets', 'id')->where('organization_id', $organizationId),
            ],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];

        if ($schedule && $schedule->status !== 'draft') {
            $rules['start_date'] = ['nullable', 'date'];
            $rules['end_date'] = ['nullable', 'date'];
        }

        return $rules;
    }
}
