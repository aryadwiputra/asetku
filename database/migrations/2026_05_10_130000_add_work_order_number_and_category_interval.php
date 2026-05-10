<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('asset_maintenances', function (Blueprint $table) {
            $table->string('work_order_number')->nullable()->after('organization_id');
        });

        Schema::table('asset_categories', function (Blueprint $table) {
            $table->unsignedInteger('category_default_maintenance_interval')->nullable()->after('capex_opex_default');
        });

        $rows = DB::table('asset_maintenances')
            ->select('id', 'organization_id', 'created_at')
            ->orderBy('organization_id')
            ->orderBy('created_at')
            ->orderBy('id')
            ->get();

        $sequences = [];

        foreach ($rows as $row) {
            $timestamp = $row->created_at ? Carbon::parse($row->created_at) : now();
            $year = $timestamp->year;
            $sequenceKey = "{$row->organization_id}:{$year}";
            $sequences[$sequenceKey] = ($sequences[$sequenceKey] ?? 0) + 1;

            DB::table('asset_maintenances')
                ->where('id', $row->id)
                ->update([
                    'work_order_number' => sprintf('WO-%d-%03d', $year, $sequences[$sequenceKey]),
                ]);
        }

        Schema::table('asset_maintenances', function (Blueprint $table) {
            $table->unique(['organization_id', 'work_order_number'], 'asset_maintenances_org_work_order_number_unique');
        });
    }

    public function down(): void
    {
        Schema::table('asset_maintenances', function (Blueprint $table) {
            $table->dropUnique('asset_maintenances_org_work_order_number_unique');
            $table->dropColumn('work_order_number');
        });

        Schema::table('asset_categories', function (Blueprint $table) {
            $table->dropColumn('category_default_maintenance_interval');
        });
    }
};
