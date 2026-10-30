<?php

use App\Models\User;

// Index Tests
test('administrator can view all users index', function () {
    $admin = User::factory()->administrator()->create();
    $users = User::factory()->count(3)->create();

    $response = $this->actingAs($admin)->get(route('admin.users.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/users/index')
        ->has('users.data', 4) // 3 created + 1 admin
    );
});

test('administrator can filter users by role', function () {
    $admin = User::factory()->administrator()->create();
    User::factory()->resident()->create();
    User::factory()->worker()->create();
    User::factory()->administrator()->create();

    $response = $this->actingAs($admin)->get(route('admin.users.index', ['role' => 'worker']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('users.data', 1)
        ->where('users.data.0.role', 'worker')
    );
});

test('administrator can search users by name', function () {
    $admin = User::factory()->administrator()->create();
    User::factory()->create(['name' => 'John Doe']);
    User::factory()->create(['name' => 'Jane Smith']);

    $response = $this->actingAs($admin)->get(route('admin.users.index', ['search' => 'John']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('users.data', 1)
        ->where('users.data.0.name', 'John Doe')
    );
});

test('administrator can search users by email', function () {
    $admin = User::factory()->administrator()->create();
    User::factory()->create(['email' => 'john@example.com']);
    User::factory()->create(['email' => 'jane@example.com']);

    $response = $this->actingAs($admin)->get(route('admin.users.index', ['search' => 'john@']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('users.data', 1)
        ->where('users.data.0.email', 'john@example.com')
    );
});

test('resident cannot access admin users index', function () {
    $resident = User::factory()->resident()->create();

    $response = $this->actingAs($resident)->get(route('admin.users.index'));

    $response->assertForbidden();
});

test('worker cannot access admin users index', function () {
    $worker = User::factory()->worker()->create();

    $response = $this->actingAs($worker)->get(route('admin.users.index'));

    $response->assertForbidden();
});

test('guest cannot access admin users index', function () {
    $response = $this->get(route('admin.users.index'));

    $response->assertRedirect(route('login'));
});

// Show Tests
test('administrator can view any user', function () {
    $admin = User::factory()->administrator()->create();
    $user = User::factory()->resident()->create();

    $response = $this->actingAs($admin)->get(route('admin.users.show', $user));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/users/show')
        ->where('user.id', $user->id)
    );
});

test('administrator can view themselves', function () {
    $admin = User::factory()->administrator()->create();

    $response = $this->actingAs($admin)->get(route('admin.users.show', $admin));

    $response->assertOk();
});

test('resident cannot view other users via admin route', function () {
    $resident = User::factory()->resident()->create();
    $otherUser = User::factory()->create();

    $response = $this->actingAs($resident)->get(route('admin.users.show', $otherUser));

    $response->assertForbidden();
});

// Update Role Tests
test('administrator can change user role', function () {
    $admin = User::factory()->administrator()->create();
    $user = User::factory()->resident()->create();

    $response = $this->actingAs($admin)->patch(route('admin.users.update-role', $user), [
        'role' => 'worker',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'role' => 'worker',
    ]);
});

test('administrator can promote resident to worker', function () {
    $admin = User::factory()->administrator()->create();
    $resident = User::factory()->resident()->create();

    $this->actingAs($admin)->patch(route('admin.users.update-role', $resident), [
        'role' => 'worker',
    ]);

    expect($resident->fresh()->role)->toBe('worker');
});

test('administrator can promote worker to administrator', function () {
    $admin = User::factory()->administrator()->create();
    $worker = User::factory()->worker()->create();

    $this->actingAs($admin)->patch(route('admin.users.update-role', $worker), [
        'role' => 'administrator',
    ]);

    expect($worker->fresh()->role)->toBe('administrator');
});

test('administrator can demote another administrator', function () {
    $admin1 = User::factory()->administrator()->create();
    $admin2 = User::factory()->administrator()->create();

    $this->actingAs($admin1)->patch(route('admin.users.update-role', $admin2), [
        'role' => 'worker',
    ]);

    expect($admin2->fresh()->role)->toBe('worker');
});

test('administrator cannot change their own role', function () {
    $admin = User::factory()->administrator()->create();

    $response = $this->actingAs($admin)->patch(route('admin.users.update-role', $admin), [
        'role' => 'worker',
    ]);

    $response->assertForbidden();
    expect($admin->fresh()->role)->toBe('administrator');
});

test('cannot change role to invalid value', function () {
    $admin = User::factory()->administrator()->create();
    $user = User::factory()->resident()->create();

    $response = $this->actingAs($admin)->patch(route('admin.users.update-role', $user), [
        'role' => 'superadmin',
    ]);

    $response->assertSessionHasErrors('role');
});

test('role field is required', function () {
    $admin = User::factory()->administrator()->create();
    $user = User::factory()->resident()->create();

    $response = $this->actingAs($admin)->patch(route('admin.users.update-role', $user), [
        'role' => '',
    ]);

    $response->assertSessionHasErrors('role');
});

test('cannot demote last administrator', function () {
    $admin = User::factory()->administrator()->create();

    $response = $this->actingAs($admin)->patch(route('admin.users.update-role', $admin), [
        'role' => 'worker',
    ]);

    $response->assertForbidden();
});

test('can demote administrator when multiple administrators exist', function () {
    $admin1 = User::factory()->administrator()->create();
    $admin2 = User::factory()->administrator()->create();

    $response = $this->actingAs($admin1)->patch(route('admin.users.update-role', $admin2), [
        'role' => 'worker',
    ]);

    $response->assertRedirect();
    expect($admin2->fresh()->role)->toBe('worker');
});

test('resident cannot change user roles', function () {
    $resident = User::factory()->resident()->create();
    $user = User::factory()->resident()->create();

    $response = $this->actingAs($resident)->patch(route('admin.users.update-role', $user), [
        'role' => 'worker',
    ]);

    $response->assertForbidden();
});

test('worker cannot change user roles', function () {
    $worker = User::factory()->worker()->create();
    $user = User::factory()->resident()->create();

    $response = $this->actingAs($worker)->patch(route('admin.users.update-role', $user), [
        'role' => 'worker',
    ]);

    $response->assertForbidden();
});

test('guest cannot change user roles', function () {
    $user = User::factory()->resident()->create();

    $response = $this->patch(route('admin.users.update-role', $user), [
        'role' => 'worker',
    ]);

    $response->assertRedirect(route('login'));
});
