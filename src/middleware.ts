import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE, isValidToken } from "@/lib/auth";

/**
 * Edge middleware is a first line of defence only. Every admin API route also
 * verifies the session server-side (`staffGuard`/`adminGuard`), because
 * middleware alone must never be treated as the authorization boundary.
 */
export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const isAuthenticated = isValidToken(token);

  const isLoginPage = url.pathname === "/admin/login";
  const isAdminPage = url.pathname.startsWith("/admin");
  const isAdminApi = url.pathname.startsWith("/api/admin");

  if (isAdminApi) {
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (isAdminPage) {
    if (!isAuthenticated && !isLoginPage) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    if (isAuthenticated && isLoginPage) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, uploads
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
