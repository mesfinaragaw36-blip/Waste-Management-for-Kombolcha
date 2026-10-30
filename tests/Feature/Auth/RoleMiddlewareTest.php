<?php

use App\Models\User;

test('residents cannot access worker routes', function () {
    $user = User::factory()->resident()->create();
    $this->actingAs($user);

    // Create a test route that requires worker role
    Route::get('/test-worker-route', fn () => 'worker content')
        ->middleware(['auth', 'role:worker']);

    $response = $this->get('/test-worker-route');
    $response->assertForbidden();
});

test('residents cannot access administrator routes', function () {
    $user = User::factory()->resident()->create();
    $this->actingAs($user);

    // Create a test route that requires administrator role
    Route::get('/test-admin-route', fn () => 'admin content')
        ->middleware(['auth', 'role:administrator']);

    $response = $this->get('/test-admin-route');
    $response->assertForbidden();
});

test('workers cannot access administrator routes', function () {
    $user = User::factory()->worker()->create();
    $this->actingAs($user);

    // Create a test route that requires administrator role
    Route::get('/test-admin-route', fn () => 'admin content')
        ->middleware(['auth', 'role:administrator']);

    $response = $this->get('/test-admin-route');
    $response->assertForbidden();
});

test('administrators can access administrator routes', function () {
    $user = User::factory()->administrator()->create();
    $this->actingAs($user);

    // Create a test route that requires administrator role
    Route::get('/test-admin-route', fn () => 'admin content')
        ->middleware(['auth', 'role:administrator']);

    $response = $this->get('/test-admin-route');
    $response->assertOk();
    $response->assertSeeText('admin content');
});

test('workers can access worker routes', function () {
    $user = User::factory()->worker()->create();
    $this->actingAs($user);

    // Create a test route that requires worker role
    Route::get('/test-worker-route', fn () => 'worker content')
        ->middleware(['auth', 'role:worker']);

    $response = $this->get('/test-worker-route');
    $response->assertOk();
    $response->assertSeeText('worker content');
});

test('middleware accepts multiple roles', function () {
    $resident = User::factory()->resident()->create();
    $worker = User::factory()->worker()->create();
    $admin = User::factory()->administrator()->create();

    // Create a test route that allows both workers and administrators
    Route::get('/test-multi-role', fn () => 'content')
        ->middleware(['auth', 'role:worker,administrator']);

    // Resident cannot access
    $this->actingAs($resident);
    $response = $this->get('/test-multi-role');
    $response->assertForbidden();

    // Worker can access
    $this->actingAs($worker);
    $response = $this->get('/test-multi-role');
    $response->assertOk();

    // Administrator can access
    $this->actingAs($admin);
    $response = $this->get('/test-multi-role');
    $response->assertOk();
});

test('unauthenticated users cannot access role-protected routes', function () {
    // Create a test route that requires worker role
    Route::get('/test-protected-route', fn () => 'content')
        ->middleware(['auth', 'role:worker']);

    $response = $this->get('/test-protected-route');
    // Unauthenticated users are redirected to login, not given 403
    $response->assertRedirect(route('login'));
});
