<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AssignTaskRequest;
use App\Http\Requests\Admin\ReviewReportRequest;
use App\Models\CollectionTask;
use App\Models\User;
use App\Models\WasteReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class WasteReportController extends Controller
{
    /**
     * Display a listing of all waste reports.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', WasteReport::class);

        $query = WasteReport::with(['category', 'resident', 'collectionTask'])
            ->withCount('statusHistories');

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        // Filter by priority
        if ($request->filled('priority')) {
            $query->where('priority', $request->input('priority'));
        }

        // Filter by category
        if ($request->filled('category_id')) {
            $query->where('waste_category_id', $request->input('category_id'));
        }

        // Search by title or description
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('location_description', 'like', "%{$search}%");
            });
        }

        $reports = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('admin/reports/index', [
            'reports' => $reports,
            'filters' => $request->only(['status', 'priority', 'category_id', 'search']),
        ]);
    }

    /**
     * Display the specified report with full details.
     */
    public function show(WasteReport $report): Response
    {
        $this->authorize('view', $report);

        $report->load([
            'category',
            'resident',
            'statusHistories.changedBy',
            'collectionTask.assignedWorker',
            'collectionTask.assignedBy',
            'collectionTask.statusHistories.changedBy',
        ]);

        $workers = User::where('role', User::ROLE_WORKER)
            ->orderBy('name')
            ->get(['id', 'name', 'email']);

        return Inertia::render('admin/reports/show', [
            'report' => $report,
            'workers' => $workers,
        ]);
    }

    /**
     * Review a waste report (approve/reject).
     */
    public function review(ReviewReportRequest $request, WasteReport $report)
    {
        DB::transaction(function () use ($request, $report) {
            $validated = $request->validated();
            $oldStatus = $report->status;
            $newStatus = $validated['status'];

            $report->update(['status' => $newStatus]);

            $report->statusHistories()->create([
                'changed_by' => auth()->id(),
                'old_status' => $oldStatus,
                'new_status' => $newStatus,
                'notes' => $validated['notes'] ?? "Report {$newStatus} by administrator",
            ]);
        });

        return back()->with('success', 'Report reviewed successfully');
    }

    /**
     * Assign a collection task for an approved report.
     */
    public function assignTask(AssignTaskRequest $request, WasteReport $report)
    {
        DB::transaction(function () use ($request, $report) {
            $validated = $request->validated();

            // Create the collection task
            $task = CollectionTask::create([
                'waste_report_id' => $report->id,
                'assigned_worker_id' => $validated['assigned_worker_id'],
                'assigned_by' => auth()->id(),
                'scheduled_at' => $validated['scheduled_at'] ?? null,
                'status' => 'assigned',
            ]);

            // Update report status to 'assigned'
            $oldStatus = $report->status;
            $report->update(['status' => 'assigned']);

            $report->statusHistories()->create([
                'changed_by' => auth()->id(),
                'old_status' => $oldStatus,
                'new_status' => 'assigned',
                'notes' => $validated['notes'] ?? 'Collection task assigned to worker',
            ]);

            // Record task status history
            $task->statusHistories()->create([
                'changed_by' => auth()->id(),
                'old_status' => null,
                'new_status' => 'assigned',
                'notes' => 'Task assigned by administrator',
            ]);
        });

        return back()->with('success', 'Collection task assigned successfully');
    }
}
