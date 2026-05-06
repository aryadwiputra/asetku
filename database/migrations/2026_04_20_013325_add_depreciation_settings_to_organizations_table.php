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
        Schema::table('organizations', function (Blueprint $table) {
            $table->string('depreciation_frequency')->default('monthly')->after('fiscal_year_start_day');
            $table->boolean('depreciation_auto_run_enabled')->default(true)->after('depreciation_frequency');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('organizations', function (Blueprint $table) {
            $table->dropColumn(['depreciation_frequency', 'depreciation_auto_run_enabled']);
        });
    }
};
