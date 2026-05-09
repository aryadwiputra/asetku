<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_schedule_auditors', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('audit_schedule_id');
            $table->foreign('audit_schedule_id')->references('id')->on('audit_schedules')->cascadeOnDelete();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['audit_schedule_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_schedule_auditors');
    }
};
