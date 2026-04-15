<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class AssetsImport implements ToCollection, WithHeadingRow
{
    /**
     * @var Collection<int, array<string, mixed>>
     */
    public Collection $rows;

    public function __construct()
    {
        $this->rows = collect();
    }

    /**
     * @param  Collection<int, array<string, mixed>>  $collection
     */
    public function collection(Collection $collection): void
    {
        $this->rows = $collection;
    }
}
