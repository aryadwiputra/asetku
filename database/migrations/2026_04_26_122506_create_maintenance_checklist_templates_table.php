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
        Schema::create('maintenance_checklist_templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->foreignId('asset_category_id')->nullable()->constrained('asset_categories')->nullOnDelete();
            $table->string('name');
            $table->boolean('is_active')->default(true);
            $table->string('required_skill')->nullable();
            $table->timestamps();

            $table->index(['organization_id', 'is_active'], 'maintenance_checklist_templates_org_active_index');
            $table->index(['organization_id', 'asset_category_id'], 'maintenance_checklist_templates_org_category_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenance_checklist_templates');
    }
};
