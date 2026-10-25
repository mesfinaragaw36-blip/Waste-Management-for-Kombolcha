
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('collection_tasks', function (Blueprint $table) {
            $table->id();

            $table->foreignId('waste_report_id')
                ->constrained('waste_reports')
                ->restrictOnDelete();

            $table->foreignId('assigned_worker_id')
                ->constrained('users')
                ->restrictOnDelete();

            $table->foreignId('assigned_by')
                ->constrained('users')
                ->restrictOnDelete();

            $table->dateTime('scheduled_at')->nullable();
            $table->dateTime('started_at')->nullable();
            $table->dateTime('completed_at')->nullable();

            $table->enum('status', [
                'assigned',
                'accepted',
                'in_progress',
                'completed',
                'cancelled',
            ])->default('assigned')->index();

            $table->text('completion_notes')->nullable();
            $table->string('completion_photo_path')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('collection_tasks');
    }
};
