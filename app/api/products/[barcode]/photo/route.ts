import { NextRequest, NextResponse } from 'next/server';
import { uploadFile, generateProductPhotoKey } from '@/lib/storage';

export async function POST(
  request: NextRequest,
  { params }: { params: { barcode: string } }
) {
  try {
    const { barcode } = params;
    const formData = await request.formData();
    const file = formData.get('photo') as File;
    const type = formData.get('type') as 'front' | 'nutrition';

    if (!file) {
      return NextResponse.json(
        { error: 'No photo file provided' },
        { status: 400 }
      );
    }

    if (!type || (type !== 'front' && type !== 'nutrition')) {
      return NextResponse.json(
        { error: 'Invalid photo type. Must be "front" or "nutrition"' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const key = generateProductPhotoKey(barcode, type);
    const url = await uploadFile(key, buffer, file.type);

    return NextResponse.json({
      success: true,
      url,
      barcode,
      type,
    });
  } catch (error) {
    console.error('Error uploading photo:', error);
    return NextResponse.json(
      { error: 'Failed to upload photo' },
      { status: 500 }
    );
  }
}

