<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('asset_categories', function (Blueprint $table) {
            $table->string('depreciation_method')->default('straight_line');
            $table->unsignedInteger('useful_life_months')->nullable();
            $table->decimal('residual_value', 15, 2)->nullable();
            $table->string('capex_opex_default')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('asset_categories', function (Blueprint $table) {
            $table->dropColumn([
                'depreciation_method',
                'useful_life_months',
                'residual_value',
                'capex_opex_default',
            ]);
        });
    }
};
