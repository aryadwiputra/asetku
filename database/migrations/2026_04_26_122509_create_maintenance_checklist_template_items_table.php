<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('maintenance_checklist_template_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_id')
                ->constrained('maintenance_checklist_templates')
                ->cascadeOnDelete();
            $table->string('title');
            $table->boolean('is_required')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['template_id', 'sort_order'], 'maintenance_checklist_template_items_template_sort_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenance_checklist_template_items');
    }
};
