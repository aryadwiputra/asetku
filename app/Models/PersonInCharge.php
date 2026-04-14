<?php

namespace App\Models;

use App\Models\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PersonInCharge extends Model
{
    use BelongsToOrganization, HasFactory;

    protected $table = 'person_in_charges';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'notes',
    ];

    public function assets(): HasMany
    {
        return $this->hasMany(Asset::class, 'person_in_charge_id');
    }
}
