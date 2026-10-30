<?php

use App\Models\CollectionTask;
use App\Models\User;
use App\Models\WasteCategory;
use App\Models\WasteReport;

beforeEach(function () {
    $this->category = WasteCategory::factory()->create();
});

test('residents cannot view collection tasks', function () {
    $resident = User::factory()->resident()->create();

    $this->assertFalse($resident->can('viewAny', CollectionTask::class));
});

test('workers can view collection tasks', function () {
    $worker = User::factory()->worker()->create();

    $this->assertTrue($worker->can('viewAny', CollectionTask::class));
});

test('administrators can view collection tasks', function () {
    $admin = User::factory()->administrator()->create();

    $this->assertTrue($admin->can('viewAny', CollectionTask::class));
});

test('workers can only view tasks assigned to them', function () {
    $worker1 = User::factory()->worker()->create();
    $worker2 = User::factory()->worker()->create();
    $admin = User::factory()->administrator()->create();
    $resident = User::factory()->resident()->create();

    $report = WasteReport::factory()->create([
        'resident_id' => $resident->id,
        'waste_category_id' => $this->category->id,
    ]);

    $task1 = CollectionTask::factory()->create([
        'waste_report_id' => $report->id,
        'assigned_worker_id' => $worker1->id,
        'assigned_by' => $admin->id,
    ]);

    $task2 = CollectionTask::factory()->create([
        'waste_report_id' => $report->id,
        'assigned_worker_id' => $worker2->id,
        'assigned_by' => $admin->id,
    ]);

    // Worker 1 can view their task
    $this->assertTrue($worker1->can('view', $task1));
    // But cannot view worker 2's task
    $this->assertFalse($worker1->can('view', $task2));

    // Administrator can view all tasks
    $this->assertTrue($admin->can('view', $task1));
    $this->assertTrue($admin->can('view', $task2));
});

test('only administrators can create collection tasks', function () {
    $resident = User::factory()->resident()->create();
    $worker = User::factory()->worker()->create();
    $admin = User::factory()->administrator()->create();

    $this->assertFalse($resident->can('create', CollectionTask::class));
    $this->assertFalse($worker->can('create', CollectionTask::class));
    $this->assertTrue($admin->can('create', CollectionTask::class));
});

test('workers can update their assigned tasks', function () {
    $worker1 = User::factory()->worker()->create();
    $worker2 = User::factory()->worker()->create();
    $admin = User::factory()->administrator()->create();
    $resident = User::factory()->resident()->create();

    $report = WasteReport::factory()->create([
        'resident_id' => $resident->id,
        'waste_category_id' => $this->category->id,
    ]);

    $task = CollectionTask::factory()->create([
        'waste_report_id' => $report->id,
        'assigned_worker_id' => $worker1->id,
        'assigned_by' => $admin->id,
    ]);

    // Assigned worker can update
    $this->assertTrue($worker1->can('update', $task));

    // Other worker cannot update
    $this->assertFalse($worker2->can('update', $task));

    // Administrator can update
    $this->assertTrue($admin->can('update', $task));

    // Resident cannot update
    $this->assertFalse($resident->can('update', $task));
});

test('only administrators can delete collection tasks', function () {
    $worker = User::factory()->worker()->create();
    $admin = User::factory()->administrator()->create();
    $resident = User::factory()->resident()->create();

    $report = WasteReport::factory()->create([
        'resident_id' => $resident->id,
        'waste_category_id' => $this->category->id,
    ]);

    $task = CollectionTask::factory()->create([
        'waste_report_id' => $report->id,
        'assigned_worker_id' => $worker->id,
        'assigned_by' => $admin->id,
    ]);

    $this->assertFalse($worker->can('delete', $task));
    $this->assertFalse($resident->can('delete', $task));
    $this->assertTrue($admin->can('delete', $task));
});
