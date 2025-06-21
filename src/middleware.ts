import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const authRoutes = ['/auth/login', '/auth/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;


  const authToken = request.cookies.get('auth_token')?.value;


  if (authToken) {
    if (authRoutes.includes(pathname)) {
      const absoluteURL = new URL('/dashboard', request.url);
      return NextResponse.redirect(absoluteURL);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [

    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 