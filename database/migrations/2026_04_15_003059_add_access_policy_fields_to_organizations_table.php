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
            $table->json('access_ip_allowlist')->nullable()->after('timezone');
            $table->json('access_working_hours')->nullable()->after('access_ip_allowlist');
            $table->string('access_timezone')->nullable()->after('access_working_hours');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('organizations', function (Blueprint $table) {
            $table->dropColumn(['access_ip_allowlist', 'access_working_hours', 'access_timezone']);
        });
    }
};
