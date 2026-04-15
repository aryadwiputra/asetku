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
        Schema::table('assets', function (Blueprint $table) {
            $table->foreignId('branch_id')->nullable()->after('organization_id')->constrained('branches')->nullOnDelete();
            $table->foreignId('asset_condition_id')->nullable()->after('asset_status_id')->constrained('asset_conditions')->nullOnDelete();

            $table->string('brand')->nullable()->after('name');
            $table->string('model')->nullable()->after('brand');
            $table->string('series')->nullable()->after('model');
            $table->string('imei')->nullable()->after('serial_number');

            $table->decimal('latitude', 10, 7)->nullable()->after('metadata');
            $table->decimal('longitude', 10, 7)->nullable()->after('latitude');

            $table->decimal('book_value_cached', 15, 2)->nullable()->after('residual_value');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('assets', function (Blueprint $table) {
            $table->dropConstrainedForeignId('branch_id');
            $table->dropConstrainedForeignId('asset_condition_id');

            $table->dropColumn([
                'brand',
                'model',
                'series',
                'imei',
                'latitude',
                'longitude',
                'book_value_cached',
            ]);
        });
    }
};
