<?php

namespace App\Services;

use App\Models\ApprovalRequestStep;
use App\Models\ApprovalWorkflow;
use App\Models\ApprovalWorkflowStep;
use App\Models\AssetApprovalRequest;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ApprovalEngine
{
    public function createRequest(Model $approvable, string $type, User $actor, array $metadata = []): AssetApprovalRequest
    {
        /** @var int $organizationId */
        $organizationId = $approvable->getAttribute('organization_id');

        $workflow = ApprovalWorkflow::query()
            ->where('organization_id', $organizationId)
            ->where('type', $type)
            ->where('is_active', true)
            ->with('steps')
            ->first();

        if (! $workflow) {
            throw ValidationException::withMessages([
                'workflow' => [__('disposals.errors.workflow_missing')],
            ]);
        }

        $requiredSteps = $workflow->steps->where('is_required', true)->count();
        $requiredSteps = $requiredSteps > 0 ? $requiredSteps : 1;

        return DB::transaction(function () use ($approvable, $type, $actor, $metadata, $workflow, $requiredSteps): AssetApprovalRequest {
            /** @var AssetApprovalRequest $request */
            $request = AssetApprovalRequest::query()->create([
                'approvable_id' => $approvable->getKey(),
                'approvable_type' => $approvable->getMorphClass(),
                'type' => $type,
                'status' => 'pending',
                'current_step' => 1,
                'required_steps' => $requiredSteps,
                'requested_by' => $actor->id,
                'metadata' => [
                    ...$metadata,
                    'workflow_id' => $workflow->id,
                ],
            ]);

            foreach ($workflow->steps as $step) {
                ApprovalRequestStep::query()->create([
                    'approval_request_id' => $request->id,
                    'step_number' => $step->step_number,
                    'status' => 'pending',
                ]);
            }

            return $request;
        });
    }

    public function canDecideCurrentStep(AssetApprovalRequest $request, User $actor): bool
    {
        $workflowStep = $this->workflowStepForCurrentStep($request);
        if (! $workflowStep) {
            return false;
        }

        if ($workflowStep->approver_kind === 'user') {
            return is_numeric($workflowStep->approver_reference) && (int) $workflowStep->approver_reference === (int) $actor->id;
        }

        if ($workflowStep->approver_kind === 'role') {
            $organizationId = (int) $request->organization_id;

            return $actor->hasOrganizationRole($organizationId, [(string) $workflowStep->approver_reference]);
        }

        return false;
    }

    public function approveCurrentStep(AssetApprovalRequest $request, User $actor, ?string $notes = null): AssetApprovalRequest
    {
        if (! $this->canDecideCurrentStep($request, $actor)) {
            abort(403);
        }

        return DB::transaction(function () use ($request, $actor, $notes): AssetApprovalRequest {
            /** @var AssetApprovalRequest $locked */
            $locked = AssetApprovalRequest::query()
                ->whereKey($request->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($locked->status !== 'pending') {
                return $locked;
            }

            $currentStep = (int) $locked->current_step;

            /** @var ApprovalRequestStep $stepRow */
            $stepRow = ApprovalRequestStep::query()
                ->where('approval_request_id', $locked->id)
                ->where('step_number', $currentStep)
                ->lockForUpdate()
                ->firstOrFail();

            if ($stepRow->status !== 'pending') {
                return $locked;
            }

            $stepRow->forceFill([
                'status' => 'approved',
                'decided_by' => $actor->id,
                'decided_at' => now(),
                'notes' => $notes,
            ])->save();

            $nextStep = ApprovalRequestStep::query()
                ->where('approval_request_id', $locked->id)
                ->where('status', 'pending')
                ->orderBy('step_number')
                ->value('step_number');

            if ($nextStep === null) {
                $locked->forceFill([
                    'status' => 'approved',
                    'approved_by' => $actor->id,
                    'approved_at' => now(),
                ])->save();

                return $locked;
            }

            $locked->forceFill([
                'current_step' => (int) $nextStep,
            ])->save();

            return $locked;
        });
    }

    public function reject(AssetApprovalRequest $request, User $actor, ?string $notes = null): AssetApprovalRequest
    {
        if (! $this->canDecideCurrentStep($request, $actor)) {
            abort(403);
        }

        return DB::transaction(function () use ($request, $actor, $notes): AssetApprovalRequest {
            /** @var AssetApprovalRequest $locked */
            $locked = AssetApprovalRequest::query()
                ->whereKey($request->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($locked->status !== 'pending') {
                return $locked;
            }

            $currentStep = (int) $locked->current_step;

            /** @var ApprovalRequestStep $stepRow */
            $stepRow = ApprovalRequestStep::query()
                ->where('approval_request_id', $locked->id)
                ->where('step_number', $currentStep)
                ->lockForUpdate()
                ->firstOrFail();

            if ($stepRow->status !== 'pending') {
                return $locked;
            }

            $stepRow->forceFill([
                'status' => 'rejected',
                'decided_by' => $actor->id,
                'decided_at' => now(),
                'notes' => $notes,
            ])->save();

            $locked->forceFill([
                'status' => 'rejected',
                'rejected_by' => $actor->id,
                'rejected_at' => now(),
                'decision_notes' => $notes,
            ])->save();

            return $locked;
        });
    }

    private function workflowStepForCurrentStep(AssetApprovalRequest $request): ?ApprovalWorkflowStep
    {
        $workflowId = data_get($request->metadata, 'workflow_id');
        if (! is_numeric($workflowId)) {
            return null;
        }

        /** @var ApprovalWorkflowStep|null $step */
        $step = ApprovalWorkflowStep::query()
            ->where('workflow_id', (int) $workflowId)
            ->where('step_number', (int) $request->current_step)
            ->first();

        return $step;
    }
}
