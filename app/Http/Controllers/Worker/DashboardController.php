<?php

namespace App\Http\Controllers\Worker;

use App\Http\Controllers\Controller;
use App\Models\CollectionTask;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the worker dashboard.
     */
    public function index(): Response
    {
        $workerId = auth()->id();

        // Get metrics for this worker
        $metrics = [
            'assigned' => CollectionTask::where('assigned_worker_id', $workerId)
                ->where('status', 'assigned')
                ->count(),
            'accepted' => CollectionTask::where('assigned_worker_id', $workerId)
                ->where('status', 'accepted')
                ->count(),
            'in_progress' => CollectionTask::where('assigned_worker_id', $workerId)
                ->where('status', 'in_progress')
                ->count(),
            'completed' => CollectionTask::where('assigned_worker_id', $workerId)
                ->where('status', 'completed')
                ->count(),
        ];

        // Get recent tasks
        $recentTasks = CollectionTask::with([
            'wasteReport.category',
            'wasteReport.resident',
            'assignedBy',
        ])
            ->where('assigned_worker_id', $workerId)
            ->latest()
            ->limit(10)
            ->get();

        return Inertia::render('worker/dashboard', [
            'metrics' => $metrics,
            'recentTasks' => $recentTasks,
        ]);
    }
}
