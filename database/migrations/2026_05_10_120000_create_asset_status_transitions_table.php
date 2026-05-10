<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('asset_status_transitions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignId('from_status_id')->nullable()->constrained('asset_statuses')->nullOnDelete();
            $table->foreignId('to_status_id')->constrained('asset_statuses')->cascadeOnDelete();
            $table->string('transition_type', 20)->default('allowed');
            $table->string('reason')->nullable();
            $table->timestamps();

            $table->index(['organization_id', 'from_status_id', 'to_status_id'], 'asset_status_transitions_lookup_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asset_status_transitions');
    }
};
