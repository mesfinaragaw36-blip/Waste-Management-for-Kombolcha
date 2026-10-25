<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class WasteReport extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'resident_id',
        'waste_category_id',
        'title',
        'description',
        'photo_path',
        'location_description',
        'latitude',
        'longitude',
        'priority',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
        ];
    }

    public function resident(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resident_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(WasteCategory::class, 'waste_category_id');
    }

    public function statusHistories(): HasMany
    {
        return $this->hasMany(ReportStatusHistory::class);
    }

    public function collectionTask(): HasOne
    {
        return $this->hasOne(CollectionTask::class);
    }
}
