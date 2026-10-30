<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReassignTaskRequest;
use App\Models\CollectionTask;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CollectionTaskController extends Controller
{
    /**
     * Display a listing of all collection tasks.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', CollectionTask::class);

        $query = CollectionTask::with([
            'wasteReport',
            'wasteReport.category',
            'wasteReport.resident',
            'assignedWorker',
            'assignedBy',
        ]);

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        // Filter by assigned worker
        if ($request->filled('worker_id')) {
            $query->where('assigned_worker_id', $request->input('worker_id'));
        }

        // Search by report title or location
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->whereHas('wasteReport', function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('location_description', 'like', "%{$search}%");
            });
        }

        $tasks = $query->latest()->paginate(15)->withQueryString();

        $workers = User::where('role', User::ROLE_WORKER)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('admin/tasks/index', [
            'tasks' => $tasks,
            'workers' => $workers,
            'filters' => $request->only(['status', 'worker_id', 'search']),
        ]);
    }

    /**
     * Display the specified task with full details.
     */
    public function show(CollectionTask $task): Response
    {
        $this->authorize('view', $task);

        $task->load([
            'wasteReport',
            'wasteReport.category',
            'wasteReport.resident',
            'assignedWorker',
            'assignedBy',
            'statusHistories.changedBy',
        ]);

        $workers = User::where('role', User::ROLE_WORKER)
            ->orderBy('name')
            ->get(['id', 'name', 'email']);

        return Inertia::render('admin/tasks/show', [
            'task' => $task,
            'workers' => $workers,
        ]);
    }

    /**
     * Reassign a task to a different worker.
     */
    public function reassign(ReassignTaskRequest $request, CollectionTask $task)
    {
        DB::transaction(function () use ($request, $task) {
            $validated = $request->validated();
            $oldWorkerId = $task->assigned_worker_id;

            $task->update([
                'assigned_worker_id' => $validated['assigned_worker_id'],
                'scheduled_at' => $validated['scheduled_at'] ?? $task->scheduled_at,
                'status' => 'assigned', // Reset status when reassigning
                'started_at' => null,
            ]);

            $oldWorker = User::find($oldWorkerId);
            $newWorker = User::find($validated['assigned_worker_id']);

            $task->statusHistories()->create([
                'changed_by' => auth()->id(),
                'old_status' => $task->status,
                'new_status' => 'assigned',
                'notes' => $validated['notes'] ?? "Task reassigned from {$oldWorker->name} to {$newWorker->name}",
            ]);
        });

        return back()->with('success', 'Task reassigned successfully');
    }
}
