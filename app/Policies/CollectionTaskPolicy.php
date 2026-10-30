<?php

namespace App\Policies;

use App\Models\CollectionTask;
use App\Models\User;

class CollectionTaskPolicy
{
    /**
     * Determine if the user can view any collection tasks.
     */
    public function viewAny(User $user): bool
    {
        // Workers can view their assigned tasks
        // Administrators can view all tasks
        // Residents cannot view collection tasks
        return $user->isWorker() || $user->isAdministrator();
    }

    /**
     * Determine if the user can view the collection task.
     */
    public function view(User $user, CollectionTask $collectionTask): bool
    {
        // Administrators can view any task
        if ($user->isAdministrator()) {
            return true;
        }

        // Workers can only view tasks assigned to them
        if ($user->isWorker()) {
            return $collectionTask->assigned_worker_id === $user->id;
        }

        // Residents cannot view collection tasks
        return false;
    }

    /**
     * Determine if the user can create collection tasks.
     */
    public function create(User $user): bool
    {
        // Only administrators can create collection tasks
        return $user->isAdministrator();
    }

    /**
     * Determine if the user can update the collection task.
     */
    public function update(User $user, CollectionTask $collectionTask): bool
    {
        // Administrators can update any task
        if ($user->isAdministrator()) {
            return true;
        }

        // Workers can update tasks assigned to them (status, completion notes, photo)
        if ($user->isWorker()) {
            return $collectionTask->assigned_worker_id === $user->id;
        }

        return false;
    }

    /**
     * Determine if the user can delete the collection task.
     */
    public function delete(User $user, CollectionTask $collectionTask): bool
    {
        // Only administrators can delete tasks
        return $user->isAdministrator();
    }

    /**
     * Determine if the user can accept the collection task.
     */
    public function accept(User $user, CollectionTask $collectionTask): bool
    {
        // Workers can accept tasks assigned to them
        return $user->isWorker()
            && $collectionTask->assigned_worker_id === $user->id
            && $collectionTask->status === 'assigned';
    }

    /**
     * Determine if the user can start the collection task.
     */
    public function start(User $user, CollectionTask $collectionTask): bool
    {
        // Workers can start tasks assigned to them
        return $user->isWorker()
            && $collectionTask->assigned_worker_id === $user->id
            && in_array($collectionTask->status, ['assigned', 'accepted']);
    }

    /**
     * Determine if the user can complete the collection task.
     */
    public function complete(User $user, CollectionTask $collectionTask): bool
    {
        // Workers can complete tasks assigned to them
        return $user->isWorker()
            && $collectionTask->assigned_worker_id === $user->id
            && $collectionTask->status === 'in_progress';
    }

    /**
     * Determine if the user can cancel the collection task.
     */
    public function cancel(User $user, CollectionTask $collectionTask): bool
    {
        // Administrators can cancel any task
        return $user->isAdministrator();
    }

    /**
     * Determine if the user can assign the collection task to a worker.
     */
    public function assign(User $user): bool
    {
        // Only administrators can assign tasks
        return $user->isAdministrator();
    }
}
