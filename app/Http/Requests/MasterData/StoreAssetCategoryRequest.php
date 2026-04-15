<?php

namespace App\Http\Requests\MasterData;

use App\Services\OrganizationContext;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAssetCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $organizationId = app(OrganizationContext::class)->requireOrganizationId();

        return [
            'name' => ['required', 'string', 'max:255'],
            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('asset_categories', 'code')->where(fn ($query) => $query->where('organization_id', $organizationId)),
            ],
            'description' => ['nullable', 'string', 'max:255'],
            'parent_id' => [
                'nullable',
                'integer',
                Rule::exists('asset_categories', 'id')->where(fn ($query) => $query->where('organization_id', $organizationId)),
            ],
            'depreciation_method' => ['required', 'string', 'in:straight_line,diminishing'],
            'useful_life_months' => ['nullable', 'integer', 'min:1', 'max:6000'],
            'residual_value' => ['nullable', 'numeric', 'min:0'],
            'capex_opex_default' => ['nullable', 'string', 'max:50'],
        ];
    }
}
