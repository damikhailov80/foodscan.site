import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isProduction = process.env.NODE_ENV === 'production';
  const devModeEnabled = process.env.ENABLE_DEV_ENDPOINTS === 'true';

  if (isProduction && !devModeEnabled) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Development endpoints are disabled in production' 
      },
      { status: 404 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/dev/:path*',
};
