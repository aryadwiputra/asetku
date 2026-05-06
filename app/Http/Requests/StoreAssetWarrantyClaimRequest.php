<?php

namespace App\Http\Requests;

use App\Services\OrganizationContext;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAssetWarrantyClaimRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $organizationId = app(OrganizationContext::class)->requireOrganizationId();

        return [
            'claim_reference' => ['nullable', 'string', 'max:255'],
            'vendor_id' => ['nullable', 'integer', Rule::exists('vendors', 'id')->where(fn ($query) => $query->where('organization_id', $organizationId))],
            'vendor_contract_id' => ['nullable', 'integer', Rule::exists('vendor_contracts', 'id')->where(fn ($query) => $query->where('organization_id', $organizationId))],
            'submitted_at' => ['nullable', 'date'],
            'status' => ['required', 'string', Rule::in(['draft', 'submitted', 'approved', 'rejected', 'completed'])],
            'result' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:5000'],
            'resolved_at' => ['nullable', 'date'],
        ];
    }
}
