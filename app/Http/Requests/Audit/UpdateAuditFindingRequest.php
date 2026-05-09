<?php

namespace App\Http\Requests\Audit;

use App\Services\OrganizationContext;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAuditFindingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $organizationId = app(OrganizationContext::class)->requireOrganizationId();

        return [
            'approval_status' => ['nullable', 'string', Rule::in(['pending', 'approved', 'rejected'])],
            'approval_notes' => ['nullable', 'string', 'max:2000'],
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
            'status' => ['nullable', 'string', Rule::in(['matched', 'mismatched', 'not_found'])],
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
