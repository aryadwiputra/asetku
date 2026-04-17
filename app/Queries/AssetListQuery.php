<?php

namespace App\Queries;

use App\Models\Asset;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Throwable;

class AssetListQuery
{
    /**
     * @param  array<string, string>  $filters
     */
    public static function build(?User $user, ?string $search, array $filters): Builder
    {
        return self::buildBase($user, $search, $filters)
            ->with([
                'branch:id,name,code',
                'department:id,name,code,branch_id',
                'status:id,name,code',
                'condition:id,name,code',
                'category:id,name,code,parent_id',
                'location:id,name,code,branch_id,parent_id',
                'personInCharge:id,name',
                'user:id,name',
            ]);
    }

    /**
     * @param  array<string, string>  $filters
     */
    public static function buildBase(?User $user, ?string $search, array $filters): Builder
    {
        $query = Asset::query()->forUser($user);

        $search = is_string($search) ? trim($search) : '';
        if ($search !== '') {
            $query->where(function (Builder $q) use ($search): void {
                $driver = $q->getQuery()->getConnection()->getDriverName();

                if (in_array($driver, ['mysql', 'mariadb'], true)) {
                    try {
                        $q->whereFullText(['code', 'name', 'serial_number', 'brand', 'model'], $search);

                        return;
                    } catch (Throwable) {
                        // Fallback to LIKE for engines that don't support FULLTEXT or when index is missing.
                    }
                }

                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('serial_number', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%")
                    ->orWhere('model', 'like', "%{$search}%");

            });
        }

        self::applyFilters($query, $filters);

        return $query;
    }

    /**
     * @param  array<string, string>  $filters
     */
    private static function applyFilters(Builder $query, array $filters): void
    {
        $query->when(self::intFilter($filters, 'branch_id'), fn (Builder $q, int $id) => $q->where('branch_id', $id));
        $query->when(self::intFilter($filters, 'department_id'), fn (Builder $q, int $id) => $q->where('department_id', $id));
        $query->when(self::intFilter($filters, 'asset_category_id'), fn (Builder $q, int $id) => $q->where('asset_category_id', $id));
        $query->when(self::intFilter($filters, 'asset_location_id'), fn (Builder $q, int $id) => $q->where('asset_location_id', $id));
        $query->when(self::intFilter($filters, 'asset_status_id'), fn (Builder $q, int $id) => $q->where('asset_status_id', $id));
        $query->when(self::intFilter($filters, 'asset_condition_id'), fn (Builder $q, int $id) => $q->where('asset_condition_id', $id));
        $query->when(self::intFilter($filters, 'person_in_charge_id'), fn (Builder $q, int $id) => $q->where('person_in_charge_id', $id));
        $query->when(self::intFilter($filters, 'asset_user_id'), fn (Builder $q, int $id) => $q->where('asset_user_id', $id));

        $costMin = self::decimalFilter($filters, 'cost_min');
        $costMax = self::decimalFilter($filters, 'cost_max');

        if ($costMin !== null) {
            $query->where('cost', '>=', $costMin);
        }
        if ($costMax !== null) {
            $query->where('cost', '<=', $costMax);
        }
    }

    /**
     * @param  array<string, string>  $filters
     */
    private static function intFilter(array $filters, string $key): ?int
    {
        $value = $filters[$key] ?? null;

        if (! is_string($value) || $value === '') {
            return null;
        }

        if (! ctype_digit($value)) {
            return null;
        }

        $int = (int) $value;

        return $int > 0 ? $int : null;
    }

    /**
     * @param  array<string, string>  $filters
     */
    private static function decimalFilter(array $filters, string $key): ?float
    {
        $value = $filters[$key] ?? null;

        if (! is_string($value) || trim($value) === '') {
            return null;
        }

        if (! is_numeric($value)) {
            return null;
        }

        return max(0, (float) $value);
    }
}
