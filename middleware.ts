import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware untuk protect routes
export async function middleware(req: NextRequest) {
  const token = req.cookies.get('sb-access-token');
  const { pathname } = req.nextUrl;

  // Public routes yang tidak perlu auth
  if (pathname === '/login' || pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Redirect ke login jika tidak ada token
  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login']
};
