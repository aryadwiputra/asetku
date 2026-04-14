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
            $table->string('rfid_tag')->nullable()->unique();
            $table->string('nfc_tag')->nullable()->unique();
            $table->string('label_template')->nullable();
            $table->boolean('is_consumable')->default(false);
            $table->unsignedInteger('quantity')->default(1);
            $table->unsignedInteger('available_quantity')->nullable();
            $table->boolean('is_pool')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('assets', function (Blueprint $table) {
            $table->dropColumn([
                'rfid_tag',
                'nfc_tag',
                'label_template',
                'is_consumable',
                'quantity',
                'available_quantity',
                'is_pool',
            ]);
        });
    }
};
