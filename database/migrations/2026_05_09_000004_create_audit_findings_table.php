<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_findings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('organization_id');
            $table->foreign('organization_id')->references('id')->on('organizations')->cascadeOnDelete();
            $table->unsignedBigInteger('audit_schedule_id')->nullable();
            $table->foreign('audit_schedule_id')->references('id')->on('audit_schedules')->cascadeOnDelete();
            $table->unsignedBigInteger('asset_id');
            $table->foreign('asset_id')->references('id')->on('assets')->cascadeOnDelete();
            $table->unsignedBigInteger('auditor_id')->nullable();
            $table->foreign('auditor_id')->references('id')->on('users')->nullOnDelete();
            $table->unsignedBigInteger('current_location_id')->nullable();
            $table->foreign('current_location_id')->references('id')->on('asset_locations')->nullOnDelete();
            $table->unsignedBigInteger('expected_location_id')->nullable();
            $table->foreign('expected_location_id')->references('id')->on('asset_locations')->nullOnDelete();
            $table->unsignedBigInteger('current_condition_id')->nullable();
            $table->foreign('current_condition_id')->references('id')->on('asset_conditions')->nullOnDelete();
            $table->string('status')->default('matched');
            $table->text('notes')->nullable();
            $table->text('signature_data')->nullable();
            $table->timestamp('audited_at')->nullable();
            $table->string('approval_status')->default('pending');
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->foreign('approved_by')->references('id')->on('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->text('approval_notes')->nullable();
            $table->timestamps();

            $table->index(['organization_id', 'status']);
            $table->index(['audit_schedule_id', 'status']);
            $table->index(['asset_id']);
            $table->index(['auditor_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_findings');
    }
};
