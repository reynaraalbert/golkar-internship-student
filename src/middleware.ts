import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Edge-safe first line of defence.
 *
 * Middleware cannot use Node's `crypto` module, so it only performs a cheap
 * structural/expiry check. The real signature verification and role check
 * happen in every route handler (`staffGuard` / `adminGuard`).
 *
 * NOTE: middleware is never the authorization boundary.
 */
const ADMIN_COOKIE = "golkar_internship_admin_token";
const USER_COOKIE = "golkar_user_token";

function looksLikeValidToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    // base64url -> base64, then decode without Node's Buffer (Edge runtime).
    const base64 = token.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
    const parts = decoded.split(":");
    if (parts.length < 3) return false;
    const expires = Number.parseInt(parts[parts.length - 2], 10);
    return Number.isFinite(expires) && Date.now() <= expires;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl;

  const adminToken = request.cookies.get(ADMIN_COOKIE)?.value;
  const userToken = request.cookies.get(USER_COOKIE)?.value;

  const isAdminAuthenticated = looksLikeValidToken(adminToken);
  const hasParticipantSession = Boolean(userToken);

  const isLoginPage = url.pathname === "/admin/login";
  const isAdminPage = url.pathname.startsWith("/admin");
  const isAdminApi = url.pathname.startsWith("/api/admin");

  if (isAdminApi) {
    if (!isAdminAuthenticated) {
      // A signed-in participant is authenticated but not authorised.
      return NextResponse.json(
        { error: hasParticipantSession ? "Forbidden" : "Unauthorized" },
        { status: hasParticipantSession ? 403 : 401 }
      );
    }
    return NextResponse.next();
  }

  if (isAdminPage) {
    if (!isAdminAuthenticated && !isLoginPage) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    if (isAdminAuthenticated && isLoginPage) {
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
