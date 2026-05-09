<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_schedule_assets', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('audit_schedule_id');
            $table->foreign('audit_schedule_id')->references('id')->on('audit_schedules')->cascadeOnDelete();
            $table->unsignedBigInteger('asset_id');
            $table->foreign('asset_id')->references('id')->on('assets')->cascadeOnDelete();
            $table->string('status')->default('pending');
            $table->timestamp('completed_at')->nullable();
            $table->unsignedBigInteger('completed_by')->nullable();
            $table->foreign('completed_by')->references('id')->on('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['audit_schedule_id', 'asset_id']);
            $table->index(['audit_schedule_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_schedule_assets');
    }
};
