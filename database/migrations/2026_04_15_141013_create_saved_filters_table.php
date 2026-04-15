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
        Schema::create('saved_filters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('entity')->default('assets');
            $table->string('name');
            $table->json('query');
            $table->boolean('is_default')->default(false);
            $table->timestamps();

            $table->unique(['organization_id', 'user_id', 'entity', 'name']);
            $table->index(['organization_id', 'user_id', 'entity']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('saved_filters');
    }
};
