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
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone_number')->nullable()->after('email');
            $table->timestamp('phone_verified_at')->nullable()->after('phone_number');
            $table->timestamp('last_two_factor_sms_sent_at')->nullable()->after('two_factor_confirmed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone_number', 'phone_verified_at', 'last_two_factor_sms_sent_at']);
        });
    }
};
