
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('waste_reports', function (Blueprint $table) {
            $table->id();

            $table->foreignId('resident_id')
                ->constrained('users')
                ->restrictOnDelete();

            $table->foreignId('waste_category_id')
                ->constrained('waste_categories')
                ->restrictOnDelete();

            $table->string('title');
            $table->text('description');
            $table->string('photo_path')->nullable();
            $table->string('location_description');
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();

            $table->enum('priority', ['low', 'medium', 'high'])
                ->default('medium');

            $table->enum('status', [
                'pending',
                'under_review',
                'approved',
                'assigned',
                'in_progress',
                'resolved',
                'rejected',
            ])->default('pending')->index();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('waste_reports');
    }
};
