<?php

namespace App\Policies;

use App\Models\User;
use App\Models\WasteReport;

class WasteReportPolicy
{
    /**
     * Determine if the user can view any waste reports.
     */
    public function viewAny(User $user): bool
    {
        // Residents can view their own reports (filtered in controller)
        // Workers can view reports for their assigned tasks (filtered in controller)
        // Administrators can view all reports
        return $user->isResident() || $user->isWorker() || $user->isAdministrator();
    }

    /**
     * Determine if the user can view the waste report.
     */
    public function view(User $user, WasteReport $wasteReport): bool
    {
        // Administrators can view any report
        if ($user->isAdministrator()) {
            return true;
        }

        // Residents can only view their own reports
        if ($user->isResident()) {
            return $wasteReport->resident_id === $user->id;
        }

        // Workers can view reports that have an assigned collection task assigned to them
        if ($user->isWorker()) {
            return $wasteReport->collectionTask()
                ->where('assigned_worker_id', $user->id)
                ->exists();
        }

        return false;
    }

    /**
     * Determine if the user can create waste reports.
     */
    public function create(User $user): bool
    {
        // Only residents can create waste reports
        return $user->isResident();
    }

    /**
     * Determine if the user can update the waste report.
     */
    public function update(User $user, WasteReport $wasteReport): bool
    {
        // Administrators can update any report
        if ($user->isAdministrator()) {
            return true;
        }

        // Residents can only update their own reports when status is 'pending'
        if ($user->isResident()) {
            return $wasteReport->resident_id === $user->id
                && $wasteReport->status === 'pending';
        }

        return false;
    }

    /**
     * Determine if the user can delete the waste report.
     */
    public function delete(User $user, WasteReport $wasteReport): bool
    {
        // Only residents can delete their own reports, and only when status is 'pending'
        return $user->isResident()
            && $wasteReport->resident_id === $user->id
            && $wasteReport->status === 'pending';
    }

    /**
     * Determine if the user can review (approve/reject) the waste report.
     */
    public function review(User $user, WasteReport $wasteReport): bool
    {
        // Only administrators can review reports
        return $user->isAdministrator();
    }

    /**
     * Determine if the user can assign a collection task for the report.
     */
    public function assign(User $user, WasteReport $wasteReport): bool
    {
        // Only administrators can assign collection tasks
        return $user->isAdministrator();
    }
}
