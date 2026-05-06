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
        Schema::table('vendor_contracts', function (Blueprint $table) {
            $table->foreignId('vendor_id')->nullable()->after('organization_id')->constrained('vendors')->nullOnDelete();
            $table->string('type')->default('maintenance')->after('vendor_id');
            $table->string('title')->nullable()->after('type');
            $table->string('status')->default('draft')->after('contract_number');
            $table->decimal('baseline_cost', 15, 2)->nullable()->after('status');
            $table->timestamp('expiry_reminder_sent_at')->nullable()->after('end_date');
            $table->text('terms')->nullable()->after('notes');

            $table->index(['organization_id', 'status']);
            $table->index(['organization_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vendor_contracts', function (Blueprint $table) {
            $table->dropIndex(['organization_id', 'status']);
            $table->dropIndex(['organization_id', 'type']);
            $table->dropConstrainedForeignId('vendor_id');
            $table->dropColumn([
                'type',
                'title',
                'status',
                'baseline_cost',
                'expiry_reminder_sent_at',
                'terms',
            ]);
        });
    }
};
