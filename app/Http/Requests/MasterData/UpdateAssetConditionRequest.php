<?php

namespace App\Http\Requests\MasterData;

use App\Models\AssetCondition;
use App\Services\OrganizationContext;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAssetConditionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $organizationId = app(OrganizationContext::class)->requireOrganizationId();

        /** @var AssetCondition $condition */
        $condition = $this->route('asset_condition');

        return [
            'name' => ['required', 'string', 'max:255'],
            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('asset_conditions', 'code')
                    ->ignore($condition->id)
                    ->where(fn ($query) => $query->where('organization_id', $organizationId)),
            ],
            'description' => ['nullable', 'string', 'max:255'],
        ];
    }
}
