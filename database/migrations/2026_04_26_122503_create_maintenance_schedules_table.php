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
        Schema::create('maintenance_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->foreignId('asset_id')->constrained('assets')->cascadeOnDelete();

            $table->string('name');
            $table->unsignedInteger('interval_days');
            $table->date('next_due_at');

            $table->string('default_priority')->nullable();
            $table->unsignedInteger('default_sla_response_hours')->nullable();
            $table->unsignedInteger('default_sla_resolution_hours')->nullable();

            $table->unsignedBigInteger('checklist_template_id')->nullable();
            $table->string('required_skill')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['asset_id', 'name'], 'maintenance_schedules_asset_name_unique');
            $table->index(['organization_id', 'next_due_at', 'is_active'], 'maintenance_schedules_org_due_active_index');
            $table->index(['organization_id', 'required_skill'], 'maintenance_schedules_org_skill_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenance_schedules');
    }
};
