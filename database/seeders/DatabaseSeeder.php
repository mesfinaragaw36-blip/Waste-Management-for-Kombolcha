<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Administrator
        // Email: admin@example.com, Password: password
        User::factory()->administrator()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
        ]);

        // Create Test Resident
        // Email: test@example.com, Password: password
        User::factory()->resident()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
        ]);

        // Create Test Worker
        // Email: worker@example.com, Password: password
        User::factory()->worker()->create([
            'name' => 'Worker User',
            'email' => 'worker@example.com',
            'password' => Hash::make('password'),
        ]);

        // Seed waste categories
        $this->call(WasteCategorySeeder::class);
    }
}
