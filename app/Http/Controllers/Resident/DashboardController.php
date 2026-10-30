<?php

namespace App\Http\Controllers\Resident;

use App\Http\Controllers\Controller;
use App\Models\WasteReport;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the resident dashboard.
     */
    public function index(): Response
    {
        $residentId = auth()->id();

        // Get metrics for this resident
        $metrics = [
            'total' => WasteReport::where('resident_id', $residentId)->count(),
            'pending' => WasteReport::where('resident_id', $residentId)
                ->where('status', 'pending')
                ->count(),
            'in_progress' => WasteReport::where('resident_id', $residentId)
                ->whereIn('status', ['under_review', 'approved', 'assigned', 'in_progress'])
                ->count(),
            'resolved' => WasteReport::where('resident_id', $residentId)
                ->where('status', 'resolved')
                ->count(),
            'rejected' => WasteReport::where('resident_id', $residentId)
                ->where('status', 'rejected')
                ->count(),
        ];

        // Get recent reports
        $recentReports = WasteReport::with(['category', 'collectionTask.assignedWorker'])
            ->where('resident_id', $residentId)
            ->latest()
            ->limit(10)
            ->get();

        return Inertia::render('resident/dashboard', [
            'metrics' => $metrics,
            'recentReports' => $recentReports,
        ]);
    }
}
