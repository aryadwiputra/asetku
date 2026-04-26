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
            $table->string('type')->default('corrective')->after('asset_id');
            $table->string('source')->default('manual')->after('type');
            $table->string('priority')->default('normal')->after('source');

            $table->foreignId('branch_id')->nullable()->after('priority')->constrained('branches')->nullOnDelete();

            $table->foreignId('assigned_to')->nullable()->after('branch_id')->constrained('users')->nullOnDelete();
            $table->timestamp('assigned_at')->nullable()->after('assigned_to');

            $table->timestamp('acknowledged_at')->nullable()->after('assigned_at');
            $table->timestamp('started_at')->nullable()->after('acknowledged_at');
            $table->timestamp('completed_at')->nullable()->after('started_at');
            $table->timestamp('cancelled_at')->nullable()->after('completed_at');

            $table->unsignedTinyInteger('progress_percent')->default(0)->after('cancelled_at');

            $table->timestamp('response_due_at')->nullable()->after('sla_resolution_hours');
            $table->timestamp('resolution_due_at')->nullable()->after('response_due_at');
            $table->unsignedInteger('escalation_level')->default(0)->after('resolution_due_at');
            $table->timestamp('last_escalated_at')->nullable()->after('escalation_level');
            $table->timestamp('escalated_at')->nullable()->after('last_escalated_at');

            $table->unsignedBigInteger('schedule_id')->nullable()->after('escalated_at');
            $table->unsignedBigInteger('checklist_template_id')->nullable()->after('schedule_id');

            $table->text('internal_notes')->nullable()->after('notes');

            $table->index(['organization_id', 'status'], 'asset_maintenances_org_status_index');
            $table->index(['organization_id', 'branch_id'], 'asset_maintenances_org_branch_index');
            $table->index(['organization_id', 'assigned_to'], 'asset_maintenances_org_assigned_to_index');
            $table->index(['organization_id', 'response_due_at'], 'asset_maintenances_org_response_due_index');
            $table->index(['organization_id', 'resolution_due_at'], 'asset_maintenances_org_resolution_due_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('asset_maintenances', function (Blueprint $table) {
            $table->dropIndex('asset_maintenances_org_status_index');
            $table->dropIndex('asset_maintenances_org_branch_index');
            $table->dropIndex('asset_maintenances_org_assigned_to_index');
            $table->dropIndex('asset_maintenances_org_response_due_index');
            $table->dropIndex('asset_maintenances_org_resolution_due_index');

            $table->dropConstrainedForeignId('branch_id');
            $table->dropConstrainedForeignId('assigned_to');

            $table->dropColumn([
                'type',
                'source',
                'priority',
                'assigned_at',
                'acknowledged_at',
                'started_at',
                'completed_at',
                'cancelled_at',
                'progress_percent',
                'response_due_at',
                'resolution_due_at',
                'escalation_level',
                'last_escalated_at',
                'escalated_at',
                'schedule_id',
                'checklist_template_id',
                'internal_notes',
            ]);
        });
    }
};
