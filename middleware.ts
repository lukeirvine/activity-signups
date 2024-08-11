import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const searchParams = url.searchParams;

  if (!url.pathname.startsWith('/dashboard')) {
    const newUrl = new URL(`/dashboard${url.pathname}`, req.url);
    newUrl.search = searchParams.toString();
    return NextResponse.redirect(newUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|fonts|images|auth).*)',
  ],
};
