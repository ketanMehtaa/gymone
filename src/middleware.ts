// Protecting routes with next-auth
// https://next-auth.js.org/configuration/nextjs#middleware
// https://nextjs.org/docs/app/building-your-application/routing/middleware

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuth } from '@/lib/jwt';

// Public routes that don't require authentication
const publicRoutes = ['/'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Check for auth token
  const token = request.cookies.get('token')?.value;

  // Redirect to login if no token found
  if (!token) {
    console.log('No token found, redirecting to login');
    const url = new URL('/', request.url);
    return NextResponse.redirect(url);
  }

  try {
    // Verify token
    const verifiedToken = await verifyAuth(token);
    if (!verifiedToken) {
      console.log('Invalid token, redirecting to login');
      throw new Error('Invalid token');
    }
    console.log('Token verified, proceeding to:', pathname);
    return NextResponse.next();
  } catch (error) {
    // Token is invalid
    console.log('Token verification failed, redirecting to login');
    const url = new URL('/', request.url);
    return NextResponse.redirect(url);
  }
}

// Add routes that should be protected
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)'
  ]
};
