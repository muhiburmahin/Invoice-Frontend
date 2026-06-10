import { NextRequest, NextResponse } from "next/server";

import { AUTH_ROUTES } from "@/config/public-routes";
import { hasSessionCookie } from "@/lib/auth-cookies";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith(AUTH_ROUTES.verifyEmail)) {
    return NextResponse.next();
  }

  if (!hasSessionCookie(request)) {
    return NextResponse.redirect(new URL(AUTH_ROUTES.login, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/clients/:path*",
    "/invoices/:path*",
    "/payments/:path*",
    "/settings/:path*",
    "/recurring/:path*",
  ],
};
