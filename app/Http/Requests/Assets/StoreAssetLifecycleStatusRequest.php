<?php

namespace App\Http\Requests\Assets;

use App\Models\Asset;
use App\Services\AssetStatusTransitionResolver;
use App\Services\OrganizationContext;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class StoreAssetLifecycleStatusRequest extends FormRequest
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
            'asset_status_id' => [
                'nullable',
                'integer',
                Rule::exists('asset_statuses', 'id')->where(fn ($q) => $q->where('organization_id', $organizationId)),
            ],
            'performed_at' => ['nullable', 'date'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function after(): array
    {
        return [
            function ($validator): void {
                if ($validator->errors()->isNotEmpty()) {
                    return;
                }

                $asset = $this->route('asset');
                if (! $asset instanceof Asset) {
                    return;
                }

                $toStatusId = $this->filled('asset_status_id') ? (int) $this->input('asset_status_id') : null;

                try {
                    app(AssetStatusTransitionResolver::class)->ensureAllowed($asset, $toStatusId);
                } catch (ValidationException $exception) {
                    foreach ($exception->errors() as $key => $messages) {
                        foreach ($messages as $message) {
                            $validator->errors()->add($key, $message);
                        }
                    }
                }
            },
        ];
    }
}
