<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReportStatusHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'waste_report_id',
        'changed_by',
        'old_status',
        'new_status',
        'notes',
    ];

    public function wasteReport(): BelongsTo
    {
        return $this->belongsTo(WasteReport::class);
    }

    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
