import { NextRequest, NextResponse } from 'next/server';
import { User, UserRole } from './backend/types/types';

async function fetchUser(token: string) {
  const url = process.env.APP_URL + '/api/verify';

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });

  if (!res.ok) {
    console.error("Failed to verify token");
    return null;
  }

  const result = await res.json();

  return result;
}

export async function middleware(request: NextRequest) {


  const token = request.cookies.get('__session')?.value || '';

  const { user }: { user: User } = await fetchUser(token)

  const userRole: UserRole = user?.role

  const { pathname } = request.nextUrl;


  // // Routes that don't require authentication
  const publicPaths = ['/login', '/signup', '/'];

  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {

    // Admin routes protection
    if (pathname.startsWith('/admin') && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }


    return NextResponse.next();
  } catch (error) {
    // Redirect to login if authentication fails
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};