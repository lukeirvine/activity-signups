import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const searchParams = url.searchParams;

  if (url.pathname === '/settings') {
    const newUrl = new URL('/settings/departments', req.url);
    newUrl.search = searchParams.toString();
    return NextResponse.redirect(newUrl);
  }

  if (!url.pathname.startsWith('/weeks') && !url.pathname.includes('settings')) {
    const newUrl = new URL(`/weeks${url.pathname}`, req.url);
    newUrl.search = searchParams.toString();
    return NextResponse.redirect(newUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|fonts|images|auth|activities|test).*)',
  ],
};
