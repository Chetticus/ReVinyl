// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

import {
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  DEFAULT_LOGIN_REDIRECT,
} from './types/route';
import { ERouteTable } from '@/constants/route';
import { verifyJwt } from './lib/jwt';

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  const token = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;

  const user = token ? verifyJwt(token) : null;
  const isLoggedIn = !!user || !!refreshToken; // Coi như đã login nếu có refresh token

  // Nếu là route login/register mà đã login → redirect về dashboard
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url));
  }

  // Nếu không login và route không công khai → redirect đến login
  if (!isLoggedIn && !isPublicRoute && !isApiAuthRoute) {
    const encodedCallbackUrl = encodeURIComponent(
      nextUrl.pathname + nextUrl.search
    );
    return NextResponse.redirect(
      new URL(`${ERouteTable.LOGIN}?callbackUrl=${encodedCallbackUrl}`, req.url)
    );
  }

  // Optional: check role nếu cần phân quyền
  if (user) {
    const path = nextUrl.pathname;
    if (path.startsWith('/admin') && user.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/).*)'],
};
