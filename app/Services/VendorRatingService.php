<?php

namespace App\Services;

use App\Models\Vendor;

class VendorRatingService
{
    /**
     * @return array{speed:float|null,quality:float|null,price:float|null,total:float|null}
     */
    public function summarize(Vendor $vendor): array
    {
        $aggregate = $vendor->maintenanceRecords()
            ->selectRaw('AVG(speed_rating) as speed, AVG(quality_rating) as quality, AVG(price_rating) as price')
            ->first();

        $speed = $aggregate?->speed !== null ? round((float) $aggregate->speed, 2) : null;
        $quality = $aggregate?->quality !== null ? round((float) $aggregate->quality, 2) : null;
        $price = $aggregate?->price !== null ? round((float) $aggregate->price, 2) : null;

        $values = array_values(array_filter([$speed, $quality, $price], fn ($value) => $value !== null));
        $total = $values !== [] ? round(array_sum($values) / count($values), 2) : null;

        return [
            'speed' => $speed,
            'quality' => $quality,
            'price' => $price,
            'total' => $total,
        ];
    }
}
