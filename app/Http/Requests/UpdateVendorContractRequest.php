<?php

namespace App\Http\Requests;

use App\Models\Vendor;
use App\Services\OrganizationContext;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVendorContractRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $organizationId = app(OrganizationContext::class)->requireOrganizationId();

        return [
            'vendor_id' => [
                'required',
                'integer',
                Rule::exists('vendors', 'id')->where(fn ($query) => $query->where('organization_id', $organizationId)),
            ],
            'title' => ['nullable', 'string', 'max:255'],
            'type' => ['required', 'string', Rule::in(['maintenance', 'subscription', 'lease'])],
            'contract_number' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'string', Rule::in(['draft', 'active', 'expired'])],
            'baseline_cost' => ['nullable', 'numeric', 'min:0'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'sla_response_hours' => ['nullable', 'integer', 'min:1', 'max:100000'],
            'sla_resolution_hours' => ['nullable', 'integer', 'min:1', 'max:100000'],
            'notes' => ['nullable', 'string', 'max:5000'],
            'terms' => ['nullable', 'string', 'max:10000'],
            'asset_ids' => ['nullable', 'array'],
            'asset_ids.*' => [
                'integer',
                Rule::exists('assets', 'id')->where(fn ($query) => $query->where('organization_id', $organizationId)),
            ],
        ];
    }

    public function after(): array
    {
        return [
            function ($validator): void {
                $vendor = Vendor::query()->find($this->integer('vendor_id'));

                if ($vendor?->is_blacklisted) {
                    $validator->errors()->add('vendor_id', __('vendors.validation.blacklisted'));
                }
            },
        ];
    }
}
