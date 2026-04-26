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
        Schema::table('asset_maintenances', function (Blueprint $table) {
            $table->foreign('schedule_id')
                ->references('id')
                ->on('maintenance_schedules')
                ->nullOnDelete();

            $table->foreign('checklist_template_id')
                ->references('id')
                ->on('maintenance_checklist_templates')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('asset_maintenances', function (Blueprint $table) {
            $table->dropForeign(['schedule_id']);
            $table->dropForeign(['checklist_template_id']);
        });
    }
};
