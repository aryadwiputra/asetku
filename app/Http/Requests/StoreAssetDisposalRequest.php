<?php

namespace App\Http\Requests;

use App\Services\OrganizationContext;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAssetDisposalRequest extends FormRequest
{
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
            'asset_id' => [
                'required',
                'integer',
                Rule::exists('assets', 'id')->where(fn ($q) => $q->where('organization_id', $organizationId)),
            ],
            'type' => ['required', 'string', Rule::in(['sale', 'scrap', 'donation', 'writeoff'])],
            'disposed_at' => ['nullable', 'date'],
            'reason' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
            'proceeds_amount' => ['nullable', 'numeric', 'min:0'],
            'fees_amount' => ['nullable', 'numeric', 'min:0'],
            'fair_value_amount' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
