// middleware.ts - Prevent infinite redirect loops
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// Define public routes that don't need authentication
const publicRoutes = ['/login', '/register', '/auth/callback', '/'];

// Define protected routes that need authentication
const protectedRoutes = ['/dashboard', '/scan', '/inspection', '/admin'];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // Get the pathname of the request
  const { pathname } = req.nextUrl;
  
  console.log(`🔄 Middleware: ${pathname}`);
  
  try {
    // Refresh session if exists
    const { data: { session }, error } = await supabase.auth.getSession();
    
    // Check if the route is protected
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isPublicRoute = publicRoutes.includes(pathname);
    
    // If accessing protected route without session, redirect to login
    if (isProtectedRoute && !session) {
      console.log('🔒 No session, redirecting to login');
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // If accessing login/register with active session, redirect to dashboard
    if ((pathname === '/login' || pathname === '/register') && session) {
      console.log('✅ Already logged in, redirecting to dashboard');
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    
    // If accessing root with session, redirect to dashboard
    if (pathname === '/' && session) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    
    // If accessing root without session, redirect to login
    if (pathname === '/' && !session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    
    return res;
  } catch (error) {
    console.error('❌ Middleware error:', error);
    
    // On error, allow access to public routes only
    if (isPublicRoute) {
      return res;
    }
    
    // Otherwise redirect to login
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
