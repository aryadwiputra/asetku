<?php

namespace App\Imports;

use App\Models\Branch;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class BranchesImport implements ToCollection, WithHeadingRow
{
    /**
     * @param  Collection<int, array<string, mixed>>  $rows
     */
    public function collection(Collection $rows): void
    {
        foreach ($rows as $index => $row) {
            $code = isset($row['code']) ? trim((string) $row['code']) : '';
            $name = isset($row['name']) ? trim((string) $row['name']) : '';

            if ($code === '' || $name === '') {
                continue;
            }

            Branch::query()->updateOrCreate(
                ['code' => $code],
                [
                    'name' => $name,
                    'address' => isset($row['address']) ? trim((string) $row['address']) : null,
                    'pic_name' => isset($row['pic_name']) ? trim((string) $row['pic_name']) : null,
                    'pic_email' => isset($row['pic_email']) ? trim((string) $row['pic_email']) : null,
                    'pic_phone' => isset($row['pic_phone']) ? trim((string) $row['pic_phone']) : null,
                    'latitude' => isset($row['latitude']) && $row['latitude'] !== '' ? (float) $row['latitude'] : null,
                    'longitude' => isset($row['longitude']) && $row['longitude'] !== '' ? (float) $row['longitude'] : null,
                    'is_active' => isset($row['is_active']) ? (bool) $row['is_active'] : true,
                ],
            );
        }
    }
}
