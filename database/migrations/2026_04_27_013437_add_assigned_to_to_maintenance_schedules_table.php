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
        Schema::table('maintenance_schedules', function (Blueprint $table) {
            $table->foreignId('assigned_to')
                ->nullable()
                ->after('required_skill')
                ->constrained('users')
                ->nullOnDelete();

            $table->text('notes')->nullable()->after('assigned_to');

            $table->index(['organization_id', 'assigned_to'], 'maintenance_schedules_org_assigned_to_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('maintenance_schedules', function (Blueprint $table) {
            $table->dropIndex('maintenance_schedules_org_assigned_to_index');
            $table->dropConstrainedForeignId('assigned_to');
            $table->dropColumn('notes');
        });
    }
};
