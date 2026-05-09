<?php

namespace App\Http\Requests\Audit;

use App\Services\OrganizationContext;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAuditFindingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $organizationId = app(OrganizationContext::class)->requireOrganizationId();

        return [
            'audit_schedule_id' => [
                'nullable',
                'integer',
                Rule::exists('audit_schedules', 'id')->where('organization_id', $organizationId),
            ],
            'asset_id' => [
                'required',
                'integer',
                Rule::exists('assets', 'id')->where('organization_id', $organizationId),
            ],
            'auditor_id' => [
                'nullable',
                'integer',
                Rule::exists('users', 'id')
                    ->where('current_organization_id', $organizationId),
            ],
            'current_location_id' => [
                'nullable',
                'integer',
                Rule::exists('asset_locations', 'id')->where('organization_id', $organizationId),
            ],
            'expected_location_id' => [
                'nullable',
                'integer',
                Rule::exists('asset_locations', 'id')->where('organization_id', $organizationId),
            ],
            'current_condition_id' => [
                'nullable',
                'integer',
                Rule::exists('asset_conditions', 'id')->where('organization_id', $organizationId),
            ],
            'status' => ['required', 'string', Rule::in(['matched', 'mismatched', 'not_found'])],
            'notes' => ['nullable', 'string', 'max:5000'],
            'signature_data' => ['nullable', 'string'],
            'audited_at' => ['nullable', 'date'],
            'photo_ids' => ['nullable', 'array'],
            'photo_ids.*' => [
                'required',
                'integer',
                Rule::exists('media_assets', 'id'),
            ],
        ];
    }
}
