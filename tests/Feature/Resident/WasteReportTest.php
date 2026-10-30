<?php

use App\Models\User;
use App\Models\WasteCategory;
use App\Models\WasteReport;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
    $this->category = WasteCategory::factory()->create();
    $this->resident = User::factory()->resident()->create();
    $this->worker = User::factory()->worker()->create();
    $this->admin = User::factory()->administrator()->create();
});

// Index tests
test('resident can view their reports index page', function () {
    $this->actingAs($this->resident);
    $response = $this->get(route('resident.reports.index'));
    $response->assertOk();
});

test('resident only sees their own reports in index', function () {
    $ownReport = WasteReport::factory()->create([
        'resident_id' => $this->resident->id,
        'waste_category_id' => $this->category->id,
    ]);

    $otherReport = WasteReport::factory()->create([
        'waste_category_id' => $this->category->id,
    ]);

    $this->actingAs($this->resident);
    $response = $this->get(route('resident.reports.index'));
    $response->assertOk();

    $reports = $response->viewData('page')['props']['reports']['data'];
    expect($reports)->toHaveCount(1);
    expect($reports[0]['id'])->toBe($ownReport->id);
});

test('worker cannot access resident reports index', function () {
    $this->actingAs($this->worker);
    $response = $this->get(route('resident.reports.index'));
    $response->assertForbidden();
});

test('administrator cannot access resident reports index', function () {
    $this->actingAs($this->admin);
    $response = $this->get(route('resident.reports.index'));
    $response->assertForbidden();
});

test('guest cannot access resident reports index', function () {
    $response = $this->get(route('resident.reports.index'));
    $response->assertRedirect(route('login'));
});

// Create tests
test('resident can view create report page', function () {
    $this->actingAs($this->resident);
    $response = $this->get(route('resident.reports.create'));
    $response->assertOk();
});

test('worker cannot access create report page', function () {
    $this->actingAs($this->worker);
    $response = $this->get(route('resident.reports.create'));
    $response->assertForbidden();
});

// Store tests
test('resident can create a valid report', function () {
    $this->actingAs($this->resident);

    $data = [
        'waste_category_id' => $this->category->id,
        'title' => 'Overflowing trash bin',
        'description' => 'The trash bin at the corner is overflowing with waste and causing bad smell.',
        'location_description' => 'Corner of Main Street and 1st Avenue',
        'latitude' => '11.0942',
        'longitude' => '39.7397',
        'priority' => 'high',
    ];

    $response = $this->post(route('resident.reports.store'), $data);

    $response->assertRedirect();
    $this->assertDatabaseHas('waste_reports', [
        'resident_id' => $this->resident->id,
        'waste_category_id' => $this->category->id,
        'title' => 'Overflowing trash bin',
        'status' => 'pending',
    ]);
});

test('resident can create report with photo', function () {
    if (! extension_loaded('gd')) {
        $this->markTestSkipped('GD extension not installed');
    }

    $this->actingAs($this->resident);

    $photo = UploadedFile::fake()->image('waste.jpg', 800, 600);

    $data = [
        'waste_category_id' => $this->category->id,
        'title' => 'Illegal dumping site',
        'description' => 'There is an illegal dumping site with hazardous materials.',
        'location_description' => 'Behind the industrial area',
        'priority' => 'high',
        'photo' => $photo,
    ];

    $response = $this->post(route('resident.reports.store'), $data);

    $response->assertRedirect();
    $report = WasteReport::where('resident_id', $this->resident->id)->first();
    expect($report)->not->toBeNull();
    expect($report->photo_path)->not->toBeNull();
    Storage::disk('public')->assertExists($report->photo_path);
});

test('report creation records initial status history', function () {
    $this->actingAs($this->resident);

    $data = [
        'waste_category_id' => $this->category->id,
        'title' => 'Test report',
        'description' => 'This is a test report to check status history.',
        'location_description' => 'Test location',
        'priority' => 'medium',
    ];

    $response = $this->post(route('resident.reports.store'), $data);

    $report = WasteReport::where('resident_id', $this->resident->id)->first();
    expect($report->statusHistories)->toHaveCount(1);
    expect($report->statusHistories->first()->new_status)->toBe('pending');
    expect($report->statusHistories->first()->old_status)->toBeNull();
});

test('report creation validates required fields', function () {
    $this->actingAs($this->resident);

    $response = $this->post(route('resident.reports.store'), []);

    $response->assertSessionHasErrors([
        'waste_category_id',
        'title',
        'description',
        'location_description',
        'priority',
    ]);
});

test('report creation validates description minimum length', function () {
    $this->actingAs($this->resident);

    $data = [
        'waste_category_id' => $this->category->id,
        'title' => 'Short description test',
        'description' => 'Too short',
        'location_description' => 'Test location',
        'priority' => 'medium',
    ];

    $response = $this->post(route('resident.reports.store'), $data);

    $response->assertSessionHasErrors(['description']);
});

test('report creation validates category exists', function () {
    $this->actingAs($this->resident);

    $data = [
        'waste_category_id' => 99999,
        'title' => 'Test report',
        'description' => 'This is a test report with invalid category.',
        'location_description' => 'Test location',
        'priority' => 'medium',
    ];

    $response = $this->post(route('resident.reports.store'), $data);

    $response->assertSessionHasErrors(['waste_category_id']);
});

test('report creation validates photo file type', function () {
    $this->actingAs($this->resident);

    $photo = UploadedFile::fake()->create('document.pdf', 100);

    $data = [
        'waste_category_id' => $this->category->id,
        'title' => 'Invalid photo test',
        'description' => 'Testing invalid photo file type validation.',
        'location_description' => 'Test location',
        'priority' => 'medium',
        'photo' => $photo,
    ];

    $response = $this->post(route('resident.reports.store'), $data);

    $response->assertSessionHasErrors(['photo']);
});

test('report creation validates photo file size', function () {
    if (! extension_loaded('gd')) {
        $this->markTestSkipped('GD extension not installed');
    }

    $this->actingAs($this->resident);

    $photo = UploadedFile::fake()->image('large.jpg')->size(6000); // 6MB

    $data = [
        'waste_category_id' => $this->category->id,
        'title' => 'Large photo test',
        'description' => 'Testing photo file size validation with large file.',
        'location_description' => 'Test location',
        'priority' => 'medium',
        'photo' => $photo,
    ];

    $response = $this->post(route('resident.reports.store'), $data);

    $response->assertSessionHasErrors(['photo']);
});

test('resident cannot set status when creating report', function () {
    $this->actingAs($this->resident);

    $data = [
        'waste_category_id' => $this->category->id,
        'title' => 'Status injection test',
        'description' => 'Attempting to set status to resolved on creation.',
        'location_description' => 'Test location',
        'priority' => 'medium',
        'status' => 'resolved',
    ];

    $response = $this->post(route('resident.reports.store'), $data);

    $report = WasteReport::where('resident_id', $this->resident->id)->first();
    expect($report->status)->toBe('pending');
});

// Show tests
test('resident can view their own report', function () {
    $report = WasteReport::factory()->create([
        'resident_id' => $this->resident->id,
        'waste_category_id' => $this->category->id,
    ]);

    $this->actingAs($this->resident);
    $response = $this->get(route('resident.reports.show', $report));
    $response->assertOk();
});

test('resident cannot view another residents report', function () {
    $otherReport = WasteReport::factory()->create([
        'waste_category_id' => $this->category->id,
    ]);

    $this->actingAs($this->resident);
    $response = $this->get(route('resident.reports.show', $otherReport));
    $response->assertForbidden();
});

// Edit tests
test('resident can view edit page for their pending report', function () {
    $report = WasteReport::factory()->create([
        'resident_id' => $this->resident->id,
        'waste_category_id' => $this->category->id,
        'status' => 'pending',
    ]);

    $this->actingAs($this->resident);
    $response = $this->get(route('resident.reports.edit', $report));
    $response->assertOk();
});

test('resident cannot edit report with non-pending status', function () {
    $report = WasteReport::factory()->create([
        'resident_id' => $this->resident->id,
        'waste_category_id' => $this->category->id,
        'status' => 'under_review',
    ]);

    $this->actingAs($this->resident);
    $response = $this->get(route('resident.reports.edit', $report));
    $response->assertForbidden();
});

test('resident cannot edit another residents report', function () {
    $otherReport = WasteReport::factory()->create([
        'waste_category_id' => $this->category->id,
        'status' => 'pending',
    ]);

    $this->actingAs($this->resident);
    $response = $this->get(route('resident.reports.edit', $otherReport));
    $response->assertForbidden();
});

// Update tests
test('resident can update their pending report', function () {
    $report = WasteReport::factory()->create([
        'resident_id' => $this->resident->id,
        'waste_category_id' => $this->category->id,
        'status' => 'pending',
        'title' => 'Original title',
    ]);

    $this->actingAs($this->resident);

    $data = [
        'waste_category_id' => $this->category->id,
        'title' => 'Updated title',
        'description' => 'Updated description with sufficient length for validation.',
        'location_description' => 'Updated location',
        'priority' => 'high',
    ];

    $response = $this->put(route('resident.reports.update', $report), $data);

    $response->assertRedirect();
    $this->assertDatabaseHas('waste_reports', [
        'id' => $report->id,
        'title' => 'Updated title',
    ]);
});

test('resident can replace photo when updating report', function () {
    if (! extension_loaded('gd')) {
        $this->markTestSkipped('GD extension not installed');
    }

    $oldPhoto = UploadedFile::fake()->image('old.jpg');
    $report = WasteReport::factory()->create([
        'resident_id' => $this->resident->id,
        'waste_category_id' => $this->category->id,
        'status' => 'pending',
        'photo_path' => $oldPhoto->store('waste-reports', 'public'),
    ]);

    $this->actingAs($this->resident);

    $newPhoto = UploadedFile::fake()->image('new.jpg');
    $data = [
        'waste_category_id' => $this->category->id,
        'title' => 'Photo update test',
        'description' => 'Testing photo replacement during report update.',
        'location_description' => 'Test location',
        'priority' => 'medium',
        'photo' => $newPhoto,
    ];

    $response = $this->put(route('resident.reports.update', $report), $data);

    $report->refresh();
    expect($report->photo_path)->not->toBe($oldPhoto->hashName());
    Storage::disk('public')->assertExists($report->photo_path);
});

test('resident cannot update non-pending report', function () {
    $report = WasteReport::factory()->create([
        'resident_id' => $this->resident->id,
        'waste_category_id' => $this->category->id,
        'status' => 'resolved',
    ]);

    $this->actingAs($this->resident);

    $data = [
        'waste_category_id' => $this->category->id,
        'title' => 'Attempted update',
        'description' => 'Attempting to update a resolved report.',
        'location_description' => 'Test location',
        'priority' => 'high',
    ];

    $response = $this->put(route('resident.reports.update', $report), $data);
    $response->assertForbidden();
});

test('resident cannot change status when updating report', function () {
    $report = WasteReport::factory()->create([
        'resident_id' => $this->resident->id,
        'waste_category_id' => $this->category->id,
        'status' => 'pending',
    ]);

    $this->actingAs($this->resident);

    $data = [
        'waste_category_id' => $this->category->id,
        'title' => 'Status injection test',
        'description' => 'Attempting to change status during update.',
        'location_description' => 'Test location',
        'priority' => 'medium',
        'status' => 'resolved',
    ];

    $response = $this->put(route('resident.reports.update', $report), $data);

    $report->refresh();
    expect($report->status)->toBe('pending');
});

test('resident cannot change resident_id when updating report', function () {
    $report = WasteReport::factory()->create([
        'resident_id' => $this->resident->id,
        'waste_category_id' => $this->category->id,
        'status' => 'pending',
    ]);

    $otherResident = User::factory()->resident()->create();
    $this->actingAs($this->resident);

    $data = [
        'waste_category_id' => $this->category->id,
        'title' => 'Resident injection test',
        'description' => 'Attempting to change resident_id during update.',
        'location_description' => 'Test location',
        'priority' => 'medium',
        'resident_id' => $otherResident->id,
    ];

    $response = $this->put(route('resident.reports.update', $report), $data);

    $report->refresh();
    expect($report->resident_id)->toBe($this->resident->id);
});

// Delete tests
test('resident can delete their pending report', function () {
    $report = WasteReport::factory()->create([
        'resident_id' => $this->resident->id,
        'waste_category_id' => $this->category->id,
        'status' => 'pending',
    ]);

    $this->actingAs($this->resident);
    $response = $this->delete(route('resident.reports.destroy', $report));

    $response->assertRedirect();
    $this->assertSoftDeleted('waste_reports', ['id' => $report->id]);
});

test('resident can delete report with photo', function () {
    if (! extension_loaded('gd')) {
        $this->markTestSkipped('GD extension not installed');
    }

    $photo = UploadedFile::fake()->image('test.jpg');
    $photoPath = $photo->store('waste-reports', 'public');

    $report = WasteReport::factory()->create([
        'resident_id' => $this->resident->id,
        'waste_category_id' => $this->category->id,
        'status' => 'pending',
        'photo_path' => $photoPath,
    ]);

    Storage::disk('public')->assertExists($photoPath);

    $this->actingAs($this->resident);
    $response = $this->delete(route('resident.reports.destroy', $report));

    $response->assertRedirect();
    Storage::disk('public')->assertMissing($photoPath);
});

test('resident cannot delete non-pending report', function () {
    $report = WasteReport::factory()->create([
        'resident_id' => $this->resident->id,
        'waste_category_id' => $this->category->id,
        'status' => 'in_progress',
    ]);

    $this->actingAs($this->resident);
    $response = $this->delete(route('resident.reports.destroy', $report));
    $response->assertForbidden();
});

test('resident cannot delete another residents report', function () {
    $otherReport = WasteReport::factory()->create([
        'waste_category_id' => $this->category->id,
        'status' => 'pending',
    ]);

    $this->actingAs($this->resident);
    $response = $this->delete(route('resident.reports.destroy', $otherReport));
    $response->assertForbidden();
});
