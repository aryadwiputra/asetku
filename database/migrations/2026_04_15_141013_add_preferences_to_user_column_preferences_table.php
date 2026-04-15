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
        Schema::table('user_column_preferences', function (Blueprint $table) {
            $table->unsignedInteger('per_page')->nullable()->after('visible_columns');
            $table->string('sort_by')->nullable()->after('per_page');
            $table->string('sort_direction', 10)->nullable()->after('sort_by'); // asc|desc
            $table->string('view_mode', 20)->nullable()->after('sort_direction'); // table|cards|map
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_column_preferences', function (Blueprint $table) {
            $table->dropColumn(['per_page', 'sort_by', 'sort_direction', 'view_mode']);
        });
    }
};
