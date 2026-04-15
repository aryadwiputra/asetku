<?php

namespace App\Http\Requests\MasterData;

use App\Services\OrganizationContext;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAssetConditionRequest extends FormRequest
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
                Rule::unique('asset_conditions', 'code')->where(fn ($query) => $query->where('organization_id', $organizationId)),
            ],
            'description' => ['nullable', 'string', 'max:255'],
        ];
    }
}
