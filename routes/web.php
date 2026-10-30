<?php

use App\Http\Controllers\Admin\CollectionTaskController as AdminCollectionTaskController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\WasteReportController as AdminWasteReportController;
use App\Http\Controllers\Resident\DashboardController as ResidentDashboardController;
use App\Http\Controllers\Resident\WasteReportController;
use App\Http\Controllers\Worker\CollectionTaskController;
use App\Http\Controllers\Worker\DashboardController as WorkerDashboardController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth'])->group(function () {
    // Generic dashboard - redirect to role-specific dashboard
    Route::get('dashboard', function () {
        $user = auth()->user();

        return match ($user->role) {
            'resident' => to_route('resident.dashboard'),
            'worker' => to_route('worker.dashboard'),
            'administrator' => to_route('admin.dashboard'),
            default => inertia('dashboard'),
        };
    })->name('dashboard');
});

// Resident waste reporting
Route::middleware(['auth', 'role:resident'])
    ->prefix('resident')
    ->name('resident.')
    ->group(function () {
        Route::get('dashboard', [ResidentDashboardController::class, 'index'])
            ->name('dashboard');
        Route::resource('reports', WasteReportController::class);
    });

// Worker collection tasks
Route::middleware(['auth', 'role:worker'])
    ->prefix('worker')
    ->name('worker.')
    ->group(function () {
        Route::get('dashboard', [WorkerDashboardController::class, 'index'])
            ->name('dashboard');
        Route::get('tasks', [CollectionTaskController::class, 'index'])
            ->name('tasks.index');
        Route::get('tasks/{task}', [CollectionTaskController::class, 'show'])
            ->name('tasks.show');
        Route::post('tasks/{task}/accept', [CollectionTaskController::class, 'accept'])
            ->name('tasks.accept');
        Route::post('tasks/{task}/start', [CollectionTaskController::class, 'start'])
            ->name('tasks.start');
        Route::post('tasks/{task}/complete', [CollectionTaskController::class, 'complete'])
            ->name('tasks.complete');
    });

// Administrator management
Route::middleware(['auth', 'role:administrator'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('dashboard', [AdminDashboardController::class, 'index'])
            ->name('dashboard');

        // Waste report management
        Route::get('reports', [AdminWasteReportController::class, 'index'])
            ->name('reports.index');
        Route::get('reports/{report}', [AdminWasteReportController::class, 'show'])
            ->name('reports.show');
        Route::post('reports/{report}/review', [AdminWasteReportController::class, 'review'])
            ->name('reports.review');
        Route::post('reports/{report}/assign', [AdminWasteReportController::class, 'assignTask'])
            ->name('reports.assign');

        // Collection task management
        Route::get('tasks', [AdminCollectionTaskController::class, 'index'])
            ->name('tasks.index');
        Route::get('tasks/{task}', [AdminCollectionTaskController::class, 'show'])
            ->name('tasks.show');
        Route::post('tasks/{task}/reassign', [AdminCollectionTaskController::class, 'reassign'])
            ->name('tasks.reassign');

        // User management
        Route::get('users', [AdminUserController::class, 'index'])
            ->name('users.index');
        Route::get('users/{user}', [AdminUserController::class, 'show'])
            ->name('users.show');
        Route::patch('users/{user}/role', [AdminUserController::class, 'updateRole'])
            ->name('users.update-role');
    });

require __DIR__.'/settings.php';
