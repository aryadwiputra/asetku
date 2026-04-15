<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private const INDEX = 'assets_fulltext_search';

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (! Schema::hasTable('assets')) {
            return;
        }

        $driver = Schema::getConnection()->getDriverName();
        if ($driver === 'sqlite') {
            return;
        }

        Schema::table('assets', function (Blueprint $table) {
            $table->fullText(['code', 'name', 'serial_number', 'brand', 'model'], self::INDEX);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasTable('assets')) {
            return;
        }

        $driver = Schema::getConnection()->getDriverName();
        if ($driver === 'sqlite') {
            return;
        }

        Schema::table('assets', function (Blueprint $table) {
            $table->dropIndex(self::INDEX);
        });
    }
};
