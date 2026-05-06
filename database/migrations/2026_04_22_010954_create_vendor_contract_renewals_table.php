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
        Schema::create('vendor_contract_renewals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->foreignId('vendor_contract_id')->constrained('vendor_contracts')->cascadeOnDelete();
            $table->foreignId('renewed_contract_id')->nullable()->constrained('vendor_contracts')->nullOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->json('previous_snapshot');
            $table->json('renewal_snapshot');
            $table->json('field_differences')->nullable();
            $table->string('status')->default('draft');
            $table->timestamp('activated_at')->nullable();
            $table->timestamps();

            $table->index(['organization_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendor_contract_renewals');
    }
};
