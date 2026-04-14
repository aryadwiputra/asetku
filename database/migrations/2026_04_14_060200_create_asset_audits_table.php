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
        Schema::create('asset_audits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->foreignId('asset_id')->constrained('assets')->cascadeOnDelete();
            $table->string('status')->default('matched');
            $table->text('notes')->nullable();
            $table->foreignId('audited_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('audited_at')->nullable();
            $table->foreignId('location_id')->nullable()->constrained('asset_locations')->nullOnDelete();
            $table->timestamps();

            $table->index('organization_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asset_audits');
    }
};
