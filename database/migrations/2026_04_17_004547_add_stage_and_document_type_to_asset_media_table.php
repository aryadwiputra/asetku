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
        Schema::table('asset_media', function (Blueprint $table) {
            $table->string('stage')->nullable()->after('kind');
            $table->string('document_type')->nullable()->after('stage');

            $table->index(['asset_id', 'kind', 'stage']);
            $table->index(['asset_id', 'kind', 'document_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('asset_media', function (Blueprint $table) {
            $table->dropIndex(['asset_id', 'kind', 'stage']);
            $table->dropIndex(['asset_id', 'kind', 'document_type']);
            $table->dropColumn(['stage', 'document_type']);
        });
    }
};
