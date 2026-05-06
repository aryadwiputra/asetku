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
        Schema::create('calendar_feeds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('type')->default('maintenance');
            $table->string('token_hash', 64);
            $table->timestamp('last_used_at')->nullable();
            $table->timestamps();

            $table->unique(['organization_id', 'user_id', 'type'], 'calendar_feeds_unique');
            $table->index(['organization_id', 'type'], 'calendar_feeds_org_type_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('calendar_feeds');
    }
};
