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
        Schema::table('asset_depreciation_entries', function (Blueprint $table) {
            $table->foreign('run_id')
                ->references('id')
                ->on('asset_depreciation_runs')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('asset_depreciation_entries', function (Blueprint $table) {
            $table->dropForeign(['run_id']);
        });
    }
};
