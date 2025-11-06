import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const barcode = searchParams.get('barcode');

  if (!barcode) {
    return NextResponse.json(
      { error: 'Barcode parameter is required' },
      { status: 400 }
    );
  }

  const externalApiUrl = process.env.EXTERNAL_API_URL;
  const bearerToken = process.env.EXTERNAL_API_BEARER_TOKEN;

  if (!externalApiUrl || !bearerToken) {
    return NextResponse.json(
      { error: 'API configuration is missing' },
      { status: 500 }
    );
  }

  try {
    const url = `${externalApiUrl}/api/v1/products/lookup?barcode=${barcode}`;
    const headers = {
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, { headers });

    let data = await response.text();
    
    data = data.replace(/&quot;/g, '\\"');
    
    try {
      JSON.parse(data);
    } catch (parseError) {
    }
    
    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch product data' },
      { status: 500 }
    );
  }
}
