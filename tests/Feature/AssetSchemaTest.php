<?php

use Illuminate\Support\Facades\Schema;

test('asset tables and key columns exist', function () {
    expect(Schema::hasTable('asset_statuses'))->toBeTrue();
    expect(Schema::hasTable('asset_classes'))->toBeTrue();
    expect(Schema::hasTable('asset_locations'))->toBeTrue();
    expect(Schema::hasTable('vendors'))->toBeTrue();
    expect(Schema::hasTable('vendor_contract_renewals'))->toBeTrue();
    expect(Schema::hasTable('asset_warranty_claims'))->toBeTrue();
    expect(Schema::hasTable('asset_vendor_contract'))->toBeTrue();
    expect(Schema::hasTable('departments'))->toBeTrue();
    expect(Schema::hasTable('assets'))->toBeTrue();
    expect(Schema::hasTable('asset_movements'))->toBeTrue();
    expect(Schema::hasTable('asset_disposals'))->toBeTrue();
    expect(Schema::hasTable('asset_approval_requests'))->toBeTrue();

    expect(Schema::hasColumns('assets', [
        'organization_id',
        'asset_status_id',
        'asset_location_id',
        'department_id',
        'qr_token',
        'vendor_contract_id',
        'warranty_expiry_reminder_sent_at',
    ]))->toBeTrue();

    expect(Schema::hasColumns('asset_movements', [
        'organization_id',
        'asset_id',
        'moved_by',
        'status',
        'requested_by',
        'approved_by',
        'rejected_by',
    ]))->toBeTrue();

    expect(Schema::hasColumns('asset_approval_requests', [
        'organization_id',
        'approvable_id',
        'approvable_type',
        'type',
        'status',
    ]))->toBeTrue();

    expect(Schema::hasColumns('departments', [
        'organization_id',
        'branch_id',
    ]))->toBeTrue();
});
