import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

const publicPaths = ['/', '/login', '/register'];

interface TokenPayload {
  role: 'ADMIN' | 'STAFF' | 'SUPER_ADMIN';
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow public paths
  if (publicPaths.includes(pathname)) {
    const token = request.cookies.get('token');
    if (token) {
      // If user is logged in, redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Get token from cookies
  const token = request.cookies.get('token')?.value;
  if (!token) {
    // Redirect to login if no token
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const payload = await verifyToken(token) as TokenPayload | null;
    if (!payload) {
      // Clear invalid token and redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }

    // Check super admin routes
    if (pathname.startsWith('/super-admin')) {
      if (payload.role !== 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      return NextResponse.next();
    }

    // Check dashboard routes
    if (pathname.startsWith('/dashboard')) {
      if (!['ADMIN', 'STAFF'].includes(payload.role)) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      return NextResponse.next();
    }

    return NextResponse.next();
  } catch (error) {
    // Clear invalid token and redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('token');
    return response;
  }
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/dashboard/:path*',
    '/super-admin/:path*',
  ],
}; 