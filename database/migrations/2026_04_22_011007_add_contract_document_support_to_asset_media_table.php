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
        Schema::table('media_assets', function (Blueprint $table) {
            $table->foreignId('vendor_contract_id')->nullable()->after('organization_id')->constrained('vendor_contracts')->cascadeOnDelete();
            $table->index(['vendor_contract_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('media_assets', function (Blueprint $table) {
            $table->dropIndex(['vendor_contract_id', 'created_at']);
            $table->dropConstrainedForeignId('vendor_contract_id');
        });
    }
};
