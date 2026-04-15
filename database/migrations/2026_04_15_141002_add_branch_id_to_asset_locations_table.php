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
        Schema::table('asset_locations', function (Blueprint $table) {
            $table->foreignId('branch_id')->after('organization_id')->constrained('branches')->cascadeOnDelete();
            $table->string('type', 20)->nullable()->after('branch_id');

            $table->index(['organization_id', 'branch_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('asset_locations', function (Blueprint $table) {
            $table->dropIndex(['organization_id', 'branch_id']);
            $table->dropConstrainedForeignId('branch_id');
            $table->dropColumn('type');
        });
    }
};
