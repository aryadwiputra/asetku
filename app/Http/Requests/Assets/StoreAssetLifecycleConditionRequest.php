<?php

namespace App\Http\Requests\Assets;

use App\Services\OrganizationContext;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAssetLifecycleConditionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $organizationId = app(OrganizationContext::class)->requireOrganizationId();

        return [
            'asset_condition_id' => [
                'nullable',
                'integer',
                Rule::exists('asset_conditions', 'id')->where(fn ($q) => $q->where('organization_id', $organizationId)),
            ],
            'performed_at' => ['nullable', 'date'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}

