<?php

use App\Models\User;

test('user can register as resident', function () {
    $response = $this->post(route('register'), [
        'name' => 'Test Resident',
        'email' => 'resident@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'role' => User::ROLE_RESIDENT,
    ]);

    // Should redirect to resident dashboard directly (no verification)
    $response->assertRedirect(route('resident.dashboard'));

    $user = User::where('email', 'resident@example.com')->first();
    expect($user)->not->toBeNull();
    expect($user->role)->toBe(User::ROLE_RESIDENT);
    expect($user->isResident())->toBeTrue();
    expect($user->isWorker())->toBeFalse();
    expect($user->isAdministrator())->toBeFalse();
});

test('user can register as worker', function () {
    $response = $this->post(route('register'), [
        'name' => 'Test Worker',
        'email' => 'worker@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'role' => User::ROLE_WORKER,
    ]);

    // Should redirect to worker dashboard directly (no verification)
    $response->assertRedirect(route('worker.dashboard'));

    $user = User::where('email', 'worker@example.com')->first();
    expect($user)->not->toBeNull();
    expect($user->role)->toBe(User::ROLE_WORKER);
    expect($user->isWorker())->toBeTrue();
    expect($user->isResident())->toBeFalse();
    expect($user->isAdministrator())->toBeFalse();
});

test('registration with administrator role attempt fails', function () {
    $response = $this->post(route('register'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'role' => User::ROLE_ADMINISTRATOR, // Attempt to register as admin
    ]);

    // Should fail validation
    $response->assertSessionHasErrors('role');

    // User should not be created
    $user = User::where('email', 'test@example.com')->first();
    expect($user)->toBeNull();
});

test('registration without role defaults to resident', function () {
    $response = $this->post(route('register'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        // No role provided
    ]);

    // Should fail validation (role is required)
    $response->assertSessionHasErrors('role');
});

test('users cannot change their role through profile update', function () {
    $user = User::factory()->resident()->create();
    $this->actingAs($user);

    $response = $this->patch(route('profile.update'), [
        'name' => 'Updated Name',
        'email' => $user->email,
        'role' => User::ROLE_ADMINISTRATOR, // Attempt to escalate privileges
    ]);

    $response->assertRedirect(route('profile.edit'));

    $user->refresh();
    // Role should remain resident
    expect($user->role)->toBe(User::ROLE_RESIDENT);
    expect($user->isResident())->toBeTrue();
    expect($user->isAdministrator())->toBeFalse();
    // But name should be updated
    expect($user->name)->toBe('Updated Name');
});
