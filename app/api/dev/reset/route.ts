import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function DELETE() {
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
    
    await db.collection('products').drop().catch(() => {
      console.log('Products collection does not exist, continuing...');
    });

    await db.createCollection('products');
    await db.collection('products').createIndex({ bar_code: 1 }, { unique: true });

    return NextResponse.json({
      success: true,
      message: 'Database reset successfully',
    });
  } catch (error) {
    console.error('Error resetting database:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset database' },
      { status: 500 }
    );
  }
}
