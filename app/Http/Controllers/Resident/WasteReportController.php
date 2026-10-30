<?php

namespace App\Http\Controllers\Resident;

use App\Http\Controllers\Controller;
use App\Http\Requests\Resident\StoreWasteReportRequest;
use App\Http\Requests\Resident\UpdateWasteReportRequest;
use App\Models\WasteCategory;
use App\Models\WasteReport;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class WasteReportController extends Controller
{
    /**
     * Display a listing of the authenticated resident's reports.
     */
    public function index(): Response
    {
        $reports = WasteReport::with(['category', 'statusHistories.changedBy'])
            ->where('resident_id', auth()->id())
            ->latest()
            ->paginate(15);

        return Inertia::render('resident/reports/index', [
            'reports' => $reports,
        ]);
    }

    /**
     * Show the form for creating a new report.
     */
    public function create(): Response
    {
        $this->authorize('create', WasteReport::class);

        $categories = WasteCategory::where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('resident/reports/create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created report in storage.
     */
    public function store(StoreWasteReportRequest $request)
    {
        $this->authorize('create', WasteReport::class);

        $validated = $request->validated();
        $validated['resident_id'] = auth()->id();
        $validated['status'] = 'pending';

        if ($request->hasFile('photo')) {
            $validated['photo_path'] = $request->file('photo')->store('waste-reports', 'public');
        }

        $report = WasteReport::create($validated);

        $report->statusHistories()->create([
            'changed_by' => auth()->id(),
            'old_status' => null,
            'new_status' => 'pending',
            'notes' => 'Report created by resident',
        ]);

        return to_route('resident.reports.show', $report)
            ->with('success', 'Report created successfully');
    }

    /**
     * Display the specified report.
     */
    public function show(WasteReport $report): Response
    {
        $this->authorize('view', $report);

        $report->load(['category', 'statusHistories.changedBy']);

        return Inertia::render('resident/reports/show', [
            'report' => $report,
        ]);
    }

    /**
     * Show the form for editing the specified report.
     */
    public function edit(WasteReport $report): Response
    {
        $this->authorize('update', $report);

        $categories = WasteCategory::where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('resident/reports/edit', [
            'report' => $report,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified report in storage.
     */
    public function update(UpdateWasteReportRequest $request, WasteReport $report)
    {
        $this->authorize('update', $report);

        $validated = $request->validated();

        if ($request->hasFile('photo')) {
            if ($report->photo_path) {
                Storage::disk('public')->delete($report->photo_path);
            }
            $validated['photo_path'] = $request->file('photo')->store('waste-reports', 'public');
        }

        $report->update($validated);

        return to_route('resident.reports.show', $report)
            ->with('success', 'Report updated successfully');
    }

    /**
     * Remove the specified report from storage.
     */
    public function destroy(WasteReport $report)
    {
        $this->authorize('delete', $report);

        if ($report->photo_path) {
            Storage::disk('public')->delete($report->photo_path);
        }

        $report->delete();

        return to_route('resident.reports.index')
            ->with('success', 'Report deleted successfully');
    }
}
