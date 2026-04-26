<?php

namespace App\Http\Requests;

use App\Services\OrganizationContext;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMaintenanceChecklistRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $organizationId = app(OrganizationContext::class)->requireOrganizationId();

        return [
            'name' => ['required', 'string', 'max:255'],
            'asset_category_id' => [
                'nullable',
                'integer',
                Rule::exists('asset_categories', 'id')->where('organization_id', $organizationId),
            ],
            'is_active' => ['nullable', 'boolean'],
            'required_skill' => ['nullable', 'string', 'max:100'],
            'items' => ['array'],
            'items.*.id' => ['nullable', 'integer'],
            'items.*.title' => ['required', 'string', 'max:255'],
            'items.*.is_required' => ['nullable', 'boolean'],
            'items.*.sort_order' => ['nullable', 'integer', 'min:0', 'max:1000'],
        ];
    }
}
