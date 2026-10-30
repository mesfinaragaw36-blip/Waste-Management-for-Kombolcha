<?php

use App\Models\CollectionTask;
use App\Models\User;
use App\Models\WasteReport;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
});

// Index Tests
test('worker can view their tasks index', function () {
    $worker = User::factory()->worker()->create();
    $task = CollectionTask::factory()->for($worker, 'assignedWorker')->create();

    $response = $this->actingAs($worker)->get(route('worker.tasks.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('worker/tasks/index')
        ->has('tasks.data', 1)
        ->where('tasks.data.0.id', $task->id)
    );
});

test('worker only sees their assigned tasks in index', function () {
    $worker = User::factory()->worker()->create();
    $otherWorker = User::factory()->worker()->create();

    $myTask = CollectionTask::factory()->for($worker, 'assignedWorker')->create();
    $otherTask = CollectionTask::factory()->for($otherWorker, 'assignedWorker')->create();

    $response = $this->actingAs($worker)->get(route('worker.tasks.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('tasks.data', 1)
        ->where('tasks.data.0.id', $myTask->id)
    );
});

test('worker cannot access another workers tasks', function () {
    $worker = User::factory()->worker()->create();
    $otherWorker = User::factory()->worker()->create();
    $task = CollectionTask::factory()->for($otherWorker, 'assignedWorker')->create();

    $response = $this->actingAs($worker)->get(route('worker.tasks.show', $task));

    $response->assertForbidden();
});

test('resident cannot access worker tasks index', function () {
    $resident = User::factory()->resident()->create();

    $response = $this->actingAs($resident)->get(route('worker.tasks.index'));

    $response->assertForbidden();
});

test('administrator cannot access worker tasks index via worker route', function () {
    $admin = User::factory()->administrator()->create();

    $response = $this->actingAs($admin)->get(route('worker.tasks.index'));

    $response->assertForbidden();
});

test('guest cannot access worker tasks index', function () {
    $response = $this->get(route('worker.tasks.index'));

    $response->assertRedirect(route('login'));
});

// Show Tests
test('worker can view their assigned task', function () {
    $worker = User::factory()->worker()->create();
    $task = CollectionTask::factory()->for($worker, 'assignedWorker')->create();

    $response = $this->actingAs($worker)->get(route('worker.tasks.show', $task));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('worker/tasks/show')
        ->where('task.id', $task->id)
    );
});

test('worker cannot view task assigned to another worker', function () {
    $worker = User::factory()->worker()->create();
    $otherWorker = User::factory()->worker()->create();
    $task = CollectionTask::factory()->for($otherWorker, 'assignedWorker')->create();

    $response = $this->actingAs($worker)->get(route('worker.tasks.show', $task));

    $response->assertForbidden();
});

test('worker can see associated report details in task view', function () {
    $worker = User::factory()->worker()->create();
    $report = WasteReport::factory()->create(['title' => 'Test Report']);
    $task = CollectionTask::factory()->for($worker, 'assignedWorker')->for($report, 'wasteReport')->create();

    $response = $this->actingAs($worker)->get(route('worker.tasks.show', $task));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('task.waste_report.title', 'Test Report')
    );
});

// Accept Tests
test('worker can accept pending task', function () {
    $worker = User::factory()->worker()->create();
    $task = CollectionTask::factory()->for($worker, 'assignedWorker')->create(['status' => 'assigned']);

    $response = $this->actingAs($worker)->post(route('worker.tasks.accept', $task));

    $response->assertRedirect(route('worker.tasks.show', $task));
    $this->assertDatabaseHas('collection_tasks', [
        'id' => $task->id,
        'status' => 'accepted',
    ]);
});

test('worker cannot accept already accepted task', function () {
    $worker = User::factory()->worker()->create();
    $task = CollectionTask::factory()->for($worker, 'assignedWorker')->create(['status' => 'accepted']);

    $response = $this->actingAs($worker)->post(route('worker.tasks.accept', $task));

    $response->assertStatus(422);
});

test('worker cannot accept another workers task', function () {
    $worker = User::factory()->worker()->create();
    $otherWorker = User::factory()->worker()->create();
    $task = CollectionTask::factory()->for($otherWorker, 'assignedWorker')->create(['status' => 'assigned']);

    $response = $this->actingAs($worker)->post(route('worker.tasks.accept', $task));

    $response->assertForbidden();
});

test('task accept creates status history', function () {
    $worker = User::factory()->worker()->create();
    $task = CollectionTask::factory()->for($worker, 'assignedWorker')->create(['status' => 'assigned']);

    $this->actingAs($worker)->post(route('worker.tasks.accept', $task));

    $this->assertDatabaseHas('task_status_histories', [
        'collection_task_id' => $task->id,
        'changed_by' => $worker->id,
        'old_status' => 'assigned',
        'new_status' => 'accepted',
    ]);
});

// Start Tests
test('worker can start accepted task', function () {
    $worker = User::factory()->worker()->create();
    $task = CollectionTask::factory()->for($worker, 'assignedWorker')->create(['status' => 'accepted']);

    $response = $this->actingAs($worker)->post(route('worker.tasks.start', $task));

    $response->assertRedirect(route('worker.tasks.show', $task));
    $this->assertDatabaseHas('collection_tasks', [
        'id' => $task->id,
        'status' => 'in_progress',
    ]);
    $task->refresh();
    expect($task->started_at)->not->toBeNull();
});

test('worker can start assigned task', function () {
    $worker = User::factory()->worker()->create();
    $task = CollectionTask::factory()->for($worker, 'assignedWorker')->create(['status' => 'assigned']);

    $response = $this->actingAs($worker)->post(route('worker.tasks.start', $task));

    $response->assertRedirect(route('worker.tasks.show', $task));
    $this->assertDatabaseHas('collection_tasks', [
        'id' => $task->id,
        'status' => 'in_progress',
    ]);
});

test('worker cannot start pending task', function () {
    $worker = User::factory()->worker()->create();
    $task = CollectionTask::factory()->for($worker, 'assignedWorker')->create(['status' => 'completed']);

    $response = $this->actingAs($worker)->post(route('worker.tasks.start', $task));

    $response->assertStatus(422);
});

test('starting task updates report status to in progress', function () {
    $worker = User::factory()->worker()->create();
    $report = WasteReport::factory()->create(['status' => 'approved']);
    $task = CollectionTask::factory()->for($worker, 'assignedWorker')->for($report, 'wasteReport')->create(['status' => 'assigned']);

    $this->actingAs($worker)->post(route('worker.tasks.start', $task));

    $report->refresh();
    expect($report->status)->toBe('in_progress');
});

test('task start creates both task and report status histories', function () {
    $worker = User::factory()->worker()->create();
    $report = WasteReport::factory()->create(['status' => 'approved']);
    $task = CollectionTask::factory()->for($worker, 'assignedWorker')->for($report, 'wasteReport')->create(['status' => 'assigned']);

    $this->actingAs($worker)->post(route('worker.tasks.start', $task));

    $this->assertDatabaseHas('task_status_histories', [
        'collection_task_id' => $task->id,
        'changed_by' => $worker->id,
        'old_status' => 'assigned',
        'new_status' => 'in_progress',
    ]);

    $this->assertDatabaseHas('report_status_histories', [
        'waste_report_id' => $report->id,
        'changed_by' => $worker->id,
        'old_status' => 'approved',
        'new_status' => 'in_progress',
    ]);
});

// Complete Tests
test('worker can complete in progress task with valid data', function () {
    $worker = User::factory()->worker()->create();
    $task = CollectionTask::factory()->for($worker, 'assignedWorker')->create(['status' => 'in_progress']);

    $response = $this->actingAs($worker)->post(route('worker.tasks.complete', $task), [
        'completion_notes' => 'Task completed successfully. All waste collected.',
    ]);

    $response->assertRedirect(route('worker.tasks.index'));
    $this->assertDatabaseHas('collection_tasks', [
        'id' => $task->id,
        'status' => 'completed',
        'completion_notes' => 'Task completed successfully. All waste collected.',
    ]);
    $task->refresh();
    expect($task->completed_at)->not->toBeNull();
});

test('completion requires completion notes', function () {
    $worker = User::factory()->worker()->create();
    $task = CollectionTask::factory()->for($worker, 'assignedWorker')->create(['status' => 'in_progress']);

    $response = $this->actingAs($worker)->post(route('worker.tasks.complete', $task), [
        'completion_notes' => '',
    ]);

    $response->assertSessionHasErrors('completion_notes');
});

test('worker can complete task with photo', function () {
    if (! extension_loaded('gd')) {
        $this->markTestSkipped('GD extension is not installed.');
    }

    $worker = User::factory()->worker()->create();
    $task = CollectionTask::factory()->for($worker, 'assignedWorker')->create(['status' => 'in_progress']);
    $photo = UploadedFile::fake()->image('completion.jpg');

    $response = $this->actingAs($worker)->post(route('worker.tasks.complete', $task), [
        'completion_notes' => 'Task completed with photo evidence.',
        'completion_photo' => $photo,
    ]);

    $response->assertRedirect(route('worker.tasks.index'));
    $task->refresh();
    expect($task->completion_photo_path)->not->toBeNull();
    Storage::disk('public')->assertExists($task->completion_photo_path);
});

test('completing task updates report status to resolved', function () {
    $worker = User::factory()->worker()->create();
    $report = WasteReport::factory()->create(['status' => 'in_progress']);
    $task = CollectionTask::factory()->for($worker, 'assignedWorker')->for($report, 'wasteReport')->create(['status' => 'in_progress']);

    $this->actingAs($worker)->post(route('worker.tasks.complete', $task), [
        'completion_notes' => 'Task completed successfully.',
    ]);

    $report->refresh();
    expect($report->status)->toBe('resolved');
});

test('completion creates both task and report status histories', function () {
    $worker = User::factory()->worker()->create();
    $report = WasteReport::factory()->create(['status' => 'in_progress']);
    $task = CollectionTask::factory()->for($worker, 'assignedWorker')->for($report, 'wasteReport')->create(['status' => 'in_progress']);

    $this->actingAs($worker)->post(route('worker.tasks.complete', $task), [
        'completion_notes' => 'Task completed successfully.',
    ]);

    $this->assertDatabaseHas('task_status_histories', [
        'collection_task_id' => $task->id,
        'changed_by' => $worker->id,
        'old_status' => 'in_progress',
        'new_status' => 'completed',
    ]);

    $this->assertDatabaseHas('report_status_histories', [
        'waste_report_id' => $report->id,
        'changed_by' => $worker->id,
        'old_status' => 'in_progress',
        'new_status' => 'resolved',
    ]);
});

test('worker cannot complete task without starting it first', function () {
    $worker = User::factory()->worker()->create();
    $task = CollectionTask::factory()->for($worker, 'assignedWorker')->create(['status' => 'assigned']);

    $response = $this->actingAs($worker)->post(route('worker.tasks.complete', $task), [
        'completion_notes' => 'Trying to complete without starting.',
    ]);

    $response->assertStatus(422);
});

test('completed at timestamp is set on completion', function () {
    $worker = User::factory()->worker()->create();
    $task = CollectionTask::factory()->for($worker, 'assignedWorker')->create(['status' => 'in_progress']);

    $this->actingAs($worker)->post(route('worker.tasks.complete', $task), [
        'completion_notes' => 'Task completed successfully.',
    ]);

    $task->refresh();
    expect($task->completed_at)->not->toBeNull();
});

// Authorization Tests
test('worker cannot change assigned worker id', function () {
    $worker = User::factory()->worker()->create();
    $otherWorker = User::factory()->worker()->create();
    $task = CollectionTask::factory()->for($worker, 'assignedWorker')->create(['status' => 'in_progress']);

    $response = $this->actingAs($worker)->post(route('worker.tasks.complete', $task), [
        'completion_notes' => 'Task completed.',
        'assigned_worker_id' => $otherWorker->id,
    ]);

    $task->refresh();
    expect($task->assigned_worker_id)->toBe($worker->id);
});

test('worker cannot update task status directly without proper action', function () {
    $worker = User::factory()->worker()->create();
    $task = CollectionTask::factory()->for($worker, 'assignedWorker')->create(['status' => 'assigned']);

    // Try to change status to completed without going through proper workflow
    $response = $this->actingAs($worker)->post(route('worker.tasks.complete', $task), [
        'completion_notes' => 'Trying to skip workflow.',
    ]);

    $response->assertStatus(422);
    $task->refresh();
    expect($task->status)->toBe('assigned');
});

test('worker cannot complete another workers task', function () {
    $worker = User::factory()->worker()->create();
    $otherWorker = User::factory()->worker()->create();
    $task = CollectionTask::factory()->for($otherWorker, 'assignedWorker')->create(['status' => 'in_progress']);

    $response = $this->actingAs($worker)->post(route('worker.tasks.complete', $task), [
        'completion_notes' => 'Trying to complete another worker\'s task.',
    ]);

    $response->assertForbidden();
});

// Photo Validation Tests
test('completion photo validates file type', function () {
    $worker = User::factory()->worker()->create();
    $task = CollectionTask::factory()->for($worker, 'assignedWorker')->create(['status' => 'in_progress']);
    $invalidFile = UploadedFile::fake()->create('document.pdf', 100);

    $response = $this->actingAs($worker)->post(route('worker.tasks.complete', $task), [
        'completion_notes' => 'Task completed.',
        'completion_photo' => $invalidFile,
    ]);

    $response->assertSessionHasErrors('completion_photo');
});

test('completion photo validates file size', function () {
    if (! extension_loaded('gd')) {
        $this->markTestSkipped('GD extension is not installed.');
    }

    $worker = User::factory()->worker()->create();
    $task = CollectionTask::factory()->for($worker, 'assignedWorker')->create(['status' => 'in_progress']);
    $largeFile = UploadedFile::fake()->image('large.jpg')->size(6000); // 6MB

    $response = $this->actingAs($worker)->post(route('worker.tasks.complete', $task), [
        'completion_notes' => 'Task completed.',
        'completion_photo' => $largeFile,
    ]);

    $response->assertSessionHasErrors('completion_photo');
});
