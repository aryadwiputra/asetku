<?php

namespace App\Http\Requests\Assets;

use App\Services\OrganizationContext;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BulkUpdateAssetStatusRequest extends FormRequest
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
            'asset_ids' => ['required', 'array', 'min:1'],
            'asset_ids.*' => [
                'required',
                'integer',
                Rule::exists('assets', 'id')->where(fn ($query) => $query->where('organization_id', $organizationId)),
            ],
            'asset_status_id' => [
                'nullable',
                'integer',
                Rule::exists('asset_statuses', 'id')->where(fn ($query) => $query->where('organization_id', $organizationId)),
            ],
            'performed_at' => ['nullable', 'date'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
