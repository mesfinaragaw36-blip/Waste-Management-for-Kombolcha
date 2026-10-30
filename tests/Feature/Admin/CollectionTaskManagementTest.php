<?php

use App\Models\CollectionTask;
use App\Models\User;
use App\Models\WasteReport;

// Index Tests
test('administrator can view all tasks index', function () {
    $admin = User::factory()->administrator()->create();
    $tasks = CollectionTask::factory()->count(3)->create();

    $response = $this->actingAs($admin)->get(route('admin.tasks.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/tasks/index')
        ->has('tasks.data', 3)
    );
});

test('administrator can filter tasks by status', function () {
    $admin = User::factory()->administrator()->create();
    CollectionTask::factory()->create(['status' => 'assigned']);
    CollectionTask::factory()->create(['status' => 'completed']);

    $response = $this->actingAs($admin)->get(route('admin.tasks.index', ['status' => 'assigned']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('tasks.data', 1)
        ->where('tasks.data.0.status', 'assigned')
    );
});

test('administrator can filter tasks by worker', function () {
    $admin = User::factory()->administrator()->create();
    $worker1 = User::factory()->worker()->create();
    $worker2 = User::factory()->worker()->create();

    CollectionTask::factory()->for($worker1, 'assignedWorker')->create();
    CollectionTask::factory()->for($worker2, 'assignedWorker')->create();

    $response = $this->actingAs($admin)->get(route('admin.tasks.index', ['worker_id' => $worker1->id]));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('tasks.data', 1)
        ->where('tasks.data.0.assigned_worker_id', $worker1->id)
    );
});

test('administrator can search tasks by report title', function () {
    $admin = User::factory()->administrator()->create();
    $report1 = WasteReport::factory()->create(['title' => 'Overflowing bin']);
    $report2 = WasteReport::factory()->create(['title' => 'Broken container']);

    CollectionTask::factory()->for($report1, 'wasteReport')->create();
    CollectionTask::factory()->for($report2, 'wasteReport')->create();

    $response = $this->actingAs($admin)->get(route('admin.tasks.index', ['search' => 'Overflowing']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->has('tasks.data', 1));
});

test('resident cannot access admin tasks index', function () {
    $resident = User::factory()->resident()->create();

    $response = $this->actingAs($resident)->get(route('admin.tasks.index'));

    $response->assertForbidden();
});

test('worker cannot access admin tasks index', function () {
    $worker = User::factory()->worker()->create();

    $response = $this->actingAs($worker)->get(route('admin.tasks.index'));

    $response->assertForbidden();
});

test('guest cannot access admin tasks index', function () {
    $response = $this->get(route('admin.tasks.index'));

    $response->assertRedirect(route('login'));
});

// Show Tests
test('administrator can view any task', function () {
    $admin = User::factory()->administrator()->create();
    $task = CollectionTask::factory()->create();

    $response = $this->actingAs($admin)->get(route('admin.tasks.show', $task));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/tasks/show')
        ->where('task.id', $task->id)
    );
});

test('administrator can see task with all relationships', function () {
    $admin = User::factory()->administrator()->create();
    $task = CollectionTask::factory()->create();

    $response = $this->actingAs($admin)->get(route('admin.tasks.show', $task));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('task.waste_report')
        ->has('task.assigned_worker')
        ->has('task.assigned_by')
        ->has('task.status_histories')
    );
});

test('resident cannot view admin task details', function () {
    $resident = User::factory()->resident()->create();
    $task = CollectionTask::factory()->create();

    $response = $this->actingAs($resident)->get(route('admin.tasks.show', $task));

    $response->assertForbidden();
});

// Reassign Tests
test('administrator can reassign task to different worker', function () {
    $admin = User::factory()->administrator()->create();
    $worker1 = User::factory()->worker()->create();
    $worker2 = User::factory()->worker()->create();
    $task = CollectionTask::factory()->assigned()->for($worker1, 'assignedWorker')->create();

    $response = $this->actingAs($admin)->post(route('admin.tasks.reassign', $task), [
        'assigned_worker_id' => $worker2->id,
        'notes' => 'Reassigning due to workload',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('collection_tasks', [
        'id' => $task->id,
        'assigned_worker_id' => $worker2->id,
        'status' => 'assigned',
    ]);
});

test('reassigning task creates status history', function () {
    $admin = User::factory()->administrator()->create();
    $worker1 = User::factory()->worker()->create();
    $worker2 = User::factory()->worker()->create();
    $task = CollectionTask::factory()->accepted()->for($worker1, 'assignedWorker')->create();

    $this->actingAs($admin)->post(route('admin.tasks.reassign', $task), [
        'assigned_worker_id' => $worker2->id,
    ]);

    $this->assertDatabaseHas('task_status_histories', [
        'collection_task_id' => $task->id,
        'new_status' => 'assigned',
        'changed_by' => $admin->id,
    ]);
});

test('reassigning task resets status to assigned', function () {
    $admin = User::factory()->administrator()->create();
    $worker1 = User::factory()->worker()->create();
    $worker2 = User::factory()->worker()->create();
    $task = CollectionTask::factory()
        ->inProgress()
        ->for($worker1, 'assignedWorker')
        ->create(['started_at' => now()]);

    $this->actingAs($admin)->post(route('admin.tasks.reassign', $task), [
        'assigned_worker_id' => $worker2->id,
    ]);

    $task->refresh();
    expect($task->status)->toBe('assigned');
    expect($task->started_at)->toBeNull();
});

test('cannot reassign completed task', function () {
    $admin = User::factory()->administrator()->create();
    $worker1 = User::factory()->worker()->create();
    $worker2 = User::factory()->worker()->create();
    $task = CollectionTask::factory()->completed()->for($worker1, 'assignedWorker')->create();

    $response = $this->actingAs($admin)->post(route('admin.tasks.reassign', $task), [
        'assigned_worker_id' => $worker2->id,
    ]);

    $response->assertStatus(422);
});

test('cannot reassign cancelled task', function () {
    $admin = User::factory()->administrator()->create();
    $worker1 = User::factory()->worker()->create();
    $worker2 = User::factory()->worker()->create();
    $task = CollectionTask::factory()->cancelled()->for($worker1, 'assignedWorker')->create();

    $response = $this->actingAs($admin)->post(route('admin.tasks.reassign', $task), [
        'assigned_worker_id' => $worker2->id,
    ]);

    $response->assertStatus(422);
});

test('reassigned worker must be a worker role', function () {
    $admin = User::factory()->administrator()->create();
    $worker = User::factory()->worker()->create();
    $resident = User::factory()->resident()->create();
    $task = CollectionTask::factory()->for($worker, 'assignedWorker')->create();

    $response = $this->actingAs($admin)->post(route('admin.tasks.reassign', $task), [
        'assigned_worker_id' => $resident->id,
    ]);

    $response->assertSessionHasErrors('assigned_worker_id');
});

test('resident cannot reassign tasks', function () {
    $resident = User::factory()->resident()->create();
    $worker1 = User::factory()->worker()->create();
    $worker2 = User::factory()->worker()->create();
    $task = CollectionTask::factory()->for($worker1, 'assignedWorker')->create();

    $response = $this->actingAs($resident)->post(route('admin.tasks.reassign', $task), [
        'assigned_worker_id' => $worker2->id,
    ]);

    $response->assertForbidden();
});

test('worker cannot reassign tasks', function () {
    $worker1 = User::factory()->worker()->create();
    $worker2 = User::factory()->worker()->create();
    $task = CollectionTask::factory()->for($worker1, 'assignedWorker')->create();

    $response = $this->actingAs($worker1)->post(route('admin.tasks.reassign', $task), [
        'assigned_worker_id' => $worker2->id,
    ]);

    $response->assertForbidden();
});
