import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Product } from '@/types/product';

export const dynamic = 'force-dynamic';

const seedProducts: Omit<Product, '_id'>[] = [
  {
    bar_code: '3017624010701',
    product_name: 'Nutella',
    brand_name: 'Ferrero',
    nutrition: {
      energy_kcal: 539,
      energy_kj: 2255,
      fat: 30.9,
      carbohydrates: 57.5,
      protein: 6.3,
      salt: 0.107,
    },
  },
  {
    bar_code: '5449000000996',
    product_name: 'Coca-Cola Original Taste',
    brand_name: 'Coca-Cola',
    nutrition: {
      energy_kcal: 42,
      energy_kj: 180,
      fat: 0,
      carbohydrates: 10.6,
      protein: 0,
      salt: 0,
    },
  },
  {
    bar_code: '3033490004545',
    product_name: 'Nature Yogurt',
    brand_name: 'Danone',
    nutrition: {
      energy_kcal: 74,
      energy_kj: 272,
      fat: 3.0,
      carbohydrates: 7.0,
      protein: 4.8,
      salt: 0.07,
    },
  },
];

export async function POST() {
  const isProduction = process.env.NODE_ENV === 'production';
  const devModeEnabled = process.env.ENABLE_DEV_ENDPOINTS === 'true';

  if (isProduction && !devModeEnabled) {
    return NextResponse.json(
      { success: false, error: 'This endpoint is only available in development' },
      { status: 404 }
    );
  }

  try {
    const db = await getDatabase();
    const collection = db.collection<Product>('products');

    const existingCount = await collection.countDocuments();
    if (existingCount > 0) {
      return NextResponse.json({
        success: false,
        error: 'Database already contains products. Use /api/dev/reset first to clear the database.',
      }, { status: 400 });
    }

    const result = await collection.insertMany(seedProducts);

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${result.insertedCount} products`,
      insertedIds: result.insertedIds,
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}
