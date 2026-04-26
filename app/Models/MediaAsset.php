<?php

namespace App\Models;

use App\Models\Concerns\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class MediaAsset extends Model implements HasMedia
{
    use BelongsToOrganization, InteractsWithMedia, LogsActivity;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'vendor_contract_id',
        'uploaded_by',
    ];

    public function uploadedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function vendorContract(): BelongsTo
    {
        return $this->belongsTo(VendorContract::class);
    }

    /**
     * Get the activity log options for this model.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->useLogName('media')
            ->logOnly(['title', 'uploaded_by', 'vendor_contract_id'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    public function getDescriptionForEvent(string $eventName): string
    {
        return "{$eventName} media";
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('file')->singleFile();
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        if (! $media || ! is_string($media->mime_type) || ! str_starts_with($media->mime_type, 'image/')) {
            return;
        }

        $this->addMediaConversion('thumb')
            ->fit(Fit::Crop, 320, 320)
            ->format('webp')
            ->quality(80)
            ->nonQueued();

        $this->addMediaConversion('webp')
            ->format('webp')
            ->quality(85)
            ->nonQueued();
    }
}
