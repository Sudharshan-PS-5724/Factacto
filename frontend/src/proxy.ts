import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ROLE_COOKIE = 'factacto_role';

function getRole(request: NextRequest): 'admin' | 'faculty' | null {
  const raw = request.cookies.get(ROLE_COOKIE)?.value;
  if (!raw) return null;
  if (raw === 'admin' || raw === 'faculty') return raw;
  try {
    const v = decodeURIComponent(raw);
    if (v === 'admin' || v === 'faculty') return v;
  } catch {
    return null;
  }
  return null;
}

/**
 * Enforces: /dashboard  -  any signed-in user (faculty or admin).
 * /admin  -  only admin role; faculty → /dashboard; anonymous → /login.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/dashboard')) {
    const role = getRole(request);
    if (!role) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', pathname + request.nextUrl.search);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    const role = getRole(request);
    if (role === 'faculty') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    if (role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', pathname + request.nextUrl.search);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  // Include bare `/dashboard` and `/admin`  -  `/dashboard/:path*` alone can miss the index route.
  matcher: ['/dashboard', '/dashboard/:path*', '/admin', '/admin/:path*'],
};
