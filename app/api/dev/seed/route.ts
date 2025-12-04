import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Product } from '@/types/product';
import { seedProducts } from '@/lib/seed-data';

export const dynamic = 'force-dynamic';

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
