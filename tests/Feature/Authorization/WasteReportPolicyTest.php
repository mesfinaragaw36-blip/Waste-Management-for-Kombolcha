<?php

use App\Models\User;
use App\Models\WasteCategory;
use App\Models\WasteReport;

beforeEach(function () {
    // Create a waste category for testing
    $this->category = WasteCategory::factory()->create();
});

test('residents can create waste reports', function () {
    $resident = User::factory()->resident()->create();

    $this->assertTrue($resident->can('create', WasteReport::class));
});

test('workers cannot create waste reports', function () {
    $worker = User::factory()->worker()->create();

    $this->assertFalse($worker->can('create', WasteReport::class));
});

test('administrators cannot create waste reports', function () {
    $admin = User::factory()->administrator()->create();

    $this->assertFalse($admin->can('create', WasteReport::class));
});

test('residents can only view their own reports', function () {
    $resident1 = User::factory()->resident()->create();
    $resident2 = User::factory()->resident()->create();

    $report1 = WasteReport::factory()->create([
        'resident_id' => $resident1->id,
        'waste_category_id' => $this->category->id,
    ]);

    $report2 = WasteReport::factory()->create([
        'resident_id' => $resident2->id,
        'waste_category_id' => $this->category->id,
    ]);

    // Resident 1 can view their own report
    $this->assertTrue($resident1->can('view', $report1));
    // But cannot view resident 2's report
    $this->assertFalse($resident1->can('view', $report2));

    // Resident 2 can view their own report
    $this->assertTrue($resident2->can('view', $report2));
    // But cannot view resident 1's report
    $this->assertFalse($resident2->can('view', $report1));
});

test('administrators can view any report', function () {
    $admin = User::factory()->administrator()->create();
    $resident = User::factory()->resident()->create();

    $report = WasteReport::factory()->create([
        'resident_id' => $resident->id,
        'waste_category_id' => $this->category->id,
    ]);

    $this->assertTrue($admin->can('view', $report));
});

test('residents can only update their own pending reports', function () {
    $resident1 = User::factory()->resident()->create();
    $resident2 = User::factory()->resident()->create();

    $pendingReport = WasteReport::factory()->create([
        'resident_id' => $resident1->id,
        'waste_category_id' => $this->category->id,
        'status' => 'pending',
    ]);

    $approvedReport = WasteReport::factory()->create([
        'resident_id' => $resident1->id,
        'waste_category_id' => $this->category->id,
        'status' => 'approved',
    ]);

    $otherReport = WasteReport::factory()->create([
        'resident_id' => $resident2->id,
        'waste_category_id' => $this->category->id,
        'status' => 'pending',
    ]);

    // Can update own pending report
    $this->assertTrue($resident1->can('update', $pendingReport));

    // Cannot update own non-pending report
    $this->assertFalse($resident1->can('update', $approvedReport));

    // Cannot update other resident's report
    $this->assertFalse($resident1->can('update', $otherReport));
});

test('residents can only delete their own pending reports', function () {
    $resident1 = User::factory()->resident()->create();

    $pendingReport = WasteReport::factory()->create([
        'resident_id' => $resident1->id,
        'waste_category_id' => $this->category->id,
        'status' => 'pending',
    ]);

    $approvedReport = WasteReport::factory()->create([
        'resident_id' => $resident1->id,
        'waste_category_id' => $this->category->id,
        'status' => 'approved',
    ]);

    // Can delete own pending report
    $this->assertTrue($resident1->can('delete', $pendingReport));

    // Cannot delete own non-pending report
    $this->assertFalse($resident1->can('delete', $approvedReport));
});

test('only administrators can review reports', function () {
    $resident = User::factory()->resident()->create();
    $worker = User::factory()->worker()->create();
    $admin = User::factory()->administrator()->create();

    $report = WasteReport::factory()->create([
        'resident_id' => $resident->id,
        'waste_category_id' => $this->category->id,
    ]);

    $this->assertFalse($resident->can('review', $report));
    $this->assertFalse($worker->can('review', $report));
    $this->assertTrue($admin->can('review', $report));
});
