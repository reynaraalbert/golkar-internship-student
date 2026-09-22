import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE = "golkar_internship_admin_token";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  // Tentukan apakah request dikirim dari Domain Admin
  // (misalnya: admingolkarinternship.com, admin.golkarinternship.com, admin.localhost, dsb)
  const isAdminDomain =
    hostname.startsWith("admin.") ||
    hostname.includes("admingolkarinternship") ||
    url.searchParams.get("domain") === "admin";

  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const isLoginPage = url.pathname === "/admin/login";
  const isAdminRoute = url.pathname.startsWith("/admin");

  // --- Skenario 1: Akses Melalui Domain Admin (admingolkarinternship.com) ---
  if (isAdminDomain) {
    // Jika mengakses root '/' pada domain admin
    if (url.pathname === "/") {
      if (!token) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
      return NextResponse.rewrite(new URL("/admin", request.url));
    }

    // Protection check untuk halaman admin pada domain admin
    if (isAdminRoute && !isLoginPage && !token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    if (isLoginPage && token) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // --- Skenario 2: Akses Melalui Domain User Utama (golkarinternship.com) ---
  if (!isAdminDomain && isAdminRoute) {
    // Jika mengakses /admin/login tanpa token di domain utama
    if (!token && !isLoginPage) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes (unless handled)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, uploads
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
