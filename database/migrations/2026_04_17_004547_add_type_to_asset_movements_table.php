<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('asset_movements', function (Blueprint $table) {
            $table->string('type')->default('transfer')->after('asset_id');
            $table->index(['organization_id', 'type']);
        });

        DB::table('asset_movements')->whereNull('type')->update(['type' => 'transfer']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('asset_movements', function (Blueprint $table) {
            $table->dropIndex(['organization_id', 'type']);
            $table->dropColumn('type');
        });
    }
};
