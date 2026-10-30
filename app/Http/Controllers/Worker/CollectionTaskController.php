<?php

namespace App\Http\Controllers\Worker;

use App\Http\Controllers\Controller;
use App\Http\Requests\Worker\AcceptTaskRequest;
use App\Http\Requests\Worker\CompleteTaskRequest;
use App\Http\Requests\Worker\StartTaskRequest;
use App\Models\CollectionTask;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CollectionTaskController extends Controller
{
    /**
     * Display a listing of tasks assigned to the authenticated worker.
     */
    public function index(): Response
    {
        $this->authorize('viewAny', CollectionTask::class);

        $tasks = CollectionTask::with([
            'wasteReport',
            'wasteReport.category',
            'wasteReport.resident',
            'statusHistories.changedBy',
        ])
            ->where('assigned_worker_id', auth()->id())
            ->orderByRaw('scheduled_at IS NULL, scheduled_at ASC')
            ->latest('created_at')
            ->paginate(15);

        return Inertia::render('worker/tasks/index', [
            'tasks' => $tasks,
        ]);
    }

    /**
     * Display the specified task.
     */
    public function show(CollectionTask $task): Response
    {
        $this->authorize('view', $task);

        $task->load([
            'wasteReport',
            'wasteReport.category',
            'wasteReport.resident',
            'statusHistories.changedBy',
            'assignedWorker',
            'assignedBy',
        ]);

        return Inertia::render('worker/tasks/show', [
            'task' => $task,
        ]);
    }

    /**
     * Accept an assigned task.
     */
    public function accept(AcceptTaskRequest $request, CollectionTask $task)
    {
        $this->authorize('accept', $task);

        DB::transaction(function () use ($task) {
            $oldStatus = $task->status;

            $task->update([
                'status' => 'accepted',
            ]);

            $task->statusHistories()->create([
                'changed_by' => auth()->id(),
                'old_status' => $oldStatus,
                'new_status' => 'accepted',
                'notes' => 'Task accepted by worker',
            ]);
        });

        return to_route('worker.tasks.show', $task)
            ->with('success', 'Task accepted successfully');
    }

    /**
     * Start a task.
     */
    public function start(StartTaskRequest $request, CollectionTask $task)
    {
        $this->authorize('start', $task);

        DB::transaction(function () use ($task) {
            $oldStatus = $task->status;

            $task->update([
                'status' => 'in_progress',
                'started_at' => now(),
            ]);

            $task->statusHistories()->create([
                'changed_by' => auth()->id(),
                'old_status' => $oldStatus,
                'new_status' => 'in_progress',
                'notes' => 'Task started by worker',
            ]);

            // Update related report status
            $report = $task->wasteReport;
            if ($report && $report->status !== 'in_progress') {
                $reportOldStatus = $report->status;
                $report->update(['status' => 'in_progress']);

                $report->statusHistories()->create([
                    'changed_by' => auth()->id(),
                    'old_status' => $reportOldStatus,
                    'new_status' => 'in_progress',
                    'notes' => 'Collection task started by worker',
                ]);
            }
        });

        return to_route('worker.tasks.show', $task)
            ->with('success', 'Task started successfully');
    }

    /**
     * Complete a task.
     */
    public function complete(CompleteTaskRequest $request, CollectionTask $task)
    {
        $this->authorize('complete', $task);

        DB::transaction(function () use ($request, $task) {
            $validated = $request->validated();

            if ($request->hasFile('completion_photo')) {
                $validated['completion_photo_path'] = $request->file('completion_photo')
                    ->store('collection-tasks', 'public');
            }

            $task->update([
                'status' => 'completed',
                'completed_at' => now(),
                'completion_notes' => $validated['completion_notes'],
                'completion_photo_path' => $validated['completion_photo_path'] ?? null,
            ]);

            $task->statusHistories()->create([
                'changed_by' => auth()->id(),
                'old_status' => 'in_progress',
                'new_status' => 'completed',
                'notes' => $validated['completion_notes'],
            ]);

            // Update related report status to resolved
            $report = $task->wasteReport;
            if ($report && $report->status !== 'resolved') {
                $reportOldStatus = $report->status;
                $report->update(['status' => 'resolved']);

                $report->statusHistories()->create([
                    'changed_by' => auth()->id(),
                    'old_status' => $reportOldStatus,
                    'new_status' => 'resolved',
                    'notes' => 'Collection task completed by worker',
                ]);
            }
        });

        return to_route('worker.tasks.index')
            ->with('success', 'Task completed successfully');
    }
}
