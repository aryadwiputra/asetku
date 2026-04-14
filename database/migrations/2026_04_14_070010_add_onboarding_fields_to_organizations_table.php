<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('organizations', function (Blueprint $table) {
            $table->foreignId('organization_group_id')->nullable()->constrained('organization_groups')->nullOnDelete();
            $table->foreignId('logo_media_id')->nullable()->constrained('media_assets')->nullOnDelete();
            $table->text('address')->nullable();
            $table->string('npwp')->nullable();
            $table->string('industry')->nullable();

            $table->string('plan')->default('Free');
            $table->timestamp('plan_started_at')->nullable();

            $table->string('currency_code', 3)->default('IDR');
            $table->string('timezone')->default('Asia/Jakarta');

            $table->boolean('is_active')->default(true);
            $table->timestamp('deactivated_at')->nullable();

            $table->string('asset_code_prefix')->default('AST');
            $table->string('asset_code_format')->default('{PREFIX}-{BRANCH}-{YEAR}-{SEQ4}');

            $table->unsignedTinyInteger('maintenance_warning_percent')->default(80);
            $table->unsignedTinyInteger('fiscal_year_start_month')->default(1);
            $table->unsignedTinyInteger('fiscal_year_start_day')->default(1);

            $table->index('organization_group_id');
            $table->index('logo_media_id');
        });
    }

    public function down(): void
    {
        Schema::table('organizations', function (Blueprint $table) {
            $table->dropIndex(['organization_group_id']);
            $table->dropIndex(['logo_media_id']);

            $table->dropConstrainedForeignId('organization_group_id');
            $table->dropConstrainedForeignId('logo_media_id');

            $table->dropColumn([
                'address',
                'npwp',
                'industry',
                'plan',
                'plan_started_at',
                'currency_code',
                'timezone',
                'is_active',
                'deactivated_at',
                'asset_code_prefix',
                'asset_code_format',
                'maintenance_warning_percent',
                'fiscal_year_start_month',
                'fiscal_year_start_day',
            ]);
        });
    }
};
