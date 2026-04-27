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
        Schema::create('maintenance_schedule_reminders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->foreignId('schedule_id')->constrained('maintenance_schedules')->cascadeOnDelete();
            $table->unsignedSmallInteger('days_before');
            $table->date('target_due_date');
            $table->timestamp('sent_at');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['schedule_id', 'days_before', 'target_due_date'], 'maintenance_schedule_reminders_unique');
            $table->index(['organization_id', 'target_due_date'], 'maintenance_schedule_reminders_org_due_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenance_schedule_reminders');
    }
};
