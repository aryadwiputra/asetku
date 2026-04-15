<?php

namespace App\Http\Requests\MasterData;

use App\Models\AssetLocation;
use App\Services\OrganizationContext;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAssetLocationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        /** @var AssetLocation $assetLocation */
        $assetLocation = $this->route('asset_location');

        $organizationId = app(OrganizationContext::class)->requireOrganizationId();

        return [
            'name' => ['required', 'string', 'max:255'],
            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('asset_locations', 'code')
                    ->ignore($assetLocation->id)
                    ->where(fn ($query) => $query->where('organization_id', $organizationId)),
            ],
            'description' => ['nullable', 'string', 'max:255'],
            'parent_id' => [
                'nullable',
                'integer',
                Rule::exists('asset_locations', 'id')->where(fn ($query) => $query->where('organization_id', $organizationId)),
                function (string $attribute, mixed $value, \Closure $fail) use ($assetLocation): void {
                    if ($value === null) {
                        return;
                    }

                    if ((int) $value === (int) $assetLocation->id) {
                        $fail('Parent location cannot be the same as the current location.');
                    }
                },
            ],
        ];
    }
}
