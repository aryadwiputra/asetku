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
        Schema::table('asset_maintenances', function (Blueprint $table) {
            $table->foreignId('vendor_id')->nullable()->after('asset_id')->constrained('vendors')->nullOnDelete();
            $table->foreignId('vendor_contract_id')->nullable()->after('vendor_id')->constrained('vendor_contracts')->nullOnDelete();
            $table->unsignedTinyInteger('speed_rating')->nullable()->after('sla_resolution_hours');
            $table->unsignedTinyInteger('quality_rating')->nullable()->after('speed_rating');
            $table->unsignedTinyInteger('price_rating')->nullable()->after('quality_rating');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('asset_maintenances', function (Blueprint $table) {
            $table->dropConstrainedForeignId('vendor_id');
            $table->dropConstrainedForeignId('vendor_contract_id');
            $table->dropColumn(['speed_rating', 'quality_rating', 'price_rating']);
        });
    }
};
