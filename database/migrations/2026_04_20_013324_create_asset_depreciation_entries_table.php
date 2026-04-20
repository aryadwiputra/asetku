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
        Schema::create('asset_depreciation_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->foreignId('asset_id')->constrained('assets')->cascadeOnDelete();
            $table->foreignId('run_id')->nullable()->constrained('asset_depreciation_runs')->nullOnDelete();
            $table->date('period_start');
            $table->date('period_end');

            $table->decimal('cost', 15, 2)->nullable();
            $table->decimal('residual_value', 15, 2)->nullable();
            $table->string('method')->nullable();

            $table->decimal('book_value_start', 15, 2);
            $table->decimal('depreciation_amount', 15, 2);
            $table->decimal('accumulated_depreciation', 15, 2);
            $table->decimal('book_value_end', 15, 2);

            $table->decimal('units_in_period', 20, 4)->nullable();
            $table->decimal('units_total_estimate', 20, 4)->nullable();
            $table->string('units_unit', 30)->nullable();

            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['asset_id', 'period_end'], 'asset_depreciation_entries_asset_period_end_unique');
            $table->index(['organization_id', 'period_end'], 'asset_depreciation_entries_org_period_end_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asset_depreciation_entries');
    }
};
