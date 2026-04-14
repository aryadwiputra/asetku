<?php

namespace App\Services;

use RuntimeException;

class OrganizationContext
{
    private ?int $currentOrganizationId = null;

    public function currentOrganizationId(): ?int
    {
        return $this->currentOrganizationId;
    }

    public function setCurrentOrganizationId(?int $organizationId): void
    {
        $this->currentOrganizationId = $organizationId;
    }

    public function requireOrganizationId(): int
    {
        if ($this->currentOrganizationId === null) {
            throw new RuntimeException('Current organization is not set.');
        }

        return $this->currentOrganizationId;
    }
}
