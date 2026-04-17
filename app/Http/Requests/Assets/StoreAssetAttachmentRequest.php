<?php

namespace App\Http\Requests\Assets;

use App\Services\OrganizationContext;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAssetAttachmentRequest extends FormRequest
{
    /**
     * @return list<string>
     */
    public static function allowedStages(): array
    {
        return [
            'acquisition',
            'receiving',
            'placement',
            'usage',
            'maintenance',
            'mutation',
            'disposal',
        ];
    }

    /**
     * @return list<string>
     */
    public static function allowedDocumentTypes(): array
    {
        return [
            'invoice',
            'po',
            'bast',
            'receipt',
            'work_order',
            'service_report',
            'assignment_letter',
            'loan_form',
            'disposal_report',
            'sale_proof',
            'other',
        ];
    }

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
            'stage' => ['nullable', 'string', Rule::in(self::allowedStages())],
            'document_type' => [
                'nullable',
                'string',
                Rule::requiredIf(fn () => $this->input('kind') === 'document'),
                Rule::in(self::allowedDocumentTypes()),
            ],
        ];
    }
}
