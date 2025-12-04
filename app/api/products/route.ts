import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Product } from '@/types/product';

export async function GET() {
  try {
    const db = await getDatabase();
    const products = await db
      .collection<Product>('products')
      .find({})
      .toArray();

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
