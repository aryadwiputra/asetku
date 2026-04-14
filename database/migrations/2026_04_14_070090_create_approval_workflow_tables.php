<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('approval_workflows', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->string('type');
            $table->string('name');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['organization_id', 'type', 'is_active']);
        });

        Schema::create('approval_workflow_steps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workflow_id')->constrained('approval_workflows')->cascadeOnDelete();
            $table->unsignedTinyInteger('step_number');
            $table->string('approver_kind'); // role|user
            $table->string('approver_reference'); // role name or user_id string
            $table->boolean('is_required')->default(true);
            $table->timestamps();

            $table->unique(['workflow_id', 'step_number']);
        });

        Schema::create('approval_request_steps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('approval_request_id')->constrained('asset_approval_requests')->cascadeOnDelete();
            $table->unsignedTinyInteger('step_number');
            $table->string('status')->default('pending'); // pending|approved|rejected
            $table->foreignId('decided_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('decided_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['approval_request_id', 'step_number']);
            $table->index(['approval_request_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('approval_request_steps');
        Schema::dropIfExists('approval_workflow_steps');
        Schema::dropIfExists('approval_workflows');
    }
};
