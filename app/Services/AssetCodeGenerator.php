<?php

namespace App\Services;

use App\Models\Asset;
use App\Models\AssetCodeSequence;
use App\Models\Branch;
use App\Models\Organization;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class AssetCodeGenerator
{
    public function generate(Branch $branch, ?int $year = null): string
    {
        $organizationId = app(OrganizationContext::class)->requireOrganizationId();

        if ((int) $branch->organization_id !== $organizationId) {
            throw new RuntimeException('Branch does not belong to the current organization.');
        }

        $organization = Organization::query()->findOrFail($organizationId);

        $year = $year ?? (int) now()->format('Y');

        return DB::transaction(function () use ($branch, $year, $organizationId, $organization): string {
            $sequence = AssetCodeSequence::query()
                ->where('organization_id', $organizationId)
                ->where('branch_id', $branch->id)
                ->where('year', $year)
                ->lockForUpdate()
                ->first();

            if ($sequence === null) {
                $sequence = AssetCodeSequence::query()->create([
                    'organization_id' => $organizationId,
                    'branch_id' => $branch->id,
                    'year' => $year,
                    'last_number' => 0,
                ]);
            }

            $next = (int) $sequence->last_number;

            do {
                $next++;

                $candidate = $this->formatCode(
                    format: (string) $organization->asset_code_format,
                    prefix: (string) $organization->asset_code_prefix,
                    branchCode: (string) $branch->code,
                    year: $year,
                    sequence: $next,
                );
            } while ($this->codeExists($organizationId, $candidate));

            $sequence->forceFill(['last_number' => $next])->save();

            return $candidate;
        });
    }

    private function codeExists(int $organizationId, string $code): bool
    {
        return Asset::query()
            ->withoutGlobalScopes()
            ->where('organization_id', $organizationId)
            ->where('code', $code)
            ->exists();
    }

    private function formatCode(string $format, string $prefix, string $branchCode, int $year, int $sequence): string
    {
        $result = str_replace(
            ['{PREFIX}', '{BRANCH}', '{YEAR}'],
            [$prefix, $branchCode, (string) $year],
            $format,
        );

        $result = preg_replace_callback('/\\{SEQ(\\d+)?\\}/', function (array $matches) use ($sequence): string {
            $pad = isset($matches[1]) ? (int) $matches[1] : 0;

            if ($pad <= 0) {
                return (string) $sequence;
            }

            return str_pad((string) $sequence, $pad, '0', STR_PAD_LEFT);
        }, $result) ?? $result;

        return $result;
    }
}
