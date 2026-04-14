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
        Schema::table('asset_movements', function (Blueprint $table) {
            $table->foreignId('from_asset_user_id')->nullable()->constrained('asset_users')->nullOnDelete();
            $table->foreignId('to_asset_user_id')->nullable()->constrained('asset_users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('asset_movements', function (Blueprint $table) {
            $table->dropConstrainedForeignId('from_asset_user_id');
            $table->dropConstrainedForeignId('to_asset_user_id');
        });
    }
};
