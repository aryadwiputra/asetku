<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('asset_maintenances', function (Blueprint $table) {
            $table->foreignId('asset_status_before_maintenance_id')
                ->nullable()
                ->after('asset_id')
                ->constrained('asset_statuses')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('asset_maintenances', function (Blueprint $table) {
            $table->dropConstrainedForeignId('asset_status_before_maintenance_id');
        });
    }
};
