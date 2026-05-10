<?php

namespace App\Models;

use App\Models\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AssetStatus extends Model
{
    use BelongsToOrganization, HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'code',
        'description',
    ];

    public function assets(): HasMany
    {
        return $this->hasMany(Asset::class, 'asset_status_id');
    }

    public function outgoingTransitions(): HasMany
    {
        return $this->hasMany(AssetStatusTransition::class, 'from_status_id');
    }

    public function incomingTransitions(): HasMany
    {
        return $this->hasMany(AssetStatusTransition::class, 'to_status_id');
    }
}
