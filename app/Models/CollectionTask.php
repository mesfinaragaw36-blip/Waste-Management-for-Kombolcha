<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CollectionTask extends Model
{
    use HasFactory;

    protected $fillable = [
        'waste_report_id',
        'assigned_worker_id',
        'assigned_by',
        'scheduled_at',
        'started_at',
        'completed_at',
        'status',
        'completion_notes',
        'completion_photo_path',
    ];

    protected function casts(): array
    {
        return [
            'scheduled_at' => 'datetime',
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function wasteReport(): BelongsTo
    {
        return $this->belongsTo(WasteReport::class);
    }

    public function assignedWorker(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_worker_id');
    }

    public function assignedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }

    public function statusHistories(): HasMany
    {
        return $this->hasMany(TaskStatusHistory::class);
    }
}
