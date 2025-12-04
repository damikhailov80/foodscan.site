import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Product } from '@/types/product';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ barcode: string }> }
) {
  try {
    const { barcode } = await params;
    const db = await getDatabase();
    const product = await db
      .collection<Product>('products')
      .findOne({ bar_code: barcode });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
