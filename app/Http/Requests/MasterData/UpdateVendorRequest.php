<?php

namespace App\Http\Requests\MasterData;

use App\Models\Vendor;
use App\Services\OrganizationContext;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVendorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $organizationId = app(OrganizationContext::class)->requireOrganizationId();
        /** @var Vendor $vendor */
        $vendor = $this->route('vendor');

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('vendors', 'name')
                    ->ignore($vendor->id)
                    ->where(fn ($query) => $query->where('organization_id', $organizationId)),
            ],
            'tax_number' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'address' => ['nullable', 'string', 'max:5000'],
            'service_category' => ['nullable', 'string', 'max:255'],
            'is_blacklisted' => ['nullable', 'boolean'],
            'blacklist_reason' => ['nullable', 'string', 'max:5000'],
            'notes' => ['nullable', 'string', 'max:5000'],
        ];
    }
}
