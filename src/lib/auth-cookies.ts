import type { NextRequest } from "next/server";

/** Production (HTTPS) uses the `__Secure-` prefix; dev uses the plain name. */
const SESSION_COOKIE_NAMES = [
  "__Secure-better-auth.session_token",
  "better-auth.session_token",
] as const;

export function getSessionCookie(request: NextRequest) {
  for (const name of SESSION_COOKIE_NAMES) {
    const cookie = request.cookies.get(name);
    if (cookie?.value) return cookie;
  }
  return undefined;
}

export function hasSessionCookie(request: NextRequest): boolean {
  return Boolean(getSessionCookie(request)?.value);
}
