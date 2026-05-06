<?php

namespace App\Services;

class AssetDepreciationCalculationResult
{
    public function __construct(
        public readonly bool $shouldPost,
        public readonly ?string $skipReason,
        public readonly ?float $bookValueStart,
        public readonly ?float $bookValueEnd,
        public readonly ?float $depreciationAmount,
        public readonly ?float $accumulatedDepreciation,
        public readonly ?float $unitsInPeriod,
        public readonly ?float $unitsTotalEstimate,
        public readonly ?string $unitsUnit,
    ) {}

    public static function skip(string $reason): self
    {
        return new self(
            shouldPost: false,
            skipReason: $reason,
            bookValueStart: null,
            bookValueEnd: null,
            depreciationAmount: null,
            accumulatedDepreciation: null,
            unitsInPeriod: null,
            unitsTotalEstimate: null,
            unitsUnit: null,
        );
    }

    public static function post(
        float $bookValueStart,
        float $bookValueEnd,
        float $depreciationAmount,
        float $accumulatedDepreciation,
        ?float $unitsInPeriod = null,
        ?float $unitsTotalEstimate = null,
        ?string $unitsUnit = null,
    ): self {
        return new self(
            shouldPost: true,
            skipReason: null,
            bookValueStart: $bookValueStart,
            bookValueEnd: $bookValueEnd,
            depreciationAmount: $depreciationAmount,
            accumulatedDepreciation: $accumulatedDepreciation,
            unitsInPeriod: $unitsInPeriod,
            unitsTotalEstimate: $unitsTotalEstimate,
            unitsUnit: $unitsUnit,
        );
    }
}

