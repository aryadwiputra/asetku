<?php

namespace App\Http\Requests\Assets;

use App\Models\Asset;
use App\Services\OrganizationContext;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAssetRequest extends FormRequest
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
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $organizationId = app(OrganizationContext::class)->requireOrganizationId();

        /** @var Asset $asset */
        $asset = $this->route('asset');

        return [
            'code' => [
                'nullable',
                'string',
                'max:100',
                Rule::unique('assets', 'code')
                    ->ignore($asset->id)
                    ->where(fn ($query) => $query->where('organization_id', $organizationId)),
            ],
            'name' => ['required', 'string', 'max:255'],
            'brand' => ['nullable', 'string', 'max:255'],
            'model' => ['nullable', 'string', 'max:255'],
            'series' => ['nullable', 'string', 'max:255'],
            'serial_number' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('assets', 'serial_number')
                    ->ignore($asset->id)
                    ->where(fn ($query) => $query->where('organization_id', $organizationId)),
            ],
            'imei' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('assets', 'imei')
                    ->ignore($asset->id)
                    ->where(fn ($query) => $query->where('organization_id', $organizationId)),
            ],
            'description' => ['nullable', 'string'],

            'branch_id' => [
                'required',
                'integer',
                Rule::exists('branches', 'id')->where(fn ($query) => $query->where('organization_id', $organizationId)),
            ],
            'department_id' => [
                'nullable',
                'integer',
                Rule::exists('departments', 'id')->where(fn ($query) => $query->where('organization_id', $organizationId)),
            ],
            'asset_location_id' => [
                'nullable',
                'integer',
                Rule::exists('asset_locations', 'id')->where(fn ($query) => $query->where('organization_id', $organizationId)),
            ],

            'asset_category_id' => [
                'nullable',
                'integer',
                Rule::exists('asset_categories', 'id')->where(fn ($query) => $query->where('organization_id', $organizationId)),
            ],
            'asset_class_id' => [
                'nullable',
                'integer',
                Rule::exists('asset_classes', 'id')->where(fn ($query) => $query->where('organization_id', $organizationId)),
            ],
            'unit_id' => [
                'nullable',
                'integer',
                Rule::exists('units', 'id')->where(fn ($query) => $query->where('organization_id', $organizationId)),
            ],

            'asset_status_id' => [
                'nullable',
                'integer',
                Rule::exists('asset_statuses', 'id')->where(fn ($query) => $query->where('organization_id', $organizationId)),
            ],
            'asset_condition_id' => [
                'nullable',
                'integer',
                Rule::exists('asset_conditions', 'id')->where(fn ($query) => $query->where('organization_id', $organizationId)),
            ],

            'person_in_charge_id' => [
                'nullable',
                'integer',
                Rule::exists('person_in_charges', 'id')->where(fn ($query) => $query->where('organization_id', $organizationId)),
            ],
            'asset_user_id' => [
                'nullable',
                'integer',
                Rule::exists('asset_users', 'id')->where(fn ($query) => $query->where('organization_id', $organizationId)),
            ],

            'purchase_date' => ['nullable', 'date'],
            'cost' => ['nullable', 'numeric', 'min:0'],

            'depreciation_method' => ['nullable', 'string', 'max:50'],
            'useful_life_months' => ['nullable', 'integer', 'min:0'],
            'residual_value' => ['nullable', 'numeric', 'min:0'],
            'production_units_total_estimate' => ['nullable', 'numeric', 'min:0'],
            'production_units_unit' => ['nullable', 'string', 'max:30'],

            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],

            'metadata' => ['nullable', 'array'],
        ];
    }
}
