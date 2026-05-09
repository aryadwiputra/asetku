<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_finding_photos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('audit_finding_id');
            $table->foreign('audit_finding_id')->references('id')->on('audit_findings')->cascadeOnDelete();
            $table->unsignedBigInteger('media_asset_id')->nullable();
            $table->foreign('media_asset_id')->references('id')->on('media_assets')->nullOnDelete();
            $table->string('caption')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_finding_photos');
    }
};
