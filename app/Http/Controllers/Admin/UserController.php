<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateUserRoleRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', User::class);

        $query = User::query();

        // Filter by role
        if ($request->filled('role')) {
            $query->where('role', $request->input('role'));
        }

        // Search by name or email
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query
            ->withCount(['wasteReports', 'assignedCollectionTasks', 'createdCollectionTasks'])
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'filters' => $request->only(['role', 'search']),
            'roles' => User::VALID_ROLES,
        ]);
    }

    /**
     * Display the specified user.
     */
    public function show(User $user): Response
    {
        $this->authorize('view', $user);

        $user->loadCount([
            'wasteReports',
            'assignedCollectionTasks',
            'createdCollectionTasks',
            'reportStatusChanges',
            'taskStatusChanges',
        ]);

        // Load recent activity based on role
        if ($user->isResident()) {
            $user->load(['wasteReports' => function ($query) {
                $query->with('category')->latest()->limit(5);
            }]);
        } elseif ($user->isWorker()) {
            $user->load(['assignedCollectionTasks' => function ($query) {
                $query->with('wasteReport')->latest()->limit(5);
            }]);
        }

        return Inertia::render('admin/users/show', [
            'user' => $user,
            'roles' => User::VALID_ROLES,
        ]);
    }

    /**
     * Update the user's role.
     */
    public function updateRole(UpdateUserRoleRequest $request, User $user)
    {
        $validated = $request->validated();

        $oldRole = $user->role;
        $user->update(['role' => $validated['role']]);

        return back()->with('success', "User role updated from {$oldRole} to {$validated['role']}");
    }
}
