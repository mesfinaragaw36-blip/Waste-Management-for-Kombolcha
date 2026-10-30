<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string $role
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'email', 'password', 'role'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    /**
     * User role constants
     */
    public const ROLE_RESIDENT = 'resident';

    public const ROLE_WORKER = 'worker';

    public const ROLE_ADMINISTRATOR = 'administrator';

    /**
     * Valid user roles
     */
    public const VALID_ROLES = [
        self::ROLE_RESIDENT,
        self::ROLE_WORKER,
        self::ROLE_ADMINISTRATOR,
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    /**
     * Check if the user is a resident.
     */
    public function isResident(): bool
    {
        return $this->role === self::ROLE_RESIDENT;
    }

    /**
     * Check if the user is a worker.
     */
    public function isWorker(): bool
    {
        return $this->role === self::ROLE_WORKER;
    }

    /**
     * Check if the user is an administrator.
     */
    public function isAdministrator(): bool
    {
        return $this->role === self::ROLE_ADMINISTRATOR;
    }

    /**
     * Check if the user has the given role.
     */
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    /**
     * Check if the user has any of the given roles.
     */
    public function hasAnyRole(array $roles): bool
    {
        return in_array($this->role, $roles, true);
    }

    public function wasteReports(): HasMany
    {
        return $this->hasMany(WasteReport::class, 'resident_id');
    }

    public function assignedCollectionTasks(): HasMany
    {
        return $this->hasMany(CollectionTask::class, 'assigned_worker_id');
    }

    public function createdCollectionTasks(): HasMany
    {
        return $this->hasMany(CollectionTask::class, 'assigned_by');
    }

    public function reportStatusChanges(): HasMany
    {
        return $this->hasMany(ReportStatusHistory::class, 'changed_by');
    }

    public function taskStatusChanges(): HasMany
    {
        return $this->hasMany(TaskStatusHistory::class, 'changed_by');
    }
}
