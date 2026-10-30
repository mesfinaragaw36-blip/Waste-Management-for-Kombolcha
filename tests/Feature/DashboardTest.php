<?php

use App\Models\CollectionTask;
use App\Models\User;
use App\Models\WasteReport;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated residents are redirected to resident dashboard', function () {
    $user = User::factory()->resident()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('resident.dashboard'));
});

test('authenticated workers are redirected to worker dashboard', function () {
    $user = User::factory()->worker()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('worker.dashboard'));
});

test('authenticated administrators are redirected to admin dashboard', function () {
    $user = User::factory()->administrator()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('admin.dashboard'));
});

test('resident can view resident dashboard', function () {
    $user = User::factory()->resident()->create();
    $this->actingAs($user);

    $response = $this->get(route('resident.dashboard'));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('resident/dashboard')
        ->has('metrics')
        ->has('recentReports')
    );
});

test('worker can view worker dashboard', function () {
    $user = User::factory()->worker()->create();
    $this->actingAs($user);

    $response = $this->get(route('worker.dashboard'));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('worker/dashboard')
        ->has('metrics')
        ->has('recentTasks')
    );
});

test('admin can view admin dashboard', function () {
    $user = User::factory()->administrator()->create();
    $this->actingAs($user);

    $response = $this->get(route('admin.dashboard'));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/dashboard')
        ->has('reportMetrics')
        ->has('taskMetrics')
        ->has('userMetrics')
        ->has('recentReports')
        ->has('recentCompletedTasks')
    );
});

test('resident cannot view worker dashboard', function () {
    $user = User::factory()->resident()->create();
    $this->actingAs($user);

    $response = $this->get(route('worker.dashboard'));
    $response->assertForbidden();
});

test('resident cannot view admin dashboard', function () {
    $user = User::factory()->resident()->create();
    $this->actingAs($user);

    $response = $this->get(route('admin.dashboard'));
    $response->assertForbidden();
});

test('worker cannot view resident dashboard', function () {
    $user = User::factory()->worker()->create();
    $this->actingAs($user);

    $response = $this->get(route('resident.dashboard'));
    $response->assertForbidden();
});

test('worker cannot view admin dashboard', function () {
    $user = User::factory()->worker()->create();
    $this->actingAs($user);

    $response = $this->get(route('admin.dashboard'));
    $response->assertForbidden();
});

test('admin cannot view resident dashboard', function () {
    $user = User::factory()->administrator()->create();
    $this->actingAs($user);

    $response = $this->get(route('resident.dashboard'));
    $response->assertForbidden();
});

test('admin cannot view worker dashboard', function () {
    $user = User::factory()->administrator()->create();
    $this->actingAs($user);

    $response = $this->get(route('worker.dashboard'));
    $response->assertForbidden();
});

test('resident dashboard shows accurate metrics', function () {
    $resident = User::factory()->resident()->create();
    $otherResident = User::factory()->resident()->create();

    // Create reports for the current resident
    WasteReport::factory()->for($resident, 'resident')->create(['status' => 'pending']);
    WasteReport::factory()->for($resident, 'resident')->create(['status' => 'pending']);
    WasteReport::factory()->for($resident, 'resident')->create(['status' => 'approved']);
    WasteReport::factory()->for($resident, 'resident')->create(['status' => 'resolved']);
    WasteReport::factory()->for($resident, 'resident')->create(['status' => 'rejected']);

    // Create reports for another resident (should not appear)
    WasteReport::factory()->for($otherResident, 'resident')->create(['status' => 'pending']);

    $this->actingAs($resident);
    $response = $this->get(route('resident.dashboard'));

    $response->assertInertia(fn ($page) => $page
        ->where('metrics.total', 5)
        ->where('metrics.pending', 2)
        ->where('metrics.in_progress', 1)
        ->where('metrics.resolved', 1)
        ->where('metrics.rejected', 1)
    );
});

test('worker dashboard shows accurate metrics', function () {
    $worker = User::factory()->worker()->create();
    $otherWorker = User::factory()->worker()->create();
    $admin = User::factory()->administrator()->create();

    $resident = User::factory()->resident()->create();
    $report1 = WasteReport::factory()->for($resident, 'resident')->create();
    $report2 = WasteReport::factory()->for($resident, 'resident')->create();
    $report3 = WasteReport::factory()->for($resident, 'resident')->create();
    $report4 = WasteReport::factory()->for($resident, 'resident')->create();
    $report5 = WasteReport::factory()->for($resident, 'resident')->create();

    // Create tasks for the current worker
    CollectionTask::factory()->create([
        'waste_report_id' => $report1->id,
        'assigned_worker_id' => $worker->id,
        'assigned_by' => $admin->id,
        'status' => 'assigned',
    ]);
    CollectionTask::factory()->create([
        'waste_report_id' => $report2->id,
        'assigned_worker_id' => $worker->id,
        'assigned_by' => $admin->id,
        'status' => 'accepted',
    ]);
    CollectionTask::factory()->create([
        'waste_report_id' => $report3->id,
        'assigned_worker_id' => $worker->id,
        'assigned_by' => $admin->id,
        'status' => 'in_progress',
    ]);
    CollectionTask::factory()->create([
        'waste_report_id' => $report4->id,
        'assigned_worker_id' => $worker->id,
        'assigned_by' => $admin->id,
        'status' => 'completed',
    ]);

    // Create task for another worker (should not appear)
    CollectionTask::factory()->create([
        'waste_report_id' => $report5->id,
        'assigned_worker_id' => $otherWorker->id,
        'assigned_by' => $admin->id,
        'status' => 'assigned',
    ]);

    $this->actingAs($worker);
    $response = $this->get(route('worker.dashboard'));

    $response->assertInertia(fn ($page) => $page
        ->where('metrics.assigned', 1)
        ->where('metrics.accepted', 1)
        ->where('metrics.in_progress', 1)
        ->where('metrics.completed', 1)
    );
});

test('admin dashboard shows system-wide metrics', function () {
    $admin = User::factory()->administrator()->create();
    $worker = User::factory()->worker()->create();
    $resident1 = User::factory()->resident()->create();
    $resident2 = User::factory()->resident()->create();

    // Create reports
    $report1 = WasteReport::factory()->for($resident1, 'resident')->create(['status' => 'pending']);
    $report2 = WasteReport::factory()->for($resident1, 'resident')->create(['status' => 'approved']);
    $report3 = WasteReport::factory()->for($resident2, 'resident')->create(['status' => 'resolved']);

    // Create tasks
    CollectionTask::factory()->create([
        'waste_report_id' => $report2->id,
        'assigned_worker_id' => $worker->id,
        'assigned_by' => $admin->id,
        'status' => 'assigned',
    ]);
    CollectionTask::factory()->create([
        'waste_report_id' => $report3->id,
        'assigned_worker_id' => $worker->id,
        'assigned_by' => $admin->id,
        'status' => 'completed',
    ]);

    $this->actingAs($admin);
    $response = $this->get(route('admin.dashboard'));

    $response->assertInertia(fn ($page) => $page
        ->where('reportMetrics.pending', 1)
        ->where('reportMetrics.approved', 1)
        ->where('reportMetrics.resolved', 1)
        ->where('taskMetrics.assigned', 1)
        ->where('taskMetrics.completed', 1)
        ->where('userMetrics.residents', 2)
        ->where('userMetrics.workers', 1)
        ->where('userMetrics.administrators', 1)
    );
});

test('resident dashboard only shows their own recent reports', function () {
    $resident = User::factory()->resident()->create();
    $otherResident = User::factory()->resident()->create();

    // Create reports for the current resident
    WasteReport::factory()->for($resident, 'resident')->count(5)->create();

    // Create reports for another resident
    WasteReport::factory()->for($otherResident, 'resident')->count(3)->create();

    $this->actingAs($resident);
    $response = $this->get(route('resident.dashboard'));

    $response->assertInertia(fn ($page) => $page
        ->has('recentReports', 5)
        ->where('recentReports.0.resident_id', $resident->id)
    );
});

test('worker dashboard only shows their own recent tasks', function () {
    $worker = User::factory()->worker()->create();
    $otherWorker = User::factory()->worker()->create();
    $admin = User::factory()->administrator()->create();
    $resident = User::factory()->resident()->create();

    // Create tasks for the current worker
    $reports = WasteReport::factory()->for($resident, 'resident')->count(5)->create();
    foreach ($reports as $report) {
        CollectionTask::factory()->create([
            'waste_report_id' => $report->id,
            'assigned_worker_id' => $worker->id,
            'assigned_by' => $admin->id,
        ]);
    }

    // Create tasks for another worker
    $otherReports = WasteReport::factory()->for($resident, 'resident')->count(3)->create();
    foreach ($otherReports as $report) {
        CollectionTask::factory()->create([
            'waste_report_id' => $report->id,
            'assigned_worker_id' => $otherWorker->id,
            'assigned_by' => $admin->id,
        ]);
    }

    $this->actingAs($worker);
    $response = $this->get(route('worker.dashboard'));

    $response->assertInertia(fn ($page) => $page
        ->has('recentTasks', 5)
        ->where('recentTasks.0.assigned_worker_id', $worker->id)
    );
});
