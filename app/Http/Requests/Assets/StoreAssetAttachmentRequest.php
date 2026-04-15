<?php

namespace App\Http\Requests\Assets;

use App\Services\OrganizationContext;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAssetAttachmentRequest extends FormRequest
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

        return [
            'media_asset_id' => [
                'required',
                'integer',
                Rule::exists('media_assets', 'id')->where(fn ($query) => $query->where('organization_id', $organizationId)),
            ],
            'kind' => ['required', 'string', Rule::in(['photo', 'document'])],
            'is_primary' => ['nullable', 'boolean'],
        ];
    }
}
