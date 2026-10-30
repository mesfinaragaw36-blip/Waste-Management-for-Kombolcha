<?php

use App\Models\User;

test('only administrators can list users', function () {
    $resident = User::factory()->resident()->create();
    $worker = User::factory()->worker()->create();
    $admin = User::factory()->administrator()->create();

    $this->assertFalse($resident->can('viewAny', User::class));
    $this->assertFalse($worker->can('viewAny', User::class));
    $this->assertTrue($admin->can('viewAny', User::class));
});

test('users can view their own profile', function () {
    $user = User::factory()->resident()->create();

    $this->assertTrue($user->can('view', $user));
});

test('administrators can view any user profile', function () {
    $admin = User::factory()->administrator()->create();
    $resident = User::factory()->resident()->create();
    $worker = User::factory()->worker()->create();

    $this->assertTrue($admin->can('view', $resident));
    $this->assertTrue($admin->can('view', $worker));
    $this->assertTrue($admin->can('view', $admin));
});

test('users cannot view other users profiles', function () {
    $resident1 = User::factory()->resident()->create();
    $resident2 = User::factory()->resident()->create();

    $this->assertFalse($resident1->can('view', $resident2));
});

test('only administrators can change user roles', function () {
    $resident = User::factory()->resident()->create();
    $worker = User::factory()->worker()->create();
    $admin1 = User::factory()->administrator()->create();
    $admin2 = User::factory()->administrator()->create();

    // Resident cannot change anyone's role
    $this->assertFalse($resident->can('changeRole', $resident));
    $this->assertFalse($resident->can('changeRole', $worker));
    $this->assertFalse($resident->can('changeRole', $admin1));

    // Worker cannot change anyone's role
    $this->assertFalse($worker->can('changeRole', $resident));
    $this->assertFalse($worker->can('changeRole', $worker));

    // Administrator can change other users' roles
    $this->assertTrue($admin1->can('changeRole', $resident));
    $this->assertTrue($admin1->can('changeRole', $worker));
    $this->assertTrue($admin1->can('changeRole', $admin2));

    // Administrator cannot change their own role
    $this->assertFalse($admin1->can('changeRole', $admin1));
});

test('users can update their own profile', function () {
    $user = User::factory()->resident()->create();

    $this->assertTrue($user->can('update', $user));
});

test('administrators can update any user profile', function () {
    $admin = User::factory()->administrator()->create();
    $resident = User::factory()->resident()->create();

    $this->assertTrue($admin->can('update', $resident));
});

test('users can delete their own account', function () {
    $user = User::factory()->resident()->create();

    $this->assertTrue($user->can('delete', $user));
});

test('administrators can delete other user accounts', function () {
    $admin = User::factory()->administrator()->create();
    $resident = User::factory()->resident()->create();

    $this->assertTrue($admin->can('delete', $resident));
});

test('users cannot delete other user accounts', function () {
    $resident1 = User::factory()->resident()->create();
    $resident2 = User::factory()->resident()->create();

    $this->assertFalse($resident1->can('delete', $resident2));
});
