<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('asset_disposals', function (Blueprint $table) {
            $table->string('type')->default('writeoff')->after('asset_id')->index();

            $table->string('currency_code', 3)->nullable()->after('notes');
            $table->decimal('proceeds_amount', 15, 2)->nullable()->after('currency_code');
            $table->decimal('fees_amount', 15, 2)->nullable()->after('proceeds_amount');
            $table->decimal('fair_value_amount', 15, 2)->nullable()->after('fees_amount');
            $table->decimal('net_proceeds_amount', 15, 2)->nullable()->after('fair_value_amount');
            $table->decimal('book_value_at_disposal', 15, 2)->nullable()->after('net_proceeds_amount');
            $table->decimal('gain_loss_amount', 15, 2)->nullable()->after('book_value_at_disposal');

            $table->timestamp('executed_at')->nullable()->after('disposed_at');
        });

        // Align default status with workflow-based approval (without requiring doctrine/dbal).
        // Existing rows (if any) that were implicitly "approved" should be treated as pending
        // until explicitly approved/executed via the new disposal module.
        try {
            DB::statement("ALTER TABLE `asset_disposals` ALTER COLUMN `status` SET DEFAULT 'pending'");
            DB::table('asset_disposals')
                ->where('status', 'approved')
                ->update(['status' => 'pending']);
        } catch (Throwable) {
            // Ignore if the driver doesn't support altering defaults this way.
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('asset_disposals', function (Blueprint $table) {
            $table->dropColumn([
                'type',
                'currency_code',
                'proceeds_amount',
                'fees_amount',
                'fair_value_amount',
                'net_proceeds_amount',
                'book_value_at_disposal',
                'gain_loss_amount',
                'executed_at',
            ]);
        });

        try {
            DB::statement("ALTER TABLE `asset_disposals` ALTER COLUMN `status` SET DEFAULT 'approved'");
        } catch (Throwable) {
            // Ignore if the driver doesn't support altering defaults this way.
        }
    }
};
