<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CollectionTask;
use App\Models\User;
use App\Models\WasteReport;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index(): Response
    {
        // Report metrics by status
        $reportMetrics = [
            'pending' => WasteReport::where('status', 'pending')->count(),
            'under_review' => WasteReport::where('status', 'under_review')->count(),
            'approved' => WasteReport::where('status', 'approved')->count(),
            'assigned' => WasteReport::where('status', 'assigned')->count(),
            'in_progress' => WasteReport::where('status', 'in_progress')->count(),
            'resolved' => WasteReport::where('status', 'resolved')->count(),
            'rejected' => WasteReport::where('status', 'rejected')->count(),
        ];

        // Task metrics by status
        $taskMetrics = [
            'assigned' => CollectionTask::where('status', 'assigned')->count(),
            'accepted' => CollectionTask::where('status', 'accepted')->count(),
            'in_progress' => CollectionTask::where('status', 'in_progress')->count(),
            'completed' => CollectionTask::where('status', 'completed')->count(),
            'cancelled' => CollectionTask::where('status', 'cancelled')->count(),
        ];

        // User counts by role
        $userMetrics = [
            'residents' => User::where('role', 'resident')->count(),
            'workers' => User::where('role', 'worker')->count(),
            'administrators' => User::where('role', 'administrator')->count(),
        ];

        // Recent reports
        $recentReports = WasteReport::with(['category', 'resident', 'collectionTask.assignedWorker'])
            ->latest()
            ->limit(10)
            ->get();

        // Recent completed tasks
        $recentCompletedTasks = CollectionTask::with([
            'wasteReport.category',
            'assignedWorker',
            'assignedBy',
        ])
            ->where('status', 'completed')
            ->latest('completed_at')
            ->limit(10)
            ->get();

        return Inertia::render('admin/dashboard', [
            'reportMetrics' => $reportMetrics,
            'taskMetrics' => $taskMetrics,
            'userMetrics' => $userMetrics,
            'recentReports' => $recentReports,
            'recentCompletedTasks' => $recentCompletedTasks,
        ]);
    }
}
