<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('asset_movements', function (Blueprint $table) {
            $table->foreignId('from_branch_id')->nullable()->constrained('branches')->nullOnDelete();
            $table->foreignId('to_branch_id')->nullable()->constrained('branches')->nullOnDelete();

            $table->index(['organization_id', 'from_branch_id']);
            $table->index(['organization_id', 'to_branch_id']);
        });
    }

    public function down(): void
    {
        Schema::table('asset_movements', function (Blueprint $table) {
            $table->dropIndex(['organization_id', 'from_branch_id']);
            $table->dropIndex(['organization_id', 'to_branch_id']);
            $table->dropConstrainedForeignId('from_branch_id');
            $table->dropConstrainedForeignId('to_branch_id');
        });
    }
};
