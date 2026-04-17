<?php

namespace App\Http\Requests\Assets;

use App\Services\OrganizationContext;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreAssetMovementRequest extends FormRequest
{
    /**
     * @return list<string>
     */
    public static function allowedMovementTypes(): array
    {
        return ['placement', 'transfer', 'borrow', 'return'];
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
            'type' => ['required', 'string', Rule::in(self::allowedMovementTypes())],
            'performed_at' => ['nullable', 'date'],
            'notes' => ['nullable', 'string', 'max:2000'],

            'to_branch_id' => [
                'nullable',
                'integer',
                Rule::exists('branches', 'id')->where(fn ($q) => $q->where('organization_id', $organizationId)),
            ],
            'to_department_id' => [
                'nullable',
                'integer',
                Rule::exists('departments', 'id')->where(fn ($q) => $q->where('organization_id', $organizationId)),
            ],
            'to_location_id' => [
                'nullable',
                'integer',
                Rule::exists('asset_locations', 'id')->where(fn ($q) => $q->where('organization_id', $organizationId)),
            ],
            'to_asset_user_id' => [
                'nullable',
                'integer',
                Rule::exists('asset_users', 'id')->where(fn ($q) => $q->where('organization_id', $organizationId)),
            ],

            // Optional attachment for movement evidence (BAST / loan form)
            'media_asset_id' => [
                'nullable',
                'integer',
                Rule::exists('media_assets', 'id')->where(fn ($q) => $q->where('organization_id', $organizationId)),
            ],
            'stage' => ['nullable', 'string', Rule::in(StoreAssetAttachmentRequest::allowedStages())],
            'document_type' => ['nullable', 'string', Rule::in(StoreAssetAttachmentRequest::allowedDocumentTypes())],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $type = $this->string('type')->toString();

                $hasAnyDestination = $this->filled('to_branch_id')
                    || $this->filled('to_department_id')
                    || $this->filled('to_location_id')
                    || $this->filled('to_asset_user_id');

                if (in_array($type, ['placement', 'transfer'], true) && ! $hasAnyDestination) {
                    $validator->errors()->add('type', __('assets.lifecycle.validation.destination_required'));
                }

                if ($type === 'borrow' && ! $this->filled('to_asset_user_id')) {
                    $validator->errors()->add('to_asset_user_id', __('assets.lifecycle.validation.borrow_requires_user'));
                }
            },
        ];
    }
}
