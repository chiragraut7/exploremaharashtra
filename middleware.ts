import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 🛡️ 1. Define Robust Content Security Policy
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://www.googletagmanager.com https://pagead2.googlesyndication.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://*.basemaps.cartocdn.com https://*.tile.openstreetmap.org https://www.goexploremaharashtra.in https://*.google.com https://*.gstatic.com https://*.googleapis.com;
    font-src 'self' data: https://fonts.gstatic.com;
    connect-src 'self' https://*.google.com https://*.adtrafficquality.google https://api.open-meteo.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  // Initialize the response
  const response = NextResponse.next();
  
  // Apply CSP to all responses to ensure map tiles load correctly
  response.headers.set('Content-Security-Policy', cspHeader);

  // 🔒 2. API Protection Handshake
  if (pathname.startsWith('/api')) {
    const ADMIN_KEY = process.env.ADMIN_SECRET_KEY;
    const authToken = request.headers.get('x-admin-token');

    // Reject if token is missing or incorrect
    if (!authToken || authToken !== ADMIN_KEY) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { 
            'Content-Type': 'application/json',
            'Content-Security-Policy': cspHeader 
          } 
        }
      );
    }
  }

  return response;
}

// ⚙️ Matcher configuration to exclude static assets for performance
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};