<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskStatusHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'collection_task_id',
        'changed_by',
        'old_status',
        'new_status',
        'notes',
    ];

    public function collectionTask(): BelongsTo
    {
        return $this->belongsTo(CollectionTask::class);
    }

    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
