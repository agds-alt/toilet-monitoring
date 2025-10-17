// ============================================
// 1. MIDDLEWARE - middleware.ts (ROOT LEVEL)
// ============================================

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Public routes
  const publicRoutes = ['/', '/login'];
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);

  // Protect dashboard routes
const isDashboardRoute = 
  req.nextUrl.pathname === '/' ||
  req.nextUrl.pathname.startsWith('/scan') ||
  req.nextUrl.pathname.startsWith('/inspect') ||
  req.nextUrl.pathname.startsWith('/history') ||
  req.nextUrl.pathname.startsWith('/reports');

if (isDashboardRoute && !session) {

  // Redirect to dashboard if accessing login/root with session
  if (session && isPublicRoute) {
    const redirectUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}


};


