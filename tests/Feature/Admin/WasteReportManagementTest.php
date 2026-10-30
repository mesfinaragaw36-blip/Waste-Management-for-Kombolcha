<?php

use App\Models\CollectionTask;
use App\Models\User;
use App\Models\WasteReport;

// Index Tests
test('administrator can view all reports index', function () {
    $admin = User::factory()->administrator()->create();
    $reports = WasteReport::factory()->count(3)->create();

    $response = $this->actingAs($admin)->get(route('admin.reports.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/reports/index')
        ->has('reports.data', 3)
    );
});

test('administrator can filter reports by status', function () {
    $admin = User::factory()->administrator()->create();
    WasteReport::factory()->create(['status' => 'pending']);
    WasteReport::factory()->create(['status' => 'approved']);

    $response = $this->actingAs($admin)->get(route('admin.reports.index', ['status' => 'pending']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('reports.data', 1)
        ->where('reports.data.0.status', 'pending')
    );
});

test('administrator can filter reports by priority', function () {
    $admin = User::factory()->administrator()->create();
    WasteReport::factory()->create(['priority' => 'high']);
    WasteReport::factory()->create(['priority' => 'low']);

    $response = $this->actingAs($admin)->get(route('admin.reports.index', ['priority' => 'high']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('reports.data', 1)
        ->where('reports.data.0.priority', 'high')
    );
});

test('administrator can search reports', function () {
    $admin = User::factory()->administrator()->create();
    WasteReport::factory()->create(['title' => 'Overflowing bin']);
    WasteReport::factory()->create(['title' => 'Illegal dumping']);

    $response = $this->actingAs($admin)->get(route('admin.reports.index', ['search' => 'Overflowing']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('reports.data', 1)
        ->where('reports.data.0.title', 'Overflowing bin')
    );
});

test('resident cannot access admin reports index', function () {
    $resident = User::factory()->resident()->create();

    $response = $this->actingAs($resident)->get(route('admin.reports.index'));

    $response->assertForbidden();
});

test('worker cannot access admin reports index', function () {
    $worker = User::factory()->worker()->create();

    $response = $this->actingAs($worker)->get(route('admin.reports.index'));

    $response->assertForbidden();
});

test('guest cannot access admin reports index', function () {
    $response = $this->get(route('admin.reports.index'));

    $response->assertRedirect(route('login'));
});

// Show Tests
test('administrator can view any report', function () {
    $admin = User::factory()->administrator()->create();
    $report = WasteReport::factory()->create();

    $response = $this->actingAs($admin)->get(route('admin.reports.show', $report));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/reports/show')
        ->where('report.id', $report->id)
    );
});

test('administrator can see report with all relationships', function () {
    $admin = User::factory()->administrator()->create();
    $report = WasteReport::factory()->create();

    $response = $this->actingAs($admin)->get(route('admin.reports.show', $report));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('report.category')
        ->has('report.resident')
        ->has('report.status_histories')
    );
});

// Review Tests
test('administrator can move pending report to under_review', function () {
    $admin = User::factory()->administrator()->create();
    $report = WasteReport::factory()->pending()->create();

    $response = $this->actingAs($admin)->post(route('admin.reports.review', $report), [
        'status' => 'under_review',
        'notes' => 'Starting review process',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('waste_reports', [
        'id' => $report->id,
        'status' => 'under_review',
    ]);
    $this->assertDatabaseHas('report_status_histories', [
        'waste_report_id' => $report->id,
        'new_status' => 'under_review',
        'changed_by' => $admin->id,
    ]);
});

test('administrator can approve report under review', function () {
    $admin = User::factory()->administrator()->create();
    $report = WasteReport::factory()->underReview()->create();

    $response = $this->actingAs($admin)->post(route('admin.reports.review', $report), [
        'status' => 'approved',
        'notes' => 'Report approved for action',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('waste_reports', [
        'id' => $report->id,
        'status' => 'approved',
    ]);
});

test('administrator can reject pending report', function () {
    $admin = User::factory()->administrator()->create();
    $report = WasteReport::factory()->pending()->create();

    $response = $this->actingAs($admin)->post(route('admin.reports.review', $report), [
        'status' => 'rejected',
        'notes' => 'Not enough information provided',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('waste_reports', [
        'id' => $report->id,
        'status' => 'rejected',
    ]);
});

test('rejection requires notes', function () {
    $admin = User::factory()->administrator()->create();
    $report = WasteReport::factory()->pending()->create();

    $response = $this->actingAs($admin)->post(route('admin.reports.review', $report), [
        'status' => 'rejected',
        'notes' => '',
    ]);

    $response->assertSessionHasErrors('notes');
});

test('cannot review report with invalid status transition', function () {
    $admin = User::factory()->administrator()->create();
    $report = WasteReport::factory()->approved()->create();

    $response = $this->actingAs($admin)->post(route('admin.reports.review', $report), [
        'status' => 'under_review',
    ]);

    $response->assertStatus(422);
});

test('resident cannot review reports', function () {
    $resident = User::factory()->resident()->create();
    $report = WasteReport::factory()->pending()->create();

    $response = $this->actingAs($resident)->post(route('admin.reports.review', $report), [
        'status' => 'approved',
    ]);

    $response->assertForbidden();
});

// Assign Task Tests
test('administrator can assign approved report to worker', function () {
    $admin = User::factory()->administrator()->create();
    $worker = User::factory()->worker()->create();
    $report = WasteReport::factory()->approved()->create();

    $response = $this->actingAs($admin)->post(route('admin.reports.assign', $report), [
        'assigned_worker_id' => $worker->id,
        'scheduled_at' => now()->addDay()->format('Y-m-d'),
        'notes' => 'Urgent task',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('waste_reports', [
        'id' => $report->id,
        'status' => 'assigned',
    ]);
    $this->assertDatabaseHas('collection_tasks', [
        'waste_report_id' => $report->id,
        'assigned_worker_id' => $worker->id,
        'assigned_by' => $admin->id,
        'status' => 'assigned',
    ]);
});

test('assigning task creates status histories for both report and task', function () {
    $admin = User::factory()->administrator()->create();
    $worker = User::factory()->worker()->create();
    $report = WasteReport::factory()->approved()->create();

    $this->actingAs($admin)->post(route('admin.reports.assign', $report), [
        'assigned_worker_id' => $worker->id,
    ]);

    $this->assertDatabaseHas('report_status_histories', [
        'waste_report_id' => $report->id,
        'new_status' => 'assigned',
        'changed_by' => $admin->id,
    ]);

    $task = CollectionTask::where('waste_report_id', $report->id)->first();
    $this->assertDatabaseHas('task_status_histories', [
        'collection_task_id' => $task->id,
        'new_status' => 'assigned',
        'changed_by' => $admin->id,
    ]);
});

test('cannot assign report that is not approved', function () {
    $admin = User::factory()->administrator()->create();
    $worker = User::factory()->worker()->create();
    $report = WasteReport::factory()->pending()->create();

    $response = $this->actingAs($admin)->post(route('admin.reports.assign', $report), [
        'assigned_worker_id' => $worker->id,
    ]);

    $response->assertStatus(422);
});

test('cannot assign report that already has a task', function () {
    $admin = User::factory()->administrator()->create();
    $worker = User::factory()->worker()->create();
    $report = WasteReport::factory()->approved()->create();
    CollectionTask::factory()->for($report, 'wasteReport')->create();

    $response = $this->actingAs($admin)->post(route('admin.reports.assign', $report), [
        'assigned_worker_id' => $worker->id,
    ]);

    $response->assertStatus(422);
});

test('assigned worker must be a worker role', function () {
    $admin = User::factory()->administrator()->create();
    $resident = User::factory()->resident()->create();
    $report = WasteReport::factory()->approved()->create();

    $response = $this->actingAs($admin)->post(route('admin.reports.assign', $report), [
        'assigned_worker_id' => $resident->id,
    ]);

    $response->assertSessionHasErrors('assigned_worker_id');
});

test('scheduled date must be in the future', function () {
    $admin = User::factory()->administrator()->create();
    $worker = User::factory()->worker()->create();
    $report = WasteReport::factory()->approved()->create();

    $response = $this->actingAs($admin)->post(route('admin.reports.assign', $report), [
        'assigned_worker_id' => $worker->id,
        'scheduled_at' => now()->subDay()->format('Y-m-d'),
    ]);

    $response->assertSessionHasErrors('scheduled_at');
});

test('resident cannot assign tasks', function () {
    $resident = User::factory()->resident()->create();
    $worker = User::factory()->worker()->create();
    $report = WasteReport::factory()->approved()->create();

    $response = $this->actingAs($resident)->post(route('admin.reports.assign', $report), [
        'assigned_worker_id' => $worker->id,
    ]);

    $response->assertForbidden();
});

test('worker cannot assign tasks', function () {
    $worker = User::factory()->worker()->create();
    $anotherWorker = User::factory()->worker()->create();
    $report = WasteReport::factory()->approved()->create();

    $response = $this->actingAs($worker)->post(route('admin.reports.assign', $report), [
        'assigned_worker_id' => $anotherWorker->id,
    ]);

    $response->assertForbidden();
});
