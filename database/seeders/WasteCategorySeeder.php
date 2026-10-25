<?php
 namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WasteCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Household Waste',
                'description' => 'Sample category for general household waste.',
            ],
            [
                'name' => 'Plastic Waste',
                'description' => 'Sample category for discarded plastic materials.',
            ],
            [
                'name' => 'Paper and Cardboard',
                'description' => 'Sample category for waste paper and cardboard.',
            ],
            [
                'name' => 'Organic Waste',
                'description' => 'Sample category for food scraps and other organic materials.',
            ],
            [
                'name' => 'Construction Waste',
                'description' => 'Sample category for discarded construction materials.',
            ],
        ];

        foreach ($categories as $category) {
            DB::table('waste_categories')->updateOrInsert(
                ['name' => $category['name']],
                [
                    'description' => $category['description'],
                    'is_active' => true,
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
        }
    }
}
