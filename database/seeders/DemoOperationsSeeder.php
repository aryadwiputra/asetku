<?php

namespace Database\Seeders;

use App\Models\ApprovalWorkflow;
use App\Models\Asset;
use App\Models\AssetDepreciationEntry;
use App\Models\AssetDepreciationRun;
use App\Models\AssetDisposal;
use App\Models\AssetHistory;
use App\Models\AssetMaintenance;
use App\Models\AssetMaintenanceCostLine;
use App\Models\AssetMaintenanceMedia;
use App\Models\AssetMaintenanceTask;
use App\Models\AssetMedia;
use App\Models\AssetUsageLog;
use App\Models\Branch;
use App\Models\MaintenanceChecklistTemplate;
use App\Models\MaintenanceChecklistTemplateItem;
use App\Models\MaintenanceSchedule;
use App\Models\MediaAsset;
use App\Models\Organization;
use App\Models\OrganizationGroup;
use App\Models\TechnicianProfile;
use App\Models\User;
use App\Services\AssetDepreciationCalculator;
use App\Services\AssetDisposalService;
use App\Services\OrganizationContext;
use App\Services\WorkOrderSlaService;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class DemoOperationsSeeder extends Seeder
{
    private const MINIMAL_PROGRESS_PNG_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAADElEQVQImWP4z8AAAAMBAQCc479ZAAAAAElFTkSuQmCC';

    private const MINIMAL_BA_PDF_BASE64 = 'JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCAyMDAgMjAwXQovQ29udGVudHMgNCAwIFIKL1Jlc291cmNlcyA8PAovRm9udCA8PAovRjEgNSAwIFIKPj4KPj4KPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0xlbmd0aCA3NQo+PgpzdHJlYW0KQlQKL0YxIDI0IFRmCjUwIDEyMCBUZAooRGVtbyBBc2V0a3UpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKNSAwIG9iago8PAovVHlwZSAvRm9udAovU3VidHlwZSAvVHlwZTEKL0Jhc2VGb250IC9IZWx2ZXRpY2EKPj4KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDY2IDAwMDAwIG4gCjAwMDAwMDAxMjEgMDAwMDAgbiAKMDAwMDAwMDI4NCAwMDAwMCBuIAowMDAwMDAwNDQ1IDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNgovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNTE0CiUlRU9G';

    public function run(): void
    {
        $group = OrganizationGroup::query()->where('slug', 'pt-maju-bersama')->first();
        if (! $group) {
            // Ensure base demo orgs + assets exist when this seeder is executed standalone.
            $this->call(DemoAssetDataSeeder::class);

            $group = OrganizationGroup::query()->where('slug', 'pt-maju-bersama')->first();
        }

        if (! $group) {
            return;
        }

        $organizations = Organization::query()
            ->where('organization_group_id', $group->id)
            ->orderBy('name')
            ->get();

        foreach ($organizations as $organization) {
            app(OrganizationContext::class)->setCurrentOrganizationId($organization->id);

            $owner = $this->resolveOrganizationOwner($organization);
            if (! $owner) {
                continue;
            }

            $branches = Branch::query()
                ->where('organization_id', $organization->id)
                ->orderBy('code')
                ->get()
                ->keyBy('code');

            $assets = Asset::query()
                ->where('organization_id', $organization->id)
                ->whereNull('archived_at')
                ->orderBy('code')
                ->get();

            if ($assets->isEmpty()) {
                continue;
            }

            $technicians = $this->seedTechnicians($organization, $branches);
            $templates = $this->seedChecklistTemplates($organization);
            $this->seedPreventiveSchedules($organization, $assets, $templates);
            $this->seedWorkOrders($organization, $assets, $technicians, $templates, $owner);
            $this->seedLifecycleSamples($organization, $assets, $owner);
            $this->seedDepreciationSamples($organization, $assets, $owner);
            $this->seedDisposalSamples($organization, $assets, $owner);
        }
    }

    /**
     * @return array<string, User>
     */
    private function seedTechnicians(Organization $organization, $branches): array
    {
        $definitions = [
            [
                'email' => 'tech-jkt-'.$organization->slug.'@example.com',
                'name' => 'Teknisi Jakarta',
                'branch' => 'JKT',
                'skills' => ['network', 'laptop'],
            ],
            [
                'email' => 'tech-sby-'.$organization->slug.'@example.com',
                'name' => 'Teknisi Surabaya',
                'branch' => 'SBY',
                'skills' => ['printer', 'hardware'],
            ],
            [
                'email' => 'tech-bdg-'.$organization->slug.'@example.com',
                'name' => 'Teknisi Bandung',
                'branch' => 'BDG',
                'skills' => ['vehicle', 'general'],
            ],
        ];

        $users = [];

        foreach ($definitions as $def) {
            /** @var Branch|null $branch */
            $branch = $branches->get($def['branch']);

            /** @var User $user */
            $user = User::query()->updateOrCreate(
                ['email' => $def['email']],
                [
                    'name' => $def['name'],
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                    'is_active' => true,
                    'organization_id' => $organization->id,
                    'current_organization_id' => $organization->id,
                ],
            );

            $user->organizations()->syncWithoutDetaching([
                $organization->id => ['role' => 'Member', 'is_active' => true],
            ]);

            if (! $user->hasRole('user')) {
                try {
                    $user->assignRole('user');
                } catch (\Throwable) {
                    // ignore if roles not seeded yet in environment
                }
            }

            TechnicianProfile::query()->updateOrCreate(
                ['organization_id' => $organization->id, 'user_id' => $user->id],
                [
                    'branch_id' => $branch?->id,
                    'is_active' => true,
                    'is_available' => true,
                    'skills' => $def['skills'],
                ],
            );

            $users[$def['branch']] = $user;
        }

        return $users;
    }

    /**
     * @return array<string, MaintenanceChecklistTemplate>
     */
    private function seedChecklistTemplates(Organization $organization): array
    {
        $templates = [];

        $templates['laptop'] = MaintenanceChecklistTemplate::query()->updateOrCreate(
            ['organization_id' => $organization->id, 'name' => 'Laptop Preventive Checklist'],
            ['asset_category_id' => null, 'is_active' => true, 'required_skill' => 'laptop'],
        );

        $templates['printer'] = MaintenanceChecklistTemplate::query()->updateOrCreate(
            ['organization_id' => $organization->id, 'name' => 'Printer Preventive Checklist'],
            ['asset_category_id' => null, 'is_active' => true, 'required_skill' => 'printer'],
        );

        $templates['vehicle'] = MaintenanceChecklistTemplate::query()->updateOrCreate(
            ['organization_id' => $organization->id, 'name' => 'Vehicle Safety Checklist'],
            ['asset_category_id' => null, 'is_active' => true, 'required_skill' => 'vehicle'],
        );

        $this->seedChecklistItems($templates['laptop'], [
            'Periksa kondisi baterai',
            'Update sistem operasi',
            'Cek suhu & kipas',
            'Bersihkan keyboard & layar',
        ]);
        $this->seedChecklistItems($templates['printer'], [
            'Cek toner & cartridge',
            'Bersihkan roller',
            'Test print',
            'Cek konektivitas jaringan',
        ]);
        $this->seedChecklistItems($templates['vehicle'], [
            'Cek oli mesin',
            'Cek rem & ban',
            'Cek lampu & klakson',
            'Cek kebersihan cabin',
        ]);

        return $templates;
    }

    /**
     * @param  list<string>  $titles
     */
    private function seedChecklistItems(MaintenanceChecklistTemplate $template, array $titles): void
    {
        foreach ($titles as $index => $title) {
            MaintenanceChecklistTemplateItem::query()->updateOrCreate(
                ['template_id' => $template->id, 'sort_order' => $index],
                ['title' => $title, 'is_required' => true],
            );
        }
    }

    /**
     * @param  Collection<int, Asset>  $assets
     * @param  array<string, MaintenanceChecklistTemplate>  $templates
     */
    private function seedPreventiveSchedules(Organization $organization, $assets, array $templates): void
    {
        $asset = $assets->first();
        if (! $asset) {
            return;
        }

        MaintenanceSchedule::query()->updateOrCreate(
            ['organization_id' => $organization->id, 'asset_id' => $asset->id, 'name' => 'PM Bulanan'],
            [
                'interval_days' => 30,
                'next_due_at' => now()->toDateString(),
                'default_priority' => 'normal',
                'default_sla_response_hours' => 4,
                'default_sla_resolution_hours' => 24,
                'checklist_template_id' => $templates['laptop']->id ?? null,
                'required_skill' => 'laptop',
                'is_active' => true,
            ],
        );
    }

    /**
     * @param  Collection<int, Asset>  $assets
     * @param  array<string, User>  $technicians
     * @param  array<string, MaintenanceChecklistTemplate>  $templates
     */
    private function seedWorkOrders(Organization $organization, $assets, array $technicians, array $templates, User $owner): void
    {
        $sla = app(WorkOrderSlaService::class);

        $workOrders = [
            [
                'key' => 'wo-open',
                'status' => 'open',
                'progress' => 0,
                'priority' => 'normal',
                'type' => 'corrective',
                'source' => 'manual',
                'template' => 'printer',
                'assigned_branch' => 'JKT',
            ],
            [
                'key' => 'wo-ack',
                'status' => 'acknowledged',
                'progress' => 10,
                'priority' => 'high',
                'type' => 'corrective',
                'source' => 'damage_report',
                'template' => 'laptop',
                'assigned_branch' => 'SBY',
            ],
            [
                'key' => 'wo-inprog',
                'status' => 'in_progress',
                'progress' => 60,
                'priority' => 'normal',
                'type' => 'preventive',
                'source' => 'schedule',
                'template' => 'vehicle',
                'assigned_branch' => 'BDG',
            ],
            [
                'key' => 'wo-done',
                'status' => 'completed',
                'progress' => 100,
                'priority' => 'normal',
                'type' => 'corrective',
                'source' => 'manual',
                'template' => 'laptop',
                'assigned_branch' => 'JKT',
            ],
            [
                'key' => 'wo-overdue',
                'status' => 'open',
                'progress' => 0,
                'priority' => 'critical',
                'type' => 'corrective',
                'source' => 'manual',
                'template' => 'printer',
                'assigned_branch' => 'SBY',
                'overdue' => true,
            ],
        ];

        foreach ($workOrders as $index => $def) {
            $asset = $assets->get($index % max(1, $assets->count()));
            if (! $asset) {
                continue;
            }

            $branch = Branch::query()->where('organization_id', $organization->id)->where('code', $def['assigned_branch'])->first();
            $technician = $technicians[$def['assigned_branch']] ?? null;
            $template = $templates[$def['template']] ?? null;

            $description = '[Demo] '.$asset->code.' — '.match ($def['key']) {
                'wo-overdue' => 'WO Overdue SLA',
                'wo-inprog' => 'Preventive maintenance',
                'wo-done' => 'Completed repair',
                default => 'Corrective maintenance',
            };

            /** @var AssetMaintenance $workOrder */
            $workOrder = AssetMaintenance::query()->updateOrCreate(
                [
                    'organization_id' => $organization->id,
                    'asset_id' => $asset->id,
                    'description' => $description,
                ],
                [
                    'branch_id' => $branch?->id ?? $asset->branch_id,
                    'type' => $def['type'],
                    'source' => $def['source'],
                    'priority' => $def['priority'],
                    'status' => $def['status'],
                    'progress_percent' => $def['progress'],
                    'performed_at' => now()->subDays(3)->toDateTimeString(),
                    'notes' => null,
                    'internal_notes' => null,
                    'checklist_template_id' => $template?->id,
                    'requested_by' => $owner->id,
                    'sla_response_hours' => 4,
                    'sla_resolution_hours' => 24,
                ],
            );

            $sla->applyDueDates($workOrder);

            if (($def['overdue'] ?? false) === true) {
                $workOrder->forceFill([
                    'response_due_at' => now()->subHours(2),
                    'resolution_due_at' => now()->subHours(1),
                ]);
            }

            if ($technician) {
                $workOrder->forceFill([
                    'assigned_to' => $technician->id,
                    'assigned_at' => now()->subHours(12),
                ]);
            }

            if ($def['status'] === 'acknowledged') {
                $workOrder->acknowledged_at = $workOrder->acknowledged_at ?? now()->subHours(10);
            }

            if ($def['status'] === 'in_progress') {
                $workOrder->started_at = $workOrder->started_at ?? now()->subHours(8);
            }

            if ($def['status'] === 'completed') {
                $workOrder->completed_at = $workOrder->completed_at ?? now()->subHours(1);
            }

            $workOrder->save();

            $this->seedWorkOrderTasks($workOrder);
            $this->seedWorkOrderCosts($workOrder);
            $this->seedWorkOrderAttachments($workOrder, $owner);
        }
    }

    private function seedWorkOrderTasks(AssetMaintenance $workOrder): void
    {
        if ($workOrder->checklist_template_id === null) {
            return;
        }

        $template = MaintenanceChecklistTemplate::query()
            ->where('organization_id', $workOrder->organization_id)
            ->with('items')
            ->find($workOrder->checklist_template_id);

        if (! $template) {
            return;
        }

        foreach ($template->items as $item) {
            AssetMaintenanceTask::query()->updateOrCreate(
                ['organization_id' => $workOrder->organization_id, 'maintenance_id' => $workOrder->id, 'title' => $item->title],
                [
                    'is_required' => $item->is_required,
                    'sort_order' => $item->sort_order,
                    'completed_at' => null,
                    'completed_by' => null,
                    'notes' => null,
                ],
            );
        }
    }

    private function seedWorkOrderCosts(AssetMaintenance $workOrder): void
    {
        $lines = [
            ['kind' => 'parts', 'description' => 'Spare part', 'quantity' => 1, 'unit_cost' => 250000],
            ['kind' => 'labor', 'description' => 'Labor', 'quantity' => 1, 'unit_cost' => 150000],
        ];

        foreach ($lines as $line) {
            $total = (float) $line['quantity'] * (float) $line['unit_cost'];

            AssetMaintenanceCostLine::query()->updateOrCreate(
                [
                    'organization_id' => $workOrder->organization_id,
                    'maintenance_id' => $workOrder->id,
                    'kind' => $line['kind'],
                    'description' => $line['description'],
                ],
                [
                    'quantity' => $line['quantity'],
                    'unit_cost' => $line['unit_cost'],
                    'total_cost' => $total,
                ],
            );
        }
    }

    private function seedWorkOrderAttachments(AssetMaintenance $workOrder, User $uploadedBy): void
    {
        $png = base64_decode(self::MINIMAL_PROGRESS_PNG_BASE64, true);
        if (! is_string($png) || $png === '') {
            return;
        }

        $title = "WO {$workOrder->id} Progress Photo";
        $fileName = "wo-{$workOrder->id}-progress.png";

        $mediaAsset = MediaAsset::query()->firstOrCreate(
            ['title' => $title, 'uploaded_by' => $uploadedBy->id],
            [],
        );

        if (! $mediaAsset->getFirstMedia('file')) {
            $mediaAsset->addMediaFromString($png)->usingFileName($fileName)->toMediaCollection('file');
        }

        AssetMaintenanceMedia::query()->updateOrCreate(
            ['organization_id' => $workOrder->organization_id, 'maintenance_id' => $workOrder->id, 'media_asset_id' => $mediaAsset->id],
            ['kind' => 'photo', 'document_type' => null, 'sort_order' => 0, 'is_primary' => true],
        );
    }

    /**
     * @param  Collection<int, Asset>  $assets
     */
    private function seedLifecycleSamples(Organization $organization, $assets, User $owner): void
    {
        $sampleAssets = $assets->take(3);

        $stages = ['acquisition', 'receiving', 'placement', 'usage', 'maintenance', 'mutation'];

        foreach ($sampleAssets as $asset) {
            foreach ($stages as $index => $stage) {
                $performedAt = now()->subDays(30 - ($index * 4));

                $exists = AssetHistory::query()
                    ->where('organization_id', $organization->id)
                    ->where('asset_id', $asset->id)
                    ->where('action', 'lifecycle_recorded')
                    ->where('performed_at', $performedAt->toDateTimeString())
                    ->exists();

                if ($exists) {
                    continue;
                }

                AssetHistory::query()->create([
                    'organization_id' => $organization->id,
                    'asset_id' => $asset->id,
                    'action' => 'lifecycle_recorded',
                    'performed_at' => $performedAt,
                    'description' => "Lifecycle event: {$stage}",
                    'changed_by' => $owner->id,
                    'payload' => ['stage' => $stage, 'notes' => null],
                ]);
            }

            $this->ensureLifecycleDocument($asset, $owner, stage: 'receiving', documentType: 'bast');
            $this->ensureLifecycleDocument($asset, $owner, stage: 'placement', documentType: 'assignment_letter');
        }
    }

    private function ensureLifecycleDocument(Asset $asset, User $uploadedBy, string $stage, string $documentType): void
    {
        $exists = AssetMedia::query()
            ->where('asset_id', $asset->id)
            ->where('kind', 'document')
            ->where('stage', $stage)
            ->where('document_type', $documentType)
            ->exists();

        if ($exists) {
            return;
        }

        $pdf = base64_decode(self::MINIMAL_BA_PDF_BASE64, true);
        if (! is_string($pdf) || $pdf === '') {
            return;
        }

        $title = "{$asset->code} {$stage} {$documentType}";
        $fileName = Str::slug($asset->code.'-'.$stage.'-'.$documentType).'.pdf';

        $mediaAsset = MediaAsset::query()->firstOrCreate(
            ['title' => $title, 'uploaded_by' => $uploadedBy->id],
            [],
        );

        if (! $mediaAsset->getFirstMedia('file')) {
            $mediaAsset->addMediaFromString($pdf)->usingFileName($fileName)->toMediaCollection('file');
        }

        AssetMedia::query()->create([
            'organization_id' => $asset->organization_id,
            'asset_id' => $asset->id,
            'media_asset_id' => $mediaAsset->id,
            'kind' => 'document',
            'stage' => $stage,
            'document_type' => $documentType,
            'sort_order' => 0,
            'is_primary' => true,
        ]);
    }

    /**
     * @param  Collection<int, Asset>  $assets
     */
    private function seedDepreciationSamples(Organization $organization, $assets, User $owner): void
    {
        $calculator = app(AssetDepreciationCalculator::class);

        $periodEnds = [
            now()->copy()->subMonthNoOverflow()->endOfMonth()->startOfDay(),
            now()->copy()->subMonthsNoOverflow(2)->endOfMonth()->startOfDay(),
        ];

        $selected = $assets->take(5)->values();

        if ($selected->isEmpty()) {
            return;
        }

        // Ensure one asset has units_of_production method for demo.
        $uop = $selected->last();
        if ($uop) {
            $uop->forceFill([
                'depreciation_method' => 'units_of_production',
                'production_units_total_estimate' => 1000,
                'production_units_unit' => 'hours',
            ])->save();
        }

        foreach ($periodEnds as $periodEnd) {
            $periodStart = $periodEnd->copy()->startOfMonth();

            /** @var AssetDepreciationRun $run */
            $run = AssetDepreciationRun::query()
                ->where('organization_id', $organization->id)
                ->where('period', 'monthly')
                ->whereDate('period_end', $periodEnd->toDateString())
                ->first() ?? new AssetDepreciationRun;

            $run->forceFill([
                'organization_id' => $organization->id,
                'period' => 'monthly',
                'period_start' => $periodStart->toDateString(),
                'period_end' => $periodEnd->toDateString(),
                'status' => 'completed',
                'requested_by' => $owner->id,
                'started_at' => now()->subMinutes(5),
                'finished_at' => now()->subMinutes(1),
                'meta' => ['demo' => true],
                'error_message' => null,
            ])->save();

            if ($uop) {
                AssetUsageLog::query()->updateOrCreate(
                    [
                        'organization_id' => $organization->id,
                        'asset_id' => $uop->id,
                        'recorded_at' => $periodEnd->copy()->subDays(10)->toDateString(),
                    ],
                    [
                        'units' => 80,
                        'unit' => 'hours',
                        'notes' => 'Demo usage log',
                        'created_by' => $owner->id,
                    ],
                );
            }

            foreach ($selected as $asset) {
                $result = $calculator->calculateForPeriod($asset, $periodStart, $periodEnd);
                if (! $result->shouldPost) {
                    continue;
                }

                $entry = AssetDepreciationEntry::query()
                    ->where('asset_id', $asset->id)
                    ->whereDate('period_end', $periodEnd->toDateString())
                    ->first() ?? new AssetDepreciationEntry;

                $entry->forceFill([
                    'organization_id' => $organization->id,
                    'asset_id' => $asset->id,
                    'run_id' => $run->id,
                    'period_start' => $periodStart->toDateString(),
                    'period_end' => $periodEnd->toDateString(),
                    'cost' => $asset->cost,
                    'residual_value' => $asset->residual_value,
                    'method' => $asset->depreciation_method,
                    'book_value_start' => $result->bookValueStart,
                    'depreciation_amount' => $result->depreciationAmount,
                    'accumulated_depreciation' => $result->accumulatedDepreciation,
                    'book_value_end' => $result->bookValueEnd,
                    'units_in_period' => $result->unitsInPeriod,
                    'units_total_estimate' => $result->unitsTotalEstimate,
                    'units_unit' => $result->unitsUnit,
                    'created_by' => $owner->id,
                ])->save();

                $asset->forceFill(['book_value_cached' => $result->bookValueEnd])->save();
            }
        }
    }

    /**
     * @param  Collection<int, Asset>  $assets
     */
    private function seedDisposalSamples(Organization $organization, $assets, User $owner): void
    {
        $workflow = ApprovalWorkflow::query()
            ->where('organization_id', $organization->id)
            ->where('type', 'disposal')
            ->where('is_active', true)
            ->first();

        if (! $workflow) {
            return;
        }

        $pendingAsset = $assets->first();
        $executedAsset = $assets->skip(1)->first();

        if ($pendingAsset) {
            $hasPending = AssetDisposal::query()
                ->where('asset_id', $pendingAsset->id)
                ->where('status', 'pending')
                ->exists();

            if (! $hasPending) {
                $service = app(AssetDisposalService::class);
                try {
                    $service->requestDisposal($pendingAsset, [
                        'type' => 'sale',
                        'disposed_at' => now()->subDays(2)->toDateString(),
                        'proceeds_amount' => 1000000,
                        'fees_amount' => 100000,
                        'reason' => 'Demo disposal request',
                        'notes' => null,
                    ], $owner);
                } catch (\Throwable $e) {
                    Log::warning('DemoOperationsSeeder failed to create pending disposal', [
                        'organization_id' => $organization->id,
                        'asset_id' => $pendingAsset->id,
                        'error' => $e->getMessage(),
                    ]);
                }
            }
        }

        if ($executedAsset) {
            $hasExecuted = AssetDisposal::query()
                ->where('asset_id', $executedAsset->id)
                ->where('status', 'executed')
                ->exists();

            if (! $hasExecuted) {
                try {
                    $disposedAt = Carbon::now()->subDays(7);
                    $bookValue = (float) $executedAsset->bookValue($disposedAt->copy());

                    /** @var AssetDisposal $disposal */
                    $disposal = AssetDisposal::query()->create([
                        'asset_id' => $executedAsset->id,
                        'type' => 'scrap',
                        'reason' => 'Demo executed disposal',
                        'notes' => null,
                        'currency_code' => $organization->currency_code,
                        'proceeds_amount' => 0,
                        'fees_amount' => 0,
                        'fair_value_amount' => null,
                        'net_proceeds_amount' => 0,
                        'book_value_at_disposal' => $bookValue,
                        'gain_loss_amount' => 0 - $bookValue,
                        'disposed_by' => $owner->id,
                        'disposed_at' => $disposedAt,
                        'executed_at' => now(),
                        'status' => 'executed',
                        'requested_by' => $owner->id,
                        'approved_by' => $owner->id,
                        'approved_at' => now(),
                    ]);

                    $executedAsset->forceFill([
                        'archived_at' => now(),
                        'archived_by' => $owner->id,
                    ])->save();

                    $this->ensureDisposalBaAttachment($disposal, $owner);
                } catch (\Throwable $e) {
                    Log::warning('DemoOperationsSeeder failed to create executed disposal', [
                        'organization_id' => $organization->id,
                        'asset_id' => $executedAsset->id,
                        'error' => $e->getMessage(),
                    ]);
                }
            }
        }
    }

    private function ensureDisposalBaAttachment(AssetDisposal $disposal, User $uploadedBy): void
    {
        $asset = $disposal->asset()->first();
        if (! $asset) {
            return;
        }

        $exists = AssetMedia::query()
            ->where('asset_id', $asset->id)
            ->where('kind', 'document')
            ->where('stage', 'disposal')
            ->where('document_type', 'disposal_report')
            ->exists();

        if ($exists) {
            return;
        }

        $pdf = base64_decode(self::MINIMAL_BA_PDF_BASE64, true);
        if (! is_string($pdf) || $pdf === '') {
            return;
        }

        $title = "BA Penghapusan {$asset->code}";
        $fileName = Str::slug($asset->code.'-ba-penghapusan').'.pdf';

        $mediaAsset = MediaAsset::query()->firstOrCreate(
            ['title' => $title, 'uploaded_by' => $uploadedBy->id],
            [],
        );

        if (! $mediaAsset->getFirstMedia('file')) {
            $mediaAsset->addMediaFromString($pdf)->usingFileName($fileName)->toMediaCollection('file');
        }

        AssetMedia::query()->create([
            'organization_id' => $asset->organization_id,
            'asset_id' => $asset->id,
            'media_asset_id' => $mediaAsset->id,
            'kind' => 'document',
            'stage' => 'disposal',
            'document_type' => 'disposal_report',
            'sort_order' => 0,
            'is_primary' => true,
        ]);
    }

    private function resolveOrganizationOwner(Organization $organization): ?User
    {
        $email = Str::slug($organization->slug).'@example.com';

        $user = User::query()->where('email', $email)->first();
        if ($user) {
            return $user;
        }

        return User::query()
            ->whereHas('organizations', function ($query) use ($organization) {
                $query->whereKey($organization->id)->wherePivot('role', 'Owner');
            })
            ->orderBy('id')
            ->first();
    }

    private function resolveOrganizationAdmin(Organization $organization): ?User
    {
        return User::query()
            ->whereHas('organizations', function ($query) use ($organization) {
                $query->whereKey($organization->id)->wherePivot('role', 'Admin');
            })
            ->orderBy('id')
            ->first();
    }
}
