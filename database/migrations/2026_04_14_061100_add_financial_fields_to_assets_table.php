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
            $table->string('depreciation_method')->default('straight_line');
            $table->unsignedInteger('useful_life_months')->nullable();
            $table->decimal('residual_value', 15, 2)->nullable();
            $table->string('capex_opex')->nullable();
            $table->foreignId('vendor_contract_id')->nullable()->constrained('vendor_contracts')->nullOnDelete();
            $table->timestamp('warranty_reminder_sent_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('assets', function (Blueprint $table) {
            $table->dropConstrainedForeignId('vendor_contract_id');
            $table->dropColumn([
                'depreciation_method',
                'useful_life_months',
                'residual_value',
                'capex_opex',
                'warranty_reminder_sent_at',
            ]);
        });
    }
};
