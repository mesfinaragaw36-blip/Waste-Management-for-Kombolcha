<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Determine if the user can view any users.
     */
    public function viewAny(User $user): bool
    {
        // Only administrators can list users
        return $user->isAdministrator();
    }

    /**
     * Determine if the user can view the model.
     */
    public function view(User $user, User $model): bool
    {
        // Users can view their own profile
        if ($user->id === $model->id) {
            return true;
        }

        // Administrators can view any user
        return $user->isAdministrator();
    }

    /**
     * Determine if the user can create users.
     */
    public function create(User $user): bool
    {
        // Only administrators can create users
        return $user->isAdministrator();
    }

    /**
     * Determine if the user can update the model.
     */
    public function update(User $user, User $model): bool
    {
        // Users can update their own profile (through ProfileController)
        if ($user->id === $model->id) {
            return true;
        }

        // Administrators can update any user (except role changes handled separately)
        return $user->isAdministrator();
    }

    /**
     * Determine if the user can delete the model.
     */
    public function delete(User $user, User $model): bool
    {
        // Users can delete their own account
        if ($user->id === $model->id) {
            return true;
        }

        // Administrators can delete other users (but not themselves through this method)
        return $user->isAdministrator();
    }

    /**
     * Determine if the user can change roles.
     */
    public function changeRole(User $user, User $model): bool
    {
        // Only administrators can change user roles
        // Users cannot change their own role
        return $user->isAdministrator() && $user->id !== $model->id;
    }

    /**
     * Determine if the user can manage users (general admin operations).
     */
    public function manage(User $user): bool
    {
        // Only administrators can manage users
        return $user->isAdministrator();
    }
}
